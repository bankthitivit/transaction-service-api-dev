
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { paymentController } from './app.controller';
import { ErrorHandlerModule } from './error_handler/error_handler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { paymentService } from './app.service'
import { AuthenticationModule } from './authentication/authentication.module';
import { BBLModule } from './bbl/bbl.module'
import { KbankModule } from './kbank/kbank.module';
import { RLPModule } from './line/rlp.module';
import { Transaction_buffer } from './Database/Transaction_Entity/buffer_transaction.entity';
import { Confirm_transaction } from './Database/Transaction_Entity/confirm_transaction.entity';
import { BankAccount } from './Database/MMS_Entity/bank_account.entity';
import { Category } from './Database/MMS_Entity/category.entity';
import { MasterMerchant } from './Database/MMS_Entity/master_merchant.entity';
import { MerchantData } from './Database/MMS_Entity/merchant_data.entity';
import { MerchantProfile } from './Database/MMS_Entity/merchant_profile.entity';
import { Owner } from './Database/MMS_Entity/owner.entity';
import { PaymentChannelConfig } from './Database/MMS_Entity/payment_channel_config.entity';
import { PaymentChannelBBL } from './Database/MMS_Entity/payment_channel_bbl.entity';
import { PaymentChannelKbank } from './Database/MMS_Entity/payment_channel_kbank.entity';
import { PaymentChannelKerryWallet } from './Database/MMS_Entity/payment_channel_kerry_wallet.entity';
import { PaymentChannelRabbitWallet } from './Database/MMS_Entity/payment_channel_rabbit_wallet.entity';
import { PaymentChannelRLP } from './Database/MMS_Entity/payment_channel_rlp.entity';
import { PaymentLimit } from './Database/MMS_Entity/payment_limit.entity';
import { PgwConfig } from './Database/MMS_Entity/pgw_config.entity';
import { TypeOrmTXNConfigService } from './orm.config';
import { TypeOrmMMSConfigService } from './orm.config';
import { WebActivityLog } from './Database/MMS_Entity/web_activity_log.entity';
import { SubCategory } from './Database/MMS_Entity/sub_category.entity';
import { MdrGroup } from './Database/MMS_Entity/mdr_group.entity';
import { DatabaseModule } from './Database/database.module'
import { CallbackModule } from './callback/callback.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useClass: TypeOrmTXNConfigService
  }),
  TypeOrmModule.forRootAsync({
    name: 'mms',
    useClass: TypeOrmMMSConfigService
  }),
    ErrorHandlerModule, AuthenticationModule,
    BBLModule,
    KbankModule, RLPModule,
    DatabaseModule,
  TypeOrmModule.forFeature([PaymentChannelConfig, PaymentLimit, PgwConfig, Owner, MerchantProfile, MerchantData,
    MasterMerchant, WebActivityLog, BankAccount, Category, SubCategory, MdrGroup, PaymentChannelBBL, PaymentChannelKbank,
    PaymentChannelKerryWallet, PaymentChannelRabbitWallet, PaymentChannelRLP], 'mms'),
  TypeOrmModule.forFeature([Transaction_buffer, Confirm_transaction]),
    CallbackModule],
  controllers: [paymentController],
  // providers: [paymentService, { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },],
  providers: [paymentService],
})
export class AppModule { }