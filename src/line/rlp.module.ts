import { CacheInterceptor, CacheModule, Module } from '@nestjs/common'
import { RLPController } from './rlp.controller';
import { RLPService } from './rlp.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction_buffer } from 'src/Database/Transaction_Entity/buffer_transaction.entity';
import { MerchantProfile } from '../Database/MMS_Entity/merchant_profile.entity';
import { Confirm_transaction } from '../Database/Transaction_Entity/confirm_transaction.entity';
import { PaymentChannelConfig } from '../Database/MMS_Entity/payment_channel_config.entity';
import { DatabaseModule } from '../Database/database.module';
import { CallbackModule } from '../callback/callback.module';
import { PaymentChannelBBL } from '../Database/MMS_Entity/payment_channel_bbl.entity';
import { PaymentChannelKbank } from '../Database/MMS_Entity/payment_channel_kbank.entity';
import { PaymentChannelKerryWallet } from '../Database/MMS_Entity/payment_channel_kerry_wallet.entity';
import { PaymentChannelRabbitWallet } from '../Database/MMS_Entity/payment_channel_rabbit_wallet.entity';
import { PaymentChannelRLP } from '../Database/MMS_Entity/payment_channel_rlp.entity';



@Module({
  imports: [DatabaseModule, CallbackModule, HttpModule,
    //  TypeOrmModule.forFeature([Transaction_buffer, Confirm_transaction]),
    // TypeOrmModule.forFeature([MerchantProfile, PaymentChannelConfig,PaymentChannelBBL, PaymentChannelKbank,
    //     PaymentChannelKerryWallet, PaymentChannelRabbitWallet, PaymentChannelRLP], 'mms')
      ],
  controllers: [RLPController],
  providers: [RLPService],
  exports: [RLPService]
})
export class RLPModule { }