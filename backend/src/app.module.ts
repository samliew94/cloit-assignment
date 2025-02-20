import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './event/event.controller';
import { Event } from './event/event';
import { Menu } from './menu/menu';
import { PrismaService } from './prisma.service/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, EventController],
  providers: [AppService, Event, Menu, PrismaService],
})
export class AppModule {}
