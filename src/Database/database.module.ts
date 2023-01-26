import { Module } from '@nestjs/common';
import { ErrorHandlerModule } from '../error_handler/error_handler.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BBLModule } from '../bbl/bbl.module'
import { KbankModule } from '../kbank/kbank.module';
import { RLPModule } from '../line/rlp.module';
import { Transaction_buffer } from './Transaction_Entity/buffer_transaction.entity';
import { Confirm_transaction } from './Transaction_Entity/confirm_transaction.entity';
import { BankAccount } from './MMS_Entity/bank_account.entity';
import { Category } from './MMS_Entity/category.entity';
import { MasterMerchant } from './MMS_Entity/master_merchant.entity';
import { MerchantData } from './MMS_Entity/merchant_data.entity';
import { MerchantAuth } from './MMS_Entity/merchant_auth.entity';

import { MerchantProfile } from './MMS_Entity/merchant_profile.entity';
import { PaymentChannelConfig } from './MMS_Entity/payment_channel_config.entity';
import { PaymentChannelBBL } from './MMS_Entity/payment_channel_bbl.entity';
import { PaymentChannelKbank } from './MMS_Entity/payment_channel_kbank.entity';
import { PaymentChannelKerryWallet } from './MMS_Entity/payment_channel_kerry_wallet.entity';
import { PaymentChannelRabbitWallet } from './MMS_Entity/payment_channel_rabbit_wallet.entity';
import { PaymentChannelRLP } from './MMS_Entity/payment_channel_rlp.entity';
import { Owner } from './MMS_Entity/owner.entity';
import { PaymentLimit } from './MMS_Entity/payment_limit.entity';
import { PgwConfig } from './MMS_Entity/pgw_config.entity';
import { WebActivityLog } from './MMS_Entity/web_activity_log.entity';
import { SubCategory } from './MMS_Entity/sub_category.entity';
import { MdrGroup } from './MMS_Entity/mdr_group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service'
import { Transaction_manager } from './transaction_management';
import { MMS_manager } from './mms_managemen';


@Module({
    imports: [
        ErrorHandlerModule,
        TypeOrmModule.forFeature([PaymentChannelConfig, MerchantAuth, PaymentLimit, PgwConfig, Owner, MerchantProfile, MerchantData,
            MasterMerchant, WebActivityLog, BankAccount, Category, SubCategory, MdrGroup, PaymentChannelBBL, PaymentChannelKbank,
            PaymentChannelKerryWallet, PaymentChannelRabbitWallet, PaymentChannelRLP], 'mms'),
        TypeOrmModule.forFeature([Transaction_buffer, Confirm_transaction]),
    ],
    providers: [DatabaseService, Transaction_manager, MMS_manager],
    exports: [DatabaseService, Transaction_manager, MMS_manager]
})
export class DatabaseModule { }
