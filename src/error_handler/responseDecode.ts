
export function decoding_response(statusCode: string) {
    switch (statusCode) {
        case ResponseCode.WrongCredential: return 'Wrong Credential';
        case ResponseCode.InvalidParameter: return 'Invalid Parameter(s)';
        case ResponseCode.InternalError: return 'Internal Error';
        case ResponseCode.ConfigNotFound: return 'Partnerid Config Not Found'
        case ResponseCode.LimitTransaction: return 'Payment amount surpass the transaction limit'
        case ResponseCode.LimitTransactionDay: return 'Payment amount surpass the Day limit'
        case ResponseCode.LimitTransactionMonth: return 'Payment amount surpass the Month limit'
        case ResponseCode.NotFoundTransaction: return 'Not Found Transaction'
        case ResponseCode.PaymentChannelDown: return 'Payment Channel Not Response'
        case ResponseCode.MMSConnectionError: return "MMS Database Not Response"
        case ResponseCode.DatabaseConnectionError: return 'Transaction Database Not Response'
        case ResponseCode.NoPermissionPaymentChannel: return 'Partner does not have permission for this payment Channel'
        case ResponseCode.InvalidData: return 'Invalid data'
    }
}

export enum ResponseCode {
    //HTTPStatus 400 ++
    WrongCredential = '0101',
    InvalidParameter = '0102',
    ConfigNotFound = '0103',
    LimitTransaction = '0104',
    LimitTransactionDay = '0105',
    LimitTransactionMonth = '0106',
    NotFoundTransaction = '0108',
    NoPermissionPaymentChannel = '0109',
    ClientWebHookDown = '0110',

    //HttpStatus 500
    MMSConnectionError = '9996',
    DatabaseConnectionError = '9997',
    PaymentChannelDown = '9998',
    InternalError = '9999',

    //BBL Notifications response
    InvalidData = '211',



}
