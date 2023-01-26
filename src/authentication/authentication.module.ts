import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ErrorHandlerModule } from '../error_handler/error_handler.module';
import { DatabaseModule } from '../Database/database.module'
import { MMS_manager } from 'src/Database/mms_managemen';


@Module({
  imports: [ErrorHandlerModule,DatabaseModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService]
})
export class AuthenticationModule { }
