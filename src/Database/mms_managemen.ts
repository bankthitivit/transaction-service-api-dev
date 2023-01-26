import { Length, ValidateNested } from 'class-validator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
// const regex = require('regex');
// import * as regex from 'regex';
import { ResponseCode } from 'src/error_handler/responseDecode';
import { Repository } from 'typeorm';
import { MerchantProfile } from './MMS_Entity/merchant_profile.entity'
import { Transaction_buffer } from './Transaction_Entity/buffer_transaction.entity';
import { Confirm_transaction } from './Transaction_Entity/confirm_transaction.entity';
import { PaymentChannelConfig } from './MMS_Entity/payment_channel_config.entity'
import { PaymentChannelBBL } from './MMS_Entity/payment_channel_bbl.entity';
import { PaymentChannelKbank } from './MMS_Entity/payment_channel_kbank.entity';
import { PaymentChannelKerryWallet } from './MMS_Entity/payment_channel_kerry_wallet.entity';
import { PaymentChannelRabbitWallet } from './MMS_Entity/payment_channel_rabbit_wallet.entity';
import { PaymentChannelRLP } from './MMS_Entity/payment_channel_rlp.entity';
import { MerchantAuth } from './MMS_Entity/merchant_auth.entity';
import { channel } from 'diagnostics_channel';


@Injectable()
export class MMS_manager {
    constructor(
        @InjectRepository(MerchantProfile, 'mms')
        private MerchantProfile: Repository<MerchantProfile>,
        @InjectRepository(MerchantAuth, 'mms')
        private MerchantAuth: Repository<MerchantAuth>,
        // @InjectRepository(Transaction_buffer)
        // private Buffer_transaction_tb: Repository<Transaction_buffer>,
        // @InjectRepository(Confirm_transaction)
        // private Confirm_transaction_tb: Repository<Confirm_transaction>,
        @InjectRepository(PaymentChannelConfig, 'mms')
        private PaymentChannelConfig: Repository<PaymentChannelConfig>,

    ) { }

    async get_partner_auth(partner_id: any): Promise<any> {

        let result

        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");

        try {
            result = (await slaveQueryRunner.query(`select partner_id, partner_secret from 
            merchant_auth where partner_id = \$1`, [partner_id]))[0]
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()
        }
        return result
    }



    async get_mms_config(partnerid: any, payment_channel: any) {
        let get_config: any
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");

        async function thaiqr_get_config(merged_payment_channel_config) {
            const pattern_thaiqr = new RegExp('THAIQR', 'i')
            const current_thaiqr_channel = merged_payment_channel_config.filter((item) => (pattern_thaiqr.test(item.payment_channel_table_name) && item.payment_channel_id == item.current_payment_channel_id));
            const config_thaiqr = await slaveQueryRunner.query(`select payment_channel_config_id,payment_channel_name, config_name,config_value from ${current_thaiqr_channel[0].payment_channel_table_name}`)
            let config
            const pattern_topup = new RegExp('TOPUP', 'i')

            if (payment_channel === "THAIQR-TOPUP") {
                config = config_thaiqr.filter((item) => pattern_topup.test(item.payment_channel_name))
            }
            // console.log(config_thaiqr)
            if (payment_channel === "THAIQR") {
                const topup_config_id = config_thaiqr.find((item) => pattern_topup.test(item.payment_channel_name))
                const payment_channel_no_topup = current_thaiqr_channel.filter((item) => item.payment_channel_config_id != topup_config_id.payment_channel_config_id)
                config = config_thaiqr.filter((item) => item.payment_channel_config_id == payment_channel_no_topup[0].payment_channel_config_id)
            }
            let config_map = {};
            config_map["payment_channel_id"] = current_thaiqr_channel[0].payment_channel_id
            config_map["payment_channel_name"] = config[0].payment_channel_name
            config_map["payment_channel_config_id"] = config[0].payment_channel_config_id

            for (let i = 0; i < config.length; i++) {
                config_map[config[i].config_name] = config[i].config_value
            }

            return config_map
        }

        async function rabbit_line_pay_get_config(merged_payment_channel_config) {
            const rlp_channel = merged_payment_channel_config.filter((item) => item.payment_channel_table_name == "payment_channel_rlp");
            const config = await slaveQueryRunner.query(`select payment_channel_config_id,payment_channel_name, config_name,config_value
             from payment_channel_rlp where payment_channel_config_id = ${rlp_channel[0].payment_channel_config_id}`)
            let config_map = {};
            config_map["payment_channel_id"] = rlp_channel[0].payment_channel_id
            config_map["payment_channel_name"] = config[0].payment_channel_name
            config_map["payment_channel_config_id"] = config[0].payment_channel_config_id

            for (let i = 0; i < config.length; i++) {
                config_map[config[i].config_name] = config[i].config_value
            }
            return config_map
        }
        try {

            const merchant_profile = await slaveQueryRunner.query(`select merchant_profile.merchant_id,merchant_profile.payment_channel_id,
            merchant_profile.payment_channel_config_id, merchant_profile.profile_status,merchant_data.merchant_status from merchant_auth
            inner join merchant_profile on merchant_auth.merchant_id = merchant_profile.merchant_id
            inner join merchant_data on merchant_auth.merchant_id = merchant_data.merchant_id
            where merchant_auth.partner_id = \$1`, [partnerid])

            console.log(merchant_profile)
            if (merchant_profile[0].merchant_status == 0) {
                throw new Error("User BANNED")
            }

            let payment_channel_list = "";

            for (let i = 0; i < merchant_profile.length; i++) {
                payment_channel_list = merchant_profile[i].payment_channel_id + ',' + payment_channel_list
            }
            if (payment_channel_list.length > 0) {
                payment_channel_list = payment_channel_list.slice(0, -1)
            }

            const all_payment_channels = await slaveQueryRunner.query(`select payment_channel_config.payment_channel_id,payment_channel_config.payment_channel_table_name,
            payment_channel_config.payment_channel_status,payment_channel_config.current_payment_channel_id from payment_channel_config where payment_channel_id in (${payment_channel_list})`)
            const merged_payment_channel_config = merchant_profile.map((item1) => {
                const item2 = all_payment_channels.find((i) => i.payment_channel_id === item1.payment_channel_id);
                return { ...item1, ...item2 };
            });

            const pattern_thaiqr = new RegExp('THAIQR')
            if (pattern_thaiqr.test(payment_channel)) {
                get_config = await thaiqr_get_config(merged_payment_channel_config)
            } else if (payment_channel == "RabbitLinePay") {
                get_config = await rabbit_line_pay_get_config(merged_payment_channel_config)
            }
            // console.log(merchant_profile[0])
            get_config.merchant_id = merchant_profile[0].merchant_id

        } catch (error) {
            if (error.message == "User BANNED") {
                throw new HttpException({ status_code: ResponseCode.NoPermissionPaymentChannel, message: error }, HttpStatus.BAD_REQUEST)
            }
            throw new HttpException({ status_code: ResponseCode.ConfigNotFound, message: error }, HttpStatus.BAD_REQUEST)
        } finally {
            await slaveQueryRunner.release()
        }

        if (get_config === undefined) {
            throw new HttpException({ status_code: ResponseCode.ConfigNotFound }, HttpStatus.BAD_REQUEST)
        }

        return get_config;
    }


