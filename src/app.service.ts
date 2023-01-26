import { Transaction_manager } from './Database/transaction_management';
import { MMS_manager } from './Database/mms_managemen';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';
// import { ErrorHandlerService } from './error_handler/error_handler.service'
import { BBLService } from './bbl/bbl.service';
import { KbankService } from './kbank/kbank.service';
import { RLPService } from './line/rlp.service';
import * as moment from 'moment';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PrimaryColumn, Repository } from 'typeorm';
import { Transaction_buffer } from './Database/Transaction_Entity/buffer_transaction.entity';
import { PaymentChannelConfig } from './Database/MMS_Entity/payment_channel_config.entity';
import { MerchantProfile } from './Database/MMS_Entity/merchant_profile.entity';
import { Confirm_transaction } from './Database/Transaction_Entity/confirm_transaction.entity';
import { GetQrBody, GetQrHeader, InquiryQuery } from './app.interface';
import { ResponseCode } from './error_handler/responseDecode';
import { DatabaseService } from './Database/database.service';

@Injectable()
export class paymentService {
  constructor(
    private readonly AuthenticationService: AuthenticationService,
    private readonly BBLService: BBLService,
    private readonly RLPService: RLPService,
    private readonly DatabaseService: DatabaseService,
    private readonly MMS_manager: MMS_manager,
    private readonly Transaction_manager: Transaction_manager,
  ) {}

  async paymentRequest(
    header: GetQrHeader,
    body: GetQrBody,
    request: any,
  ): Promise<any> {
    await this.AuthenticationService.hmac_auth_permission(
      body,
      header,
      request,
    );
    const mms_config: any = await this.MMS_manager.get_mms_config(
      header.partnerid,
      body.payment_channel,
    );
    let result;

    try {
      switch (body.payment_channel) {
        case 'THAIQR':
        case 'THAIQR-TOPUP': {
          if (mms_config.payment_channel_name.includes('BBL')) {
            result = await this.BBLService.getQrBBL(body, mms_config);
          }
          break;
        }
        case 'RabbitLinePay': {
          result = await this.RLPService.requestLineQr(body, mms_config);
          break;
        }
      }
    } catch (error) {
      throw new HttpException(
        { status_code: ResponseCode.InternalError, message: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async inquiryRequest(param: InquiryQuery): Promise<any> {
    // const sql_transaction_in_buffer = [`select * from transaction_buffer where bss_txn_id = \$1`, [param.transactionid]]
    // const in_buffer_tb = (await this.DatabaseService.exec_transaction(sql_transaction_in_buffer[0], sql_transaction_in_buffer[1]))[0]
    const in_buffer_tb = await this.Transaction_manager.get_txn_by_txnId(
      param.transactionid,
    );

    let result: any = {};

    // const partner_id_sql = [`select partner_id from merchant_auth where merchant_id = \$1`, [in_buffer_tb.merchant_id]];
    // const partner_id = (await this.DatabaseService.exec_mms(partner_id_sql[0], partner_id_sql[1]))[0].partner_id
    const partner_id = await this.MMS_manager.get_partnerId_by_merchantId(
      in_buffer_tb.merchant_id,
    );

    console.log(partner_id);
    if (in_buffer_tb != undefined && partner_id === param.partnerid) {
      // const update_sql_inquiry = ['update transaction_buffer set inquiry_count = inquiry_count+1 where bss_txn_id = \$1', [param.transactionid]]
      // await this.DatabaseService.exec_transaction(update_sql_inquiry[0], update_sql_inquiry[1])
      await this.Transaction_manager.increment_inquiry_counter(
        param.transactionid,
      );
      // console.log(moment(in_buffer_tb.payment_status_datetime).format('YYYY-MM-DDTHH:mm:SS.sss+07:00'))
      if (
        in_buffer_tb.bss_txn_id === param.transactionid &&
        (in_buffer_tb.payment_status === 1 || in_buffer_tb.payment_status === 2)
      ) {
        result.responseCode = '0000';
        result.responseMessage = 'PAID';
        result.transaction_id = in_buffer_tb.bss_txn_id;
        result.transaction_datetime = moment(
          in_buffer_tb.payment_status_datetime,
        ).format('YYYY-MM-DDTHH:mm:SS.sss+07:00');
        result.amount = (in_buffer_tb.amount / 100).toFixed(2).toString();
        result.currency = in_buffer_tb.currency;
      } else if (
        in_buffer_tb.bss_txn_id === param.transactionid &&
        in_buffer_tb.payment_status === 0
      ) {
        const get_conig_payment_channel: any =
          await this.MMS_manager.get_mms_payment_channel_config(
            in_buffer_tb.payment_channel_id,
            in_buffer_tb.payment_channel_config_id,
          );
        if (get_conig_payment_channel.payment_channel_name.includes('BBL')) {
          result = await this.BBLService.inquiry_bbl(
            in_buffer_tb,
            get_conig_payment_channel,
          );
        }

        if (
          get_conig_payment_channel.payment_channel_name.includes(
            'RabbitLinePay',
          )
        ) {
          result = await this.RLPService.inquiry_line(
            in_buffer_tb,
            get_conig_payment_channel,
          );
        }
      }
    } else {
      result.responseCode = '0003';
      result.responseMessage = 'NOT_FOUND';
    }

    return result;
  }

  async app_notice_linepay(param): Promise<any> {
    return await this.RLPService.notice_linepay(param);
  }

  async app_notice_bbl(header, body, param): Promise<any> {
    const result_notice = await this.BBLService.notice_bbl(header, body, param);

    return result_notice;
  }

  // async app_bypass_notice_bbl(header, body, param): Promise<any> {
  //     const result_notice = await this.BBLService.notice_bbl(header, body, param)
  //     return result_notice
  // }

  // async get_history(header, param): Promise<any> {
  //     console.log("bef head")

  //     console.log(header)
  //     console.log(param)
  //     console.log("af param")

  //     let history_result = await this.DatabaseService.get_history(header, param)
  //     console.log(history_result)
  //     return
  // }
}
