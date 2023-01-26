import { Module } from '@nestjs/common';
import { CallbackService } from './callback.service';

import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction_buffer } from 'src/Database/Transaction_Entity/buffer_transaction.entity';
import { Confirm_transaction } from 'src/Database/Transaction_Entity/confirm_transaction.entity';
import { DatabaseModule } from 'src/Database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule,
    //  TypeOrmModule.forFeature([Transaction_buffer, Confirm_transaction])
  ],
  providers: [CallbackService],
  exports: [CallbackService]
})
export class CallbackModule { }
