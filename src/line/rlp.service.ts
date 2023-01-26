import { KbankInquiryDto } from './../kbank/dto/inquiry-kbank.dto';
import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import * as moment from 'moment';
import { Transaction_buffer } from 'src/Database/Transaction_Entity/buffer_transaction.entity';
import { Confirm_transaction } from 'src/Database/Transaction_Entity/confirm_transaction.entity';
import { LineRequestQr } from './entity/line-request-qr.entity';
import { PaymentChannelConfig } from '../Database/MMS_Entity/payment_channel_config.entity';
import { MerchantProfile } from '../Database/MMS_Entity/merchant_profile.entity';
import { ResponseCode } from 'src/error_handler/responseDecode';
import { DatabaseService } from '../Database/database.service';
import { CallbackService } from '../callback/callback.service';
import { PaymentChannelBBL } from '../Database/MMS_Entity/payment_channel_bbl.entity';
import { PaymentChannelKbank } from '../Database/MMS_Entity/payment_channel_kbank.entity';
import { PaymentChannelKerryWallet } from '../Database/MMS_Entity/payment_channel_kerry_wallet.entity';
import { PaymentChannelRabbitWallet } from '../Database/MMS_Entity/payment_channel_rabbit_wallet.entity';
import { PaymentChannelRLP } from '../Database/MMS_Entity/payment_channel_rlp.entity';
import { MMS_manager } from '../Database/mms_managemen';
import { Transaction_manager } from '../Database/transaction_management';

@Injectable()
export class RLPService {
    constructor(
        private readonly CallbackService: CallbackService,
        private readonly httpService: HttpService,
        private readonly DatabaseService: DatabaseService,
        private readonly MMS_manager: MMS_manager,
        private readonly Transaction_manager: Transaction_manager
    ) { }