    async get_masterId_by_merchantId(master_id: any): Promise<any> {
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");
        let result: any
        try {
            result = (await slaveQueryRunner.query(`select master_id from merchant_group where merchant_id = \$1 `, [master_id]))[0].master_id
        } catch (error) {
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()
        }
        return result
    }

    async get_partnerId_by_merchantId(merchant_id): Promise<any> {
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");
        let result: any
        try {
            result = (await slaveQueryRunner.query(`select partner_id from merchant_auth where merchant_id = \$1`, [merchant_id]))[0].partner_id
        } catch (error) {
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()
        }
        return result
    }


    async get_mms_payment_channel_config(payment_channel_id, payment_channel_config_id) {
        let result, config
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");

        let config_map: any = {}
        try {
            const get_table_name = (await slaveQueryRunner.query(`select payment_channel_table_name from payment_channel_config where payment_channel_id = \$1`, [payment_channel_id]))[0]
            config = await this.MerchantProfile.query(`select * from ${get_table_name.payment_channel_table_name} where payment_channel_config_id = \$1`, [payment_channel_config_id])
            for (let i = 0; i < config.length; i++) {
                config_map[config[i].config_name] = config[i].config_value
            }
            config_map["payment_channel_name"] = config[0].payment_channel_name

        } catch (error) {
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)

        } finally {
            await slaveQueryRunner.release()

        }
        return config_map
    }

    async get_partner_config(merchant_id) {
        let get_config
        let result = {}
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");

        try {
            get_config = (await slaveQueryRunner.query(`select * from merchant_auth where merchant_id = \$1`, [merchant_id]))[0]
        } catch (error) {
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.ConfigNotFound, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()
        }
        return get_config
    }


    async get_payment_credential_bbl(services) {
        let result;
        let config_map = {}
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");

        try {

            const config = await slaveQueryRunner.query(`select config_name,config_value from public.payment_channel_bbl_thaiqr where payment_channel_name LIKE \$1 AND (config_name = \$2 OR config_name = \$3 );`, [`%${services}%`, "callback_id", "callback_secret"]);
            for (let i = 0; i < config.length; i++) {
                config_map[config[i].config_name] = config[i].config_value
            }

        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()

        }
        return config_map
    }

    async get_payment_credential_rlp_confirm(in_buffer_tb) {
        let config_map: any = {}
        const slaveQueryRunner = this.MerchantAuth.manager.connection.createQueryRunner("slave");

        try {
            const config = await this.MerchantProfile.query(`select config_name,config_value from payment_channel_rlp where payment_channel_config_id = 
            \$1`, [in_buffer_tb.payment_channel_config_id])
            for (let i = 0; i < config.length; i++) {
                config_map[config[i].config_name] = config[i].config_value
            }
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)

        } finally {
            await slaveQueryRunner.release()

        }

        return config_map
    }


    
}