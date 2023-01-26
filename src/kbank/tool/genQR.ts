import { reference1 } from "./reference"
import { crc16ccitt } from 'crc';
import { TestKbankQR } from "src/kbank/interface/kbank.interface";

export function genQR(body: TestKbankQR): string {
  console.log(
    body
  );

  const payLoad = '000201'
  const pointMethod = '010212'
  const aid = 'A000000677010112'
  const billerId = body.merchantId
  const ref1 = reference1()
  const ref2 = '46000002497184000011'
  const Merchant = '00' + ('0' + aid.length).slice(-2) + aid + '01' + billerId.length + billerId + '02' + ref1.length + ref1 + '03' + ref2.length + ref2
  const currencyCode = '5303764'
  const amount = '54' + ('0' + ((body.txnAmount).toString(10)).length).slice(-2) + body.txnAmount
  const countryCode = '5802TH'
  const merchantName = '5900'
  const checksum = '6304'
  const stringx = `${payLoad}${pointMethod}${Merchant}${currencyCode}${amount}${countryCode}${merchantName}${checksum}`
  const crc = (crc16ccitt(stringx).toString(16)).toUpperCase().padStart(4, '0')
  return stringx + crc
}