    async requestLineQr(body: any, mms_config): Promise<any> {

        let product_name
        const transaction_datetime = moment().utcOffset('+0700')
        const master_id = await this.MMS_manager.get_masterId_by_merchantId(mms_config.merchant_id)
        const get_seqence = await this.Transaction_manager.get_txn_sequence()

        if (body.hasOwnProperty("package_description")) {
            if (!body?.package_description?.hasOwnProperty("name")) {
                product_name = "Rabbit_PGW"
            } else {
                product_name = body.package_description.name
            }
        } else {
            product_name = "Rabbit_PGW"
        }


        let confirmUrl;
        if (process.env.ENVIRONMENT === 'development') {
            confirmUrl = "https://gateway-dev.api.rabbit.co.th/v1/notice/rabbitlinepay"
        } else if (process.env.ENVIRONMENT === 'test') {
            confirmUrl = "https://gateway-test.api.rabbit.co.th/v1/notice/rabbitlinepay"
        } else if (process.env.ENVIRONMENT === 'production') {
            confirmUrl = "https://gateway.api.rabbit.co.th/v1/notice/rabbitlinepay"
        }

        let qr_config = {
            reference1: moment(new Date).utcOffset('+0700').format("YYMMDDHHmmssSSS") + ("00000" + get_seqence).slice(-5),
            productName: product_name,
            productImageUrl: "https://gateway.rabbit.co.th/img-bts-logo/bts_logo.png",
            amount: Number(body.amount),
            currency: "THB",
            orderId: moment(new Date).utcOffset('+0700').format("YYMMDDHHmmssSSS") + ("00000" + get_seqence).slice(-5),
            confirmUrl: confirmUrl,
            confirmUrlType: "CLIENT",
            partnerId: mms_config.channel_id,
            partnerSecret: mms_config.channel_secret,
        }

        const config = {
            headers: {
                "Content-Type": 'application/json;charset=UTF-8',
                "X-LINE-ChannelId": qr_config.partnerId,
                "X-LINE-ChannelSecret": qr_config.partnerSecret,
                "X-LINE-MerchantDeviceType": 'DEVICE_PROFILE_ID',
            },
            transformResponse: [data => data]
        };

        const testUrlRLP = "https://sandbox-api-pay.line.me/v2/payments/request"
        let data_req: LineRequestQr = {
            productName: qr_config.productName,
            productImageUrl: qr_config.productImageUrl,
            amount: +qr_config.amount.toFixed(2),
            currency: qr_config.currency,
            orderId: qr_config.orderId,
            confirmUrl: qr_config.confirmUrl,
            cancelUrl: null,
            capture: true,
            confirmUrlType: qr_config.confirmUrlType,
        }
        let get_qr_line

        try {
            get_qr_line = await this.httpService.axiosRef.post(testUrlRLP, data_req, config).then(response => {
                let parsed = JSON.parse(response.data.replace(/"transactionId":(\d+),/g, '"transactionId":"$1",'));
                return parsed
            })
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.PaymentChannelDown, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }


        // const txn_type_id = paymentChannelToTxnTypeId[body.payment_channel];

        const transaction_insert = {
            bss_txn_id: qr_config.reference1,
            payment_channel_id: mms_config.payment_channel_id,
            payment_channel_config_id: mms_config.payment_channel_config_id,
            payment_channel_name: mms_config.payment_channel_name,
            request_datetime: body.request_datetime,
            client_request_id: body.request_id,
            txn_type_id: 0,
            payment_status: 0,
            merchant_id: mms_config.merchant_id,
            master_merchant_id: master_id,
            location_id: body?.location_id || null,
            device_id: body.device_id,
            cashier_id: body?.cashier_id || null,
            payment_channel_txn_id: get_qr_line.info.transactionId,
            payment_channel_method: "BscanC",
            payment_code: get_qr_line.info.paymentUrl.web,
            payment_type_id: 0,
            payment_code_receive_datetime: transaction_datetime.toISOString(),
            expire_time: 300,
            expire_at: transaction_datetime.add(300, 'seconds').toISOString(),
            product_detail: "testdata",
            currency: "THB",
            amount: Math.round(qr_config.amount * 100),
            reference1: qr_config.reference1,
            reference2: null,
            reference3: null,
            reference4: null,
            device_type_id: body?.device_type || 1,
            notify_url: body.notify_url || null,
            inquiry_count: 0
        }

        await this.Transaction_manager.insert_transaction_buffer(transaction_insert)

        const result = {
            "responseCode": "0000",
            "responseMessage": "Accepted and processing",
            "data": {
                "payment_channel": body.payment_channel,
                "payment_code": get_qr_line.info.paymentUrl.web
                ,
                "transaction_id": qr_config.reference1,
                "expire_time": 300
            }
        }
        return result

    }

