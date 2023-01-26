import { Body, Controller, Headers, Param, Get, Post, BadRequestException, Req, Query, HostParam, Header, Redirect, Res, ConsoleLogger, HttpCode, CacheTTL } from '@nestjs/common';
// import { ErrorHandlerService } from './error_handler/error_handler.service'
import { paymentService } from './app.service'
//import { ApiTags } from '@nestjs/swagger';
import { GetQrBody, GetQrHeader, InquiryQuery } from './app.interface';

//@ApiTags('PaymentGateway')
@Controller('/v1')
export class paymentController {
  constructor(
    private readonly paymentService: paymentService) { }

  @Post('/transaction/getqr/1')
  async test() {
    return "test"
  }


  @Post('/transaction/getqr')
  async payment(@Headers() header: GetQrHeader, @Body() body: GetQrBody, @Req() req): Promise<any> {

    return await this.paymentService.paymentRequest(header, body, req)
  }

  @Get('/transaction/inquiryqr')
  async inquiryRequest(@Query() query: InquiryQuery): Promise<any> {

    return await this.paymentService.inquiryRequest(query)
  }

  @Get('/notice/rabbitlinepay')
  async notice_linepay(@Query() query): Promise<any> {

    return await this.paymentService.app_notice_linepay(query)
  }

  // @Get('/merchant/transaction/history')
  // async get_history(@Headers() header, @Query() query): Promise<any> {
  //   return await this.paymentService.get_history(header, query)
  // }

  @Post('/channel/transactions/callback/providerId/:services')
  @HttpCode(200)
  async notice_bbl(@Headers() header, @Body() body, @Param('services') param): Promise<any> {
    return await this.paymentService.app_notice_bbl(header, body, param)
  }

  // @Post('/channel/transactions/callback/thaiqr/bypass')
  // async notice_bypass(@Body() body): Promise<any> {
  //   let newBody = {
  //     reference1: body.transaction_id
  //   }
  //   return await this.paymentService.app_bypass_notice_bbl(newBody)
  // }

}

