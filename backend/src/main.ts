import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Event } from './event/event';
import { Handler } from 'aws-lambda';

export const handler: Handler = process.env.IS_STANDALONE
  ? async (event: any) => {
      console.log(`REQUEST | event:`, JSON.stringify(event, null, 2));

      const appContext = await NestFactory.createApplicationContext(AppModule);
      const eventService = appContext.get(Event);

      let result;

      try {
        result = eventService.handleEvent(JSON.parse(event.body));
        return {
          body: result,
          statusCode: 200,
        };
      } catch (error: any) {
        return {
          body: error?.message,
          statusCode: 500,
        };
      }
    }
  : undefined;

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