    async inquiry_line(in_buffer_tb, get_config_inquiry_mms): Promise<any> {
        let result: any = {
            responseCode: "9999",
            responseMessage: "INTERNAL ERROR"
        }

        const header_config = {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Line-ChannelId": get_config_inquiry_mms.channel_id,
            "X-Line-ChannelSecret": get_config_inquiry_mms.channel_secret,
        }
        const url = get_config_inquiry_mms.base_url + get_config_inquiry_mms.inquiry_path;
        try {
            const response = await this.httpService.axiosRef.get(url,
                {
                    params: {
                        orderId: in_buffer_tb.bss_txn_id,
                        // transactionId: parseInt(in_buffer_tb.payment_channel_txn_id)
                    },
                    headers: header_config,
                    timeout: 5000
                })

            if (response.data.returnCode === '0000') {
                let confirm_txn = JSON.parse(JSON.stringify(in_buffer_tb))
                confirm_txn.payment_status_datetime = moment().utcOffset('+0700')
                confirm_txn.payment_status = 2
                confirm_txn.confirm_type = 0
                await this.Transaction_manager.insert_txn_confirm(confirm_txn)

                result.responseCode = "0000"
                result.responseMessage = "PAID"
                result.transaction_id = in_buffer_tb.bss_txn_id
                result.transaction_datetime = moment(in_buffer_tb.payment_status_datetime).utc().add(7, 'hours').format('YYYY-MM-DDTHH:mm:SS.sss+07:00')
                result.amount = in_buffer_tb.amount / 100
                result.currency = in_buffer_tb.currency
                await this.Transaction_manager.update_txn_buffer_inquiry(in_buffer_tb.bss_txn_id)

            }
            else if (response.data.returnCode === '1150') {
                result["responseCode"] = "0004"
                result["responseMessage"] = "REQUESTED"

            } else {

                result.responseCode = "9999"
                result.responseMessage = "INTERNAL ERROR"
            }
            console.log(result)
            return result
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.InternalError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async notice_linepay(param): Promise<any> {

        try {
            // const in_buffer_tb: any = (await this.Buffer_transaction_tb.query(`select * from transaction_buffer where payment_channel_txn_id = \$1`,
            //     [param.transactionId]))[0]
            // console.log(in_buffer_tb)

            const in_buffer_tb: any = await this.Transaction_manager.get_txn_buffer_channel_ref(param.transactionId);

            if (in_buffer_tb === undefined) {
                return "transactionId not found"
            }
            if (in_buffer_tb.payment_channel_name != "RabbitLinePay") {
                return "Wrong Transaction id"
            }

            const confirm_result = await this.confirm_payment_linepay(in_buffer_tb)
            if (confirm_result != 'success') {
                throw new HttpException({ status_code: ResponseCode.InternalError }, HttpStatus.INTERNAL_SERVER_ERROR)
            }

            in_buffer_tb.confirm_type = 1
            in_buffer_tb.callback_payment_channel_status = true
            in_buffer_tb.callback_payment_channel_timestamp = moment().utcOffset('+0700')
            in_buffer_tb.last_status_datetime = in_buffer_tb.callback_payment_channel_timestamp
            in_buffer_tb.callback_merchant_status = false
            // in_buffer_tb.callback_merchant_timestamp = in_buffer_tb.callback_payment_channel_timestamp
            in_buffer_tb.callback_merchant_retry_count = 0
            in_buffer_tb.payment_status_datetime = moment().utcOffset('+0700')
            in_buffer_tb.payment_status = 1
            await this.Transaction_manager.update_txn_buffer_callback(in_buffer_tb.bss_txn_id)
            await this.Transaction_manager.insert_txn_confirm(in_buffer_tb)
            // await this.Confirm_transaction_tb.createQueryBuilder().insert().into(Confirm_transaction).values(in_buffer_tb).execute()
            // await this.DatabaseService.update_txn_confirm_callback(in_buffer_tb.bss_txn_id)

            // await this.Buffer_transaction_tb.createQueryBuilder().delete().from(Transaction_buffer).where("bss_txn_id = :bss_txn_id", { bss_txn_id: in_buffer_tb.bss_txn_id }).execute()
            if (in_buffer_tb.notify_url !== null) {
                console.log()
                await this.CallbackService.callback_merchant(in_buffer_tb);
            }
            return "payment Successfully"
        } catch (error) {

            console.log(moment())
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.InternalError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async confirm_payment_linepay(in_buffer_tb): Promise<any> {

        const get_config_payment_channel = await this.MMS_manager.get_payment_credential_rlp_confirm(in_buffer_tb)

        try {

            let confirm_url_rlp = get_config_payment_channel.base_url + get_config_payment_channel.confirm_path
            confirm_url_rlp = confirm_url_rlp.replace('${rlp_transaction_id}', in_buffer_tb.payment_channel_txn_id);
            console.log(confirm_url_rlp)
            // const confirm_url_test_rlp = `https://sandbox-api-pay.line.me/v2/payments/${in_buffer_tb.payment_channel_txn_id}/confirm`
            const confirm_req_header = {
                "Content-Type": "application/json;charset=UTF-8",
                "X-Line-ChannelId": get_config_payment_channel.channel_id,
                "X-Line-ChannelSecret": get_config_payment_channel.channel_secret,
            }
            const confirm_req_body = {
                "amount": in_buffer_tb.amount / 100,
                "currency": in_buffer_tb.currency
            }
            const res = await this.httpService.axiosRef.post(confirm_url_rlp, confirm_req_body, {
                headers: confirm_req_header,
                timeout: 5000
            });
            console.log(res.data)
            return "success"
        } catch (error) {

            console.log(moment())
            console.log(error)
            throw new HttpException({ status_code: ResponseCode.InternalError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }


    }






}