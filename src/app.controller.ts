import { Controller, Get, Logger, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.debug(`SOME_VALUE: ${JSON.stringify({ new: 'element' })}`);
    this.logger.verbose(JSON.stringify({ new: 'element' }));
    this.logger.warn('WARN', JSON.stringify({ new: 'element' }));
    this.logger.error('ERROR', JSON.stringify({ new: 'element' }));
    return 'Hello';
  }
}
