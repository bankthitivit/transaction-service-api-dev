import { HttpException, Injectable, BadRequestException, InternalServerErrorException, Sse } from '@nestjs/common';

import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import * as moment from 'moment';
import { ResponseCode } from './responseDecode'
import { decoding_response } from './responseDecode'
import { createLogger, format, transports } from 'winston';
import { combine, timestamp, label, prettyPrint } from 'format'

const logger = new Logger('ERROR')

@Catch()
export class ErrorFilter implements ExceptionFilter {

    winston_logger(level, body, header, param, message) {
        const datetime = moment().format('YY-MM-DDTHH-00-00');
        const filePath = `./log_folder/logger_${datetime}.txt`
        console.log(filePath)
        const winston_logger = createLogger({
            format: format.printf(info => {
                return `[${info.timestamp}] [log level = ${info.level}]:\nheader = ${JSON.stringify(info.header)}\nbody=${JSON.stringify(info.body)}\nparam=${JSON.stringify(info.param)}\ntrace=${info.message}\n`
            }),
            transports: [
                new transports.File({
                    filename: filePath,

                })
            ]
        })
        winston_logger.log({
            timestamp: moment().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
            level: level,
            body: body,
            header: header,
            param: param,
            message: message
        });
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<FastifyReply>()
        const request: any = host.switchToHttp().getRequest<Request>()

        console.log(exception.stack)
        this.winston_logger('error', request.body, request.headers, request.params, exception.stack)

        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const getResponse: any = exception.getResponse()
        console.log(getResponse?.message || getResponse?.status_code)
        let newResponseBody

        switch (true) {
            case getResponse?.message?.length > 0: {
                console.log("message")
                newResponseBody = {
                    responseCode: ResponseCode.InvalidParameter,
                    responseMessage: decoding_response(ResponseCode.InvalidParameter)
                }
                break;
            }
            case getResponse?.status_code?.length > 0: {
                console.log("status_code")

                newResponseBody = {
                    responseCode: getResponse.status_code || ResponseCode.InternalError,
                    responseMessage: decoding_response(getResponse.status_code) || decoding_response(ResponseCode.InternalError)
                }
                break;
            }
        }

        return response.status(status).send(newResponseBody).header("X-API-Version", "V-1.0.0")
    }


    // getqr_error_handler(status)
}

