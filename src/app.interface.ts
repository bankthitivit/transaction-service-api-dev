import { IsNotEmpty, IsDateString, IsString, IsNumber, Length, MinLength, IsInt, IsObject, IsIn, IsArray, ValidateIf, IsOptional, Validate, IsNumberString, validate, IsUrl } from "class-validator";
import * as moment from 'moment';
import { IsPrice, NearNow } from './custom_validator';

const payment_channel = ['THAIQR', "RabbitLinePay", "THAIQR-TOPUP"]
const currency_code = ['THB', 'USD', 'EUR', 'GBP', 'JPY', 'CNY']

export class GetQrHeader {


    @IsNotEmpty({ message: "partnerid must not empty", })
    @IsString({ message: "partnerid type invalid", })
    @Length(0, 50, { message: "partner_id sizes invalid", })
    partnerid: string

    @IsNotEmpty({ message: "nonce must not empty", })
    @IsString({ message: "nonce type invalid", })
    @Length(0, 50, { message: "nonce sizes invalid", })
    nonce: string

    @IsNotEmpty({ message: "authorization must not empty", })
    @IsString({ message: "authorization type invalid", })
    @Length(0, 128, { message: "authorization sizes invalid", })
    authorization: string

}


export class GetQrBody {
    @IsNotEmpty({ message: "request_id must not empty", })
    @IsString({ message: "request_id must be string", })
    @Length(0, 20, { message: "request_id sizes is not correct", })
    request_id: string

    @IsNotEmpty({ message: "request_datetime must not empty", })
    
    @Validate(NearNow, { message: 'request_datetime must be within 30 minutes of the current time' })
    request_datetime: Date

    @IsNotEmpty({ message: "device_id must not empty", })
    @IsString({ message: "device_id must be string", })
    @Length(0, 50, { message: "device_id sizes is not correct", })
    device_id: string


    @IsOptional()
    @IsString({ message: "cashier_id must be string", })
    @Length(0, 50, { message: "cashier_id sizes is not correct", })
    cashier_id: string | null


    @IsOptional()
    @IsString({ message: "location_id must be string", })
    @Length(0, 50, { message: "location_id sizes is not correct", })
    location_id?: string | null

    @IsOptional()
    @IsObject({ message: "package_description must be an array", })
    package_description?: object

    @IsNotEmpty({ message: "payment_channel must not empty", })
    @IsString({ message: "payment_channel must be string", })
    @IsIn(payment_channel, { message: "payment_channel is not found, Do you mean THAIQR or RabbitLinePay" })
    @Length(0, 20, { message: "payment_channel sizes is not correct", })
    payment_channel: string

    @IsNotEmpty({ message: "currency must not empty", })
    @IsString({ message: "currency must be string", })
    @Length(3, 3, { message: "currency is not correct", })
    @IsIn(currency_code, { message: "currency is not found, Do you mean 'THB', 'USD', 'EUR', 'GBP', 'JPY', 'CNY'" })
    currency: string

    @IsNotEmpty({ message: "amount must not empty", })
    @Length(0, 7, { message: "amount cannot exceed 99999", })
    //@Validate(IsPrice, { message: 'Price is not expected, the amount must higher than 0 but not exceed 10,000.00' })
    //amount: string

    @IsOptional()
    @IsNumber()
    device_type: number

    @IsOptional()
    @IsString({ message: "notify_url must be string", })
    //@IsUrl({ message: "notify_url must be url", })
    @Length(0, 500, { message: "notify_url sizes is not correct", })
    notify_url?: string
}

export class InquiryQuery {
    @IsNotEmpty({ message: "partnerid must not empty", })
    @IsString({ message: "partnerid type invalid", })
    @Length(0, 50, { message: "partner_id sizes invalid", })
    partnerid: string

    @IsNotEmpty({ message: "transactionid must not empty", })
    @IsString({ message: "transactionid type invalid", })
    @Length(0, 50, { message: "transactionid sizes invalid", })
    transactionid: string

    @IsNotEmpty({ message: "paymentchannel must not empty", })
    @IsString({ message: "paymentchannel type invalid", })
    @Length(0, 128, { message: "authopaymentchannelrization sizes invalid", })
    paymentchannel: string
}

export class NoticeLinepayQuery {

}