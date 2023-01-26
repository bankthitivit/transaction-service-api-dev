import { Module } from '@nestjs/common';
import { ErrorFilter } from './error_handler.service';

@Module({
  providers: [ErrorFilter],
  exports: [ErrorFilter]
})
export class ErrorHandlerModule { }
