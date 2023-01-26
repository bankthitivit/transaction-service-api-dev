import { Module } from '@nestjs/common'
import { BBLService } from './bbl.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction_buffer } from 'src/Database/Transaction_Entity/buffer_transaction.entity';
import { Confirm_transaction } from 'src/Database/Transaction_Entity/confirm_transaction.entity';
// import { MerchantMdr } from 'src/Database/MMS_Entity/merchant_mdr.entity';
// import { MerchantMdr } from '../Database/MMS_Entity/merchant_mdr.entity';
import { DatabaseModule } from '../Database/database.module'
import { CallbackModule } from '../callback/callback.module';
// import { ErrorHandlerService } from 'src/error_handler/error_handler.service';
// 
@Module({
	imports: [DatabaseModule, CallbackModule, HttpModule,
		//  TypeOrmModule.forFeature([Transaction_buffer, Confirm_transaction]),
		// TypeOrmModule.forFeature([MerchantMdr], 'mms')
	],
	providers: [BBLService],
	exports: [BBLService]
})
export class BBLModule { }
