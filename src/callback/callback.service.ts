import { Transaction_manager } from 'src/Database/transaction_management';
import { MMS_manager } from 'src/Database/mms_managemen';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as moment from 'moment';
import { DatabaseService } from '../Database/database.service';
import { createHmac } from 'crypto'
import { ResponseCode } from 'src/error_handler/responseDecode';
import { request } from 'http';

@Injectable()
export class CallbackService {

    constructor(
        private readonly httpService: HttpService,
        // private readonly ErrorHandlerService: ErrorHandlerService,
        private readonly DatabaseService: DatabaseService,
        private readonly MMS_manager: MMS_manager,
        private readonly Transaction_manager: Transaction_manager,

    ) { }


    async callback_merchant(insert_data) {

        let partner_config: any = await this.MMS_manager.get_partner_config(insert_data.merchant_id)

        let request_data = {
            "status_code": "0000",
            "status_message": "Payment Success",
            "transaction_id": insert_data.bss_txn_id,
            "transaction_datetime": insert_data.request_datetime,
            "request_id": insert_data.client_request_id,
            "partnerid": partner_config.partner_id,
            "currency": insert_data.currency,
            "amount": (insert_data.amount / 100).toString()
        }


        console.log(request_data)


        const nonce = moment().utcOffset('+0700').toISOString()
        const urlString = insert_data.notify_url;
        const url = new URL(urlString);
        const path = url.pathname;

        const datatohash = partner_config.partner_secret + path + JSON.stringify(request_data) + nonce
        const signature = createHmac('sha256', partner_config.partner_secret).update(datatohash).digest('base64')

        let request_header = {
            "Content-Type": "application/json;charset=UTF-8",
            "partnerid": partner_config.partner_id,
            "nonce": nonce,
            "authorization": signature
        }
        let response
        try {
            this.Transaction_manager.update_callback_merchant(insert_data.bss_txn_id)
        } catch (error) {
            throw new HttpException({ status_code: ResponseCode.DatabaseConnectionError, message: error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        let attempts = 0;
        while (attempts < 3) {
            try {
                response = await this.httpService.axiosRef.post(urlString, request_data, {
                    headers: request_header,
                    timeout: 5000
                });
                break; // exit the loop if the request is successful
            } catch (error) {
                attempts++;
            }
        }

    }


}
