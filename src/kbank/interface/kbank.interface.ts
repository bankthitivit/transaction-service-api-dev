import { CreateKbankDto } from "../dto/create-kbank.dto"

export interface KbankResponseError {
  responseCode: string,
  responseMessage: string,
}

export interface KbankResponseSuccess extends KbankResponseError {
  data: {
    kbank_channel: string,
    kbank_code: string,
    reference1: string,
    reference2: string,
    transaction_id: string,
    expire_time: number
  }
}

export function getQrResponseSuccess(data: TestKbankQRResponse, body: CreateKbankDto): KbankResponseSuccess {
  return {
    responseCode: '0000',
    responseMessage: 'Accepted and processing',
    data: {
      kbank_channel: body.kbank_channel,
      kbank_code: data.qrCode,
      reference1: data.partnerTxnUid,
      reference2: '',
      transaction_id: data.partnerTxnUid,
      expire_time: 300
    }
  }
}

export function getQrResponseError(): KbankResponseError {
  return {
    responseCode: '0002',
    responseMessage: 'Invalid Parameter(s)',
  }
}

export interface TestKbankQR {
  partnerTxnUid: string,
  partnerId: string,
  partnerSecret: string,
  requestDt: string,
  merchantId: string,
  terminalId: string,
  qrType: string,
  txnAmount: number,
  txnCurrencyCode: string,
  reference1: string,
  reference2: string,
  reference3: string,
  reference4: string,
  metadata: string
}

export interface TestKbankQRResponse {
  partnerTxnUid: string,
  partnerId: string,
  statusCode: string,
  errorCode: string,
  errorDesc: string,
  accountName: string,
  qrCode: string,
}

export interface TestKbankNoticeRequest extends TestResponseToKbank {
  partnerTxnUid: string,
  partnerId: string,
  merchantId: string,
  txnAmount: number,
  txnCurrencyCode: string,
}

export interface TestResponseToKbank {
  statusCode: '00' | '10',
  errorCode: string | null,
  errorDesc: string | null,
}

export function getStatusCodeSuccess(): TestResponseToKbank {
  return {
    statusCode: '00',
    errorCode: null,
    errorDesc: null
  }
}
export function getStatusCodeError(errorDesc: KbankErrorDesc): TestResponseToKbank {
  return {
    statusCode: '10',
    errorCode: getErrorCode(errorDesc),
    errorDesc: errorDesc,
  }
}

function getErrorCode(errorCode: KbankErrorDesc): string {
  switch (errorCode) {
    case KbankErrorDesc.EMACF: return 'account_error'
    case KbankErrorDesc.EMAC: return 'account_error'
    case KbankErrorDesc.EMA: return 'authentication_error'
    case KbankErrorDesc.EMBR: return 'bad_request'
    case KbankErrorDesc.EMDR: return 'duplicate_request'
    case KbankErrorDesc.EMG: return 'general_error'
    case KbankErrorDesc.EMIDB: return 'internal_error'
    case KbankErrorDesc.EMIU: return 'internal_error'
    case KbankErrorDesc.EMICC: return 'invalid_currency_code'
    case KbankErrorDesc.EMITDNE: return 'invalid_origPartnerTxnUid'
    case KbankErrorDesc.EMITA: return 'invalid_txn_amount'
    case KbankErrorDesc.EMITF: return 'invalid_txn_amount'
    case KbankErrorDesc.EMIQR: return 'invalid_qr_type'
    case KbankErrorDesc.EMIR: return 'invalid_reference1'
    case KbankErrorDesc.EMISD: return 'invalid_shop_id'
    case KbankErrorDesc.EMISDNE: return 'invalid_shop_id'
    case KbankErrorDesc.EMMC: return 'merchant_closed'
    case KbankErrorDesc.EMMD: return 'duplicate_merchant'
    case KbankErrorDesc.EMPM: return 'authentication_error'
    case KbankErrorDesc.EMDNE: return 'invalid_merchant'
    case KbankErrorDesc.EMRD: return 'duplicate_merchant'
    case KbankErrorDesc.EMQRC: return 'qr_cancelled'
    case KbankErrorDesc.EMQRP: return 'qr_paid'
    case KbankErrorDesc.EMQRAE: return 'qr_expired'
    case KbankErrorDesc.EMQRE: return 'qr_expired'
    case KbankErrorDesc.EMSET: return 'settlement_error'
    case KbankErrorDesc.EMSMSG: return 'settlement_error'
    case KbankErrorDesc.EMQRVOTCH: return 'qr_void'
    default: return ''
  }
}

export enum KbankErrorDesc {
  EMACF = 'Cannot credit to account. (EMACF)',
  EMAC = 'Account is closed. (EMAC)',
  EMA = 'Wrong partner key. (EMA)',
  EMBR = 'Invalid JSON. (EMBR)',
  EMDR = 'This request is duplicated. (EMDR)',
  EMG = 'ระบบไม่สามารถดำเนินรายการนี้ได้ กรุณาทำรายการอีกครั้งในภายหลัง (EMG)',
  EMIDB = 'Cannot connect to database. (EMIDB)',
  EMIU = 'System unavailable. (EMIU)',
  EMICC = 'Currency code XXX is not allowed. (EMICC)',
  EMITDNE = 'origPartnerTxnUid does not exist. (EMITDNE)',
  EMITA = 'Invalid Amount. (EMITA)',
  EMITF = 'Amount must be an integer with two digits precision. (EMITF)',
  EMIQR = 'QR Type X is not allowed. (EMIQR)',
  EMIR = 'reference1 must not be empty. (EMIR)',
  EMISD = 'Shop ID is a duplicate. (EMISD)',
  EMISDNE = 'Shop ID does not exist. (EMISDNE)',
  EMMC = 'Merchant is already closed. (EMMC)',
  EMMD = 'National ID or Email already registered. (EMMD)',
  EMPM = 'Miss match partner id and mid. (EMPM)',
  EMDNE = 'Merchant ID does not exist. (EMDNE)',
  EMRD = 'Partner ID and Partner Shop ID already registered. (EMRD)',
  EMQRC = 'QR is cancelled. (EMQRC)',
  EMQRP = 'QR already paid. (EMQRP)',
  EMQRAE = 'QR already expired. (EMQRAE)',
  EMQRE = 'QR has expired. (EMQRE)',
  EMSET = 'Transaction is already settled (EMSET)',
  EMSMSG = 'Manual settlement is not allow between 22:00 - 02:30  (EMSMSG)',
  EMQRVOTCH = 'Cannot void other channel. (EMQRVOTCH)'
}

export enum KbankTxnStatus {
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REQUESTED = 'REQUESTED',
  NOT_FOUND = 'NOT_FOUND',
  VOIDED = 'VOIDED'
}