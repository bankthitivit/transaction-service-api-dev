import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
//import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as sourceMapSupport from 'source-map-support';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './error_handler/error_handler.service';

async function bootstrap() {
  sourceMapSupport.install();

  const CORS_OPTIONS = {
    //origin: ['http://127.0.0.1:5500'], // or '*' or whatever is required
    //test 
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'POST'],
  };
  const adapter = new FastifyAdapter();
  adapter.enableCors(CORS_OPTIONS)

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);



  // const config = new DocumentBuilder()
  //   .setTitle('Rabbit Gateway QR Payment')
  //   .setDescription('Rabbit Gateway for QR Payment API description')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config, options);
  // SwaggerModule.setup('api', app, document);
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new ErrorFilter())


  let PORT;

  if (process.env.ENVIRONMENT === 'development' || process.env.ENVIRONMENT === 'production') {
    PORT = 3015
  } else if (process.env.ENVIRONMENT === 'test') {
    PORT = 3016
  }

  await app.listen(PORT, '0.0.0.0');


  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
