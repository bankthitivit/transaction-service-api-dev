
export class BBLRequestQr {
  billerId: string
  transDate: string
  amount: number
  reference1: string
  reference2: string

}


export class QrConfig {
  merchantIdentifierAID: string
  billerId: string
  transDate: string
  amount: number
  reference1: string
  reference2?: string
  bank_merchant_name: string
}

export class QrData {
  payloadFormatIndicator: string
  pointOfInitiationMethod: string
  merchantIdentifierAID: string
  merchantIdentifierBillerID: string
  merchantIdentifierReference1: string
  merchantIdentifierReference2: string
  merchantIdentifier: string
  transactionCurrencyCode: string
  transactionAmount: string
  countryCode: string
  merchantName: string
  qrData: string
  crcQrData: string
  qrCode: string

  
}