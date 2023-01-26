import { Injectable } from '@nestjs/common';
import { CreateKbankDto } from './dto/create-kbank.dto';
import { ConfigService } from '@nestjs/config';
import { getQrResponseError, getQrResponseSuccess, getStatusCodeError, getStatusCodeSuccess, KbankErrorDesc, KbankTxnStatus, TestKbankNoticeRequest, TestKbankQR, TestKbankQRResponse, TestResponseToKbank } from './interface/kbank.interface';
import { reference1 } from './tool/reference';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { genQR } from './tool/genQR';
import { KbankInquiryDto } from './dto/inquiry-kbank.dto';
import * as fs from 'fs';
import * as https from 'https'
import * as axios from 'axios'

@Injectable()
export class KbankService {
  constructor(

    private readonly configService: ConfigService,

    private readonly httpService: HttpService

  ) { }

  //ขอ QR กับ kbank
  async getQrKbank(body: any) {
    const ref1 = reference1()
    const postBody: TestKbankQR = {
      partnerTxnUid: ref1,
      partnerId: 'CRP0000064',
      partnerSecret: 'd1k7JyEOdx2ZwqQo79z1ukjN0NfVYTrxmIRuerLaRwD6aKGX7fIMYzq8XQrc8nnq',
      requestDt: (new Date()).toISOString(),
      merchantId: 'A000000677010113',
      terminalId: 'KB000000264544',
      qrType: '3',
      txnAmount: body.amount,
      txnCurrencyCode: 'THB',
      reference1: ref1,
      reference2: '',
      reference3: '',
      reference4: '',
      metadata: 'QR Kbank at BTS'
    }

    //   const kbank_pem_cert = pem.readPkcs12(fs.readFileSync("KbankCer.pfx"), (err, cert) => {
    //     console.log(cert);
    // })

    // console.log(fs.readFileSync("src/kbank/KbankCer.pfx"))
    const options = {
      httpsAgent: new https.Agent({
        requestCert: true,
        rejectUnauthorized: false,
        cert: fs.readFileSync("src/kbank/Kbank_cer_test_2023.cer"),
      }), timeout: 5000
    }

    const kbankURL = "https://apitest.kasikornbank.com:12002" + '/kbank/pos/qr_request'
    const data = await axios.default.post(kbankURL, postBody, options)
    console.log(data)


    return
  }

  // //Kbank ตอบกลับ QR
  // testQrResponse(body: any): TestKbankQRResponse {
  //   return {
  //     partnerTxnUid: body.partnerTxnUid,
  //     partnerId: body.partnerId,
  //     statusCode: '00',
  //     errorCode: null,
  //     errorDesc: null,
  //     accountName: '',
  //     qrCode: genQR(body)
  //   }
  // }

  // //Test Notice จาก kbank 
  // testNoticeKbank(body: TestKbankQR): TestKbankNoticeRequest {
  //   return {
  //     partnerTxnUid: body.partnerTxnUid,
  //     partnerId: body.partnerId,
  //     statusCode: '00',
  //     errorCode: null,
  //     errorDesc: null,
  //     merchantId: body.merchantId,
  //     txnAmount: body.txnAmount,
  //     txnCurrencyCode: body.txnCurrencyCode,
  //   }
  // }

  // //รับ notice จาก kbank
  // kbankNotice(body: TestKbankNoticeRequest): TestResponseToKbank {
  //   if (body.statusCode === '00') {
  //     return getStatusCodeSuccess()
  //   }
  //   else {
  //     return getStatusCodeError(KbankErrorDesc.EMA)
  //   }
  // }

  // //ขอ inquiry ไป kbank 
  // kbankInquiry(body: KbankInquiryDto) {
  //   const postBody = body
  //   const kbankURL = this.configService.get('KBANKURL')
  //   const res = this.httpService.post(kbankURL + '/kbank/pos/inquire_kbank/v2', postBody)
  //   return res.pipe(map(data => {
  //     return data.data
  //   }))
  // }

  // //kbank ตอบกลับ inquiry
  // testKbankInquiryResponse(body: KbankInquiryDto) {

  // try {
  //   if (!body.merchantId) {
  //     throw KbankErrorDesc.EMDNE
  //   }
  //   if (!body.origPartnerTxnUid){
  //     throw KbankErrorDesc.EMITDNE
  //   }
  //   if (!body.qrType){
  //     throw KbankErrorDesc.EMIQR
  //   }
  //   return {
  //     ...getStatusCodeSuccess(),
  //     partnerTxnUid: body.partnerTxnUid,
  //     partnerId: body.partnerId,
  //     txnStatus: KbankTxnStatus.REQUESTED,
  //     txnNo: "201802080035496",
  //     loyaltyId: "00199100000",
  //   }
  // } catch (error) {
  //   return {
  //     ...getStatusCodeError(error),
  //     partnerTxnUid: body.partnerTxnUid,
  //     partnerId: body.partnerId,
  //     txnStatus: KbankTxnStatus.REQUESTED,
  //     txnNo: "201802080035496",
  //     loyaltyId: "00199100000",
  //   }
  // }
  //}
}

