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
export class Transaction_manager {
    constructor(
        @InjectRepository(MerchantProfile, 'mms')
        private MerchantProfile: Repository<MerchantProfile>,
        @InjectRepository(MerchantAuth, 'mms')
        private MerchantAuth: Repository<MerchantAuth>,
        @InjectRepository(Transaction_buffer)
        private Buffer_transaction_tb: Repository<Transaction_buffer>,
        @InjectRepository(Confirm_transaction)
        private Confirm_transaction_tb: Repository<Confirm_transaction>,
        @InjectRepository(PaymentChannelConfig, 'mms')
        private PaymentChannelConfig: Repository<PaymentChannelConfig>,

    ) { }
    async get_txn_sequence() {
        let result: any
        try {
            result = (await this.Buffer_transaction_tb.query(`SELECT nextval('public."transaction_id_seq"')`))[0].nextval

            if (result > 90000) {
                await this.Buffer_transaction_tb.query(`alter sequence transaction_id_seq restart start with 0`)
            }
        } catch (error) {
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return result
    }

    async insert_transaction_buffer(transaction_insert) {
        try {
            await this.Buffer_transaction_tb.createQueryBuilder().insert().into(Transaction_buffer).values([transaction_insert]).execute()
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async get_txn_by_txnId(bss_txn_id) {
        const slaveQueryRunner = this.Buffer_transaction_tb.manager.connection.createQueryRunner("slave");
        let result;
        try {
            result = (await slaveQueryRunner.query(`select * from transaction_buffer where bss_txn_id = \$1`, [bss_txn_id]))[0]
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()
        }
        return result
    }

    // async get_txn_buffer(transactionid) {
    //     let result
    //     try {
    //         console.log(transactionid)
    //         result = (await this.Buffer_transaction_tb.query(`select * from transaction_buffer where bss_txn_id = \$1`,
    //             [transactionid]))[0]
    //     } catch (error) {
    //         throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    //     return result
    // }


    async get_txn_buffer_channel_ref(transactionid) {
        let result
        const slaveQueryRunner = this.Buffer_transaction_tb.manager.connection.createQueryRunner("slave");

        try {
            console.log(transactionid)
            result = (await slaveQueryRunner.query(`select * from transaction_buffer where payment_channel_txn_id = \$1`,
                [transactionid]))[0]
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await slaveQueryRunner.release()
        }
        return result
    }

    async increment_inquiry_counter(bss_txn_id) {
        try {
            await this.Buffer_transaction_tb.query(`update transaction_buffer set inquiry_count = inquiry_count+1 where bss_txn_id = \$1`, [bss_txn_id])
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async insert_txn_confirm(in_buffer_tb) {
        let result
        try {
            result = await this.Confirm_transaction_tb.createQueryBuilder().insert().into(Confirm_transaction).values(in_buffer_tb).execute()
        } catch (error) {
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result
    }

    async update_txn_buffer_callback(bss_txn_id) {
        let result;
        try {
            result = await this.Buffer_transaction_tb.query('update transaction_buffer set payment_status = case when payment_status != 2 then 1 else payment_status end, payment_status_datetime = NOW() where bss_txn_id = \$1', [bss_txn_id])
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update_callback_merchant(bss_txn_id) {
        let result;
        try {
            result = await this.Confirm_transaction_tb.query(`update confirm_transaction set callback_merchant_status = true where bss_txn_id = \$1`, [bss_txn_id])
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update_txn_buffer_inquiry(bss_txn_id) {
        let result;
        try {
            result = await this.Buffer_transaction_tb.query('update transaction_buffer set payment_status = case when payment_status != 1 then 2 else payment_status end, payment_status_datetime = NOW() where bss_txn_id = \$1', [bss_txn_id])
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}