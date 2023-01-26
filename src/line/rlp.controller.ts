import { Body, Controller, Get, Post, Put, Param, NotFoundException, Query, BadRequestException, UseGuards, Inject, CACHE_MANAGER } from '@nestjs/common'
//import { ApiTags } from '@nestjs/swagger';
import { RLPService } from './rlp.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { LineRequestQr } from './entity/line-request-qr.entity';
import { LinePreApprovePayment } from './entity/line-pre-approved-payment.entity';
import { LineCapture } from './entity/line-capture.entity';
import { LineRefund } from './entity/line-refund.entity';
import { LineConfirm } from './entity/line-confirm.entity';

@Controller()
//@ApiTags('RLP')
export class RLPController {
  // constructor(private readonly rlpService: RLPService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }
  // constructor(private readonly httpService: HttpService) { }
  constructor(private readonly lineService: RLPService) { }

 
}