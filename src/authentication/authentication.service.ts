import { MMS_manager } from './../Database/mms_managemen';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto'
import { ResponseCode } from '../error_handler/responseDecode';
import { DatabaseService } from '../Database/database.service'

@Injectable()
export class AuthenticationService {
    constructor(

        private DatabaseService: DatabaseService,
        private MMS_manager: MMS_manager
    ) { }

    async hmac_auth_permission(body: any, header: any, request: any): Promise<any> {


        const partner_credential = await this.MMS_manager.get_partner_auth(header.partnerid)

        if (partner_credential === undefined) {
            throw new HttpException({ status_code: ResponseCode.WrongCredential }, HttpStatus.UNAUTHORIZED)
        }

        // appsecret + Url + requestbody + nonce  ; DATA to hash
        const datatohash = partner_credential.partner_secret + request.url + JSON.stringify(body) + header.nonce

        const hmac_comparator = createHmac('sha256', partner_credential.partner_secret).update(datatohash).digest('base64')

        // console.log(datatohash + '\n')
        if (hmac_comparator != header.authorization) {
            console.log(datatohash)
            console.log(hmac_comparator)
            throw new HttpException({ status_code: ResponseCode.WrongCredential }, HttpStatus.UNAUTHORIZED)
        }

    }
}
