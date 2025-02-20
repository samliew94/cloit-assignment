import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Event } from './event/event';
import { Callback, Context, Handler } from 'aws-lambda';

export const handler: Handler = process.env.IS_STANDALONE === '1' ? async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(`REQUEST | event:`, JSON.stringify(event, null, 2));

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const eventService = appContext.get(Event);

  let result;

  try {
    result = await eventService.handleEvent(JSON.parse(event.body));
    console.log('RESPONSE | result:', result);
    return {
      body: JSON.stringify(result),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error(error);
    return {
      body: error?.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
} : undefined

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  app.enableCors({
    origin: allowedOrigins,
    methods: ['POST'],
  });
  await app.listen(process.env.PORT ?? 3000);
}

if (process.env.IS_STANDALONE === '0') {
  bootstrap();
}
