import { Body, Controller, Post, Res } from '@nestjs/common';
import { Event } from './event';

@Controller('event')
export class EventController {
  constructor(private readonly event: Event) {}

  @Post()
  async handleEvent(@Body() body, @Res() res) {
    try {
      const result = await this.event.handleEvent(body);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'An unexpected error occured. Check the logs for more details',
      });
    }
  }
}
