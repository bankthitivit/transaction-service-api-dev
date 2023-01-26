import { Module } from '@nestjs/common';
import { KbankService } from './kbank.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule
  ],
  controllers: [],
  providers: [KbankService],
  exports: [KbankService]
})
export class KbankModule { }
