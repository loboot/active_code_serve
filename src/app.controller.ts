import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Get, Controller, Render, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger();

  constructor(
    private appService: AppService,
    private configService: ConfigService,
  ) {}
  @Get()
  @Render('index')
  root() {
    const baseUrl = this.configService.get('BASE_URL');
    return {
      baseUrl,
    };
  }
}
