import { Length } from 'class-validator';
import { HttpException, HttpStatus, Injectable, HttpCode } from '@nestjs/common';
import * as crc from 'crc'
import { BBLInquiry } from './entity/bbl-inquiry.entity';
import { BBLRequestQr, QrConfig, QrData } from './entity/bbl-request-qr.entity';
import { HttpService } from '@nestjs/axios';
import { BBLRefundDataVerification } from './entity/bbl-refund-data-verification.entity';
import { BBLRefundAdvice } from './entity/bbl-refund-advice.entity';
import { BBLRefundReversal } from './entity/bbl-refund-reversal.entity';
import * as fs from 'fs';
import * as https from 'https';
import * as moment from 'moment';
import { Confirm_transaction } from '../Database/Transaction_Entity/confirm_transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction_buffer } from '../Database/Transaction_Entity/buffer_transaction.entity';
import { buffer } from 'stream/consumers';
import { MerchantProfile } from '../Database/MMS_Entity/merchant_profile.entity';
// import { ErrorHandlerService } from '../error_handler/error_handler.service'
import { ResponseCode } from '../error_handler/responseDecode';
import { DatabaseService } from '../Database/database.service';
import { CallbackService } from '../callback/callback.service';
import { MMS_manager } from '../Database/mms_managemen';
import { Transaction_manager } from '../Database/transaction_management';

@Injectable()
export class BBLService {
  constructor(
    private readonly httpService: HttpService,
    // private readonly ErrorHandlerService: ErrorHandlerService,
    private readonly DatabaseService: DatabaseService,
    private readonly CallbackService: CallbackService,
    private readonly MMS_manager: MMS_manager,
    private readonly Transaction_manager: Transaction_manager

    // @InjectRepository(Confirm_transaction)
    // private Confirm_transaction_tb: Repository<Confirm_transaction>,
  ) { }


  async getQrBBL(body: any, mms_config): Promise<any> {

    let result: any;

    const transaction_datetime = moment().utcOffset('+0700')
    const master_id = await this.MMS_manager.get_masterId_by_merchantId(mms_config.merchant_id)
    const get_seqence = await this.Transaction_manager.get_txn_sequence()

    let qr_config: QrConfig = {
      merchantIdentifierAID: mms_config.aid,
      billerId: mms_config.biller_id,
      transDate: moment(new Date).utcOffset('+0700').format("YYYY-MM-DD"),
      amount: Number(body.amount),
      reference1: moment(new Date).utcOffset('+0700').format("YYMMDDHHmmssSSS") + ("00000" + get_seqence).slice(-5),
      reference2: "0",
      bank_merchant_name: mms_config.payment_channel_name.slice(-(mms_config.payment_channel_name.length - 4))
    }

    let qrCode = new QrData
    qrCode.payloadFormatIndicator = '000201'
    qrCode.pointOfInitiationMethod = '010212'
    qrCode.transactionCurrencyCode = '5303764'
    qrCode.countryCode = '5802TH'
    qrCode.merchantIdentifierAID = '00' + qr_config.merchantIdentifierAID.length + qr_config.merchantIdentifierAID
    qrCode.merchantIdentifierBillerID = '01' + qr_config.billerId.length + qr_config.billerId
    qrCode.merchantIdentifierReference1 = '02' + + qr_config.reference1.length + qr_config.reference1
    qrCode.merchantIdentifierReference2 = '03' + (qr_config.reference2.length < 10 ? '0' : '') + qr_config.reference2.length + qr_config.reference2
    qrCode.merchantIdentifier = '30' + (qrCode.merchantIdentifierAID + qrCode.merchantIdentifierBillerID + qrCode.merchantIdentifierReference1 + qrCode.merchantIdentifierReference2).length
    qrCode.transactionAmount = '54' + (qr_config.amount.toFixed(2).toString().length < 10 ? '0' +
      qr_config.amount.toFixed(2).toString().length : qr_config.amount.toFixed(2).toString().length) + qr_config.amount.toFixed(2)
    qrCode.merchantName = '59' + (qr_config.bank_merchant_name.length < 10 ? '0' +
      qr_config.bank_merchant_name.length : qr_config.bank_merchant_name) + qr_config.bank_merchant_name
    qrCode.qrData = qrCode.payloadFormatIndicator + qrCode.pointOfInitiationMethod + qrCode.merchantIdentifier + qrCode.merchantIdentifierAID + qrCode.merchantIdentifierBillerID + qrCode.merchantIdentifierReference1 + qrCode.merchantIdentifierReference2 + qrCode.transactionCurrencyCode + qrCode.transactionAmount + qrCode.countryCode + qrCode.merchantName + '6304'
    qrCode.crcQrData = crc.crc16ccitt(qrCode.qrData).toString(16).padStart(4, '0').toUpperCase();
    qrCode.qrCode = qrCode.qrData + qrCode.crcQrData
    const paymentChannelToTxnTypeId = {
      "THAIQR": 0,
      "THAIQR-TOPUP": 0
    }

    const txn_type_id = paymentChannelToTxnTypeId[body.payment_channel];

    const transaction_insert = {
      bss_txn_id: qr_config.reference1,
      payment_channel_id: mms_config.payment_channel_id,
      payment_channel_config_id: mms_config.payment_channel_config_id,
      payment_channel_name: mms_config.payment_channel_name,
      request_datetime: body.request_datetime,
      client_request_id: body.request_id,
      txn_type_id: txn_type_id,
      payment_status: 0,
      merchant_id: mms_config.merchant_id,
      master_merchant_id: master_id,
      location_id: body?.location_id || null,
      device_id: body.device_id,
      cashier_id: body?.cashier_id || null,
      payment_channel_txn_id: "",
      payment_channel_method: "BscanC",
      payment_code: qrCode.qrCode,
      payment_type_id: 0,
      payment_code_receive_datetime: transaction_datetime.toISOString(),
      expire_time: 300,
      expire_at: transaction_datetime.add(300, 'seconds').toISOString(),
      product_detail: JSON.stringify(body?.package_description),
      currency: body.currency,
      amount: Math.round(qr_config.amount * 100),
      reference1: qr_config.reference1,
      reference2: qr_config?.reference2 || null,
      reference3: null,
      reference4: null,
      device_type_id: body?.device_type || 1,
      notify_url: body.notify_url || null,
      inquiry_count: 0
    }

    await this.Transaction_manager.insert_transaction_buffer(transaction_insert)

    result = {
      "responseCode": "0000",
      "responseMessage": "Accepted and processing",
      "data": {
        "payment_channel": body.payment_channel,
        "payment_code": qrCode.qrCode,
        "transaction_id": qr_config.reference1,
        "expire_time": 300
      }
    }

    return result
  }


