import { Injectable } from '@nestjs/common';
import { SharedEnum } from 'src/common/shared.enum';
import { Menu } from 'src/menu/menu';

@Injectable()
export class Event {
  constructor(private readonly menu: Menu) {}

  async handleEvent(body: any) {
    console.log(`REQUEST | body:`, body);

    const service = body.service;

    switch (service) {
      case SharedEnum.menu:
        return await this.menu.handle(body);
      default:
        throw new Error(`Service ${service} not found`);
    }
  }
}
