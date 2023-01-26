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
export class DatabaseService {
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


   

    async exec_mms(sql, param) {
        let result

        try {
            result = await this.MerchantProfile.query(`${sql}`, param)
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result
    }


    async exec_transaction(sql, param) {
        let result

        try {
            result = await this.Buffer_transaction_tb.query(`${sql}`, param)
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result
    }

    async exec_transaction_no_param(sql) {
        let result

        try {
            result = await this.Buffer_transaction_tb.query(`${sql}`)
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result
    }





}