  async inquiry_bbl(in_buffer_tb, get_config_inquiry_mms): Promise<any> {

    const header_config = {
      "Content-Type": "application/json;charset=UTF-8",
      "Request-Ref": Math.floor(Math.random() * 10000000000000),
      "Transmit-Date-Time": moment().utcOffset('+0700').toISOString(),
      "authorization": "Basic " + Buffer.from(`${get_config_inquiry_mms.inquiry_id}:${get_config_inquiry_mms.inquiry_secret}`).toString('base64'),
    }
    const body_config = {
      "billerId": get_config_inquiry_mms.biller_id,
      "transDate": moment().utcOffset('+0700').format("YYYY-MM-DD"),
      "amount": (in_buffer_tb.amount / 100).toFixed(2).toString(),
      "reference1": in_buffer_tb.reference1,
      "reference2": in_buffer_tb.reference2,
    }

    const clientId = in_buffer_tb.payment_channel_name.slice(-(in_buffer_tb.payment_channel_name.length - 4));
    const providerId = "QRCGW";
    let url = `${get_config_inquiry_mms.base_url}` + `${get_config_inquiry_mms.inquiry_path}`
    url = url.replace("${clientId}", clientId).replace("${providerId}", get_config_inquiry_mms.provider_id)

    const cert_file = fs.readFileSync(`./certificate/bbl_cert/BBL_Cert090223.cer`);
    const agent = new https.Agent({
      requestCert: true,
      rejectUnauthorized: false,
      cert: cert_file,
    });

    let res, confirm_txn = JSON.parse(JSON.stringify(in_buffer_tb))

    try {
      res = await this.httpService.axiosRef.post(url, body_config, {
        headers: header_config,
        httpsAgent: agent,
        timeout: 5000
      })
    } catch (error) {
      throw new HttpException({ status_code: ResponseCode.PaymentChannelDown, message: error.data }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const status_code_inquiry = res?.data?.responseCode
    const response_code_bbl: any = {
      '000': ["0000", "PAID"],
      '052': ["0003", "NOT_FOUND"],
      '054': ["9998", "Payment Channel Not Response"],
      '209': ["0004", "REQUESTED"],
      '210': ["9998", "Payment Channel Not Response"],
      '211': ["0003", "NOT_FOUND"],
      '341': ["9998", "Payment Channel Not Response"],
      '888': ["9999", "Internal Error"],
      '': ["9998", "Payment Channel Not Response"],
      null: ["9998", "Payment Channel Not Response"],
    }
    let result: any = {}

    if (status_code_inquiry === '000') {

      in_buffer_tb.confirm_type = 0
      in_buffer_tb.callback_payment_channel_status = false
      in_buffer_tb.callback_payment_channel_timestamp = moment().utcOffset('+0700')
      in_buffer_tb.last_status_datetime = in_buffer_tb.callback_payment_channel_timestamp
      in_buffer_tb.callback_merchant_status = false
      in_buffer_tb.callback_merchant_timestamp = in_buffer_tb.callback_payment_channel_timestamp
      in_buffer_tb.callback_merchant_retry_count = 0
      in_buffer_tb.inquiry_count = in_buffer_tb.inquiry_count + 1
      in_buffer_tb.payment_status_datetime = in_buffer_tb.callback_payment_channel_timestamp


      confirm_txn.payment_status_datetime = in_buffer_tb.callback_payment_channel_timestamp
      confirm_txn.payment_status = 2
      await this.Transaction_manager.insert_txn_confirm(confirm_txn)
      result.responseCode = "0000"
      result.responseMessage = "PAID"
      result.transaction_id = in_buffer_tb.bss_txn_id
      result.transaction_datetime = moment(in_buffer_tb.payment_status_datetime).utc().add(7, 'hours').format('YYYY-MM-DDTHH:mm:SS.sss+07:00')
      result.amount = (in_buffer_tb.amount / 100).toFixed(2).toString()
      result.currency = in_buffer_tb.currency
      await this.Transaction_manager.update_txn_buffer_inquiry(in_buffer_tb.bss_txn_id)
    } else {
      result.responseCode = response_code_bbl[status_code_inquiry][0]
      result.responseMessage = response_code_bbl[status_code_inquiry][1]
    }

    return result;
  }

  async notice_bbl(header, body, param): Promise<any> {

    const channel_credential: any = await this.MMS_manager.get_payment_credential_bbl(param);

    const verification_code = "Basic " + Buffer.from(`${channel_credential.callback_id}:${channel_credential.callback_secret} `).toString('base64')
    if (verification_code !== header.authorization) {
      console.log(verification_code, header.authorization, channel_credential.partner_id, channel_credential.partner_secret)
      throw new HttpException({ status_code: ResponseCode.WrongCredential }, HttpStatus.BAD_REQUEST)
    }

    const in_buffer_tb = await this.Transaction_manager.get_txn_by_txnId(body.reference1)
    if (in_buffer_tb === undefined) {
      throw new HttpException({ status_code: ResponseCode.InvalidData }, HttpStatus.BAD_REQUEST)
    }

    if (!(in_buffer_tb.payment_channel_name.includes("BBL"))) {
      throw new HttpException({ status_code: ResponseCode.InvalidData }, HttpStatus.BAD_REQUEST)
    }

    let insert_data: any = { ...in_buffer_tb }

    insert_data.confirm_type = 1
    insert_data.callback_payment_channel_status = true
    insert_data.callback_payment_channel_timestamp = moment().utcOffset('+0700')
    insert_data.last_status_datetime = in_buffer_tb.callback_payment_channel_timestamp
    insert_data.callback_merchant_status = false
    // in_buffer_tb.callback_merchant_timestamp = in_buffer_tb.callback_payment_channel_timestamp
    insert_data.callback_merchant_retry_count = 0
    insert_data.payment_status_datetime = moment().utcOffset('+0700')
    insert_data.payment_status = 1;
    await this.Transaction_manager.insert_txn_confirm(insert_data)
    await this.Transaction_manager.update_txn_buffer_callback(in_buffer_tb.bss_txn_id)

    if (insert_data.notify_url != null) {
      await this.CallbackService.callback_merchant(insert_data);
    }


    let result: any = {
      responseCode: "000",
      responseMesg: "Success"
    }

    return result
  }


}
