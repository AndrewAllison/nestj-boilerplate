import { Controller, Get, Inject, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  getHello(): string {
    this.logger.debug(`SOME_VALUE: ${JSON.stringify({ new: 'element' })}`);
    this.logger.verbose(JSON.stringify({ new: 'element' }));
    this.logger.warn('WARN', JSON.stringify({ new: 'element' }));
    this.logger.error('ERROR', JSON.stringify({ new: 'element' }));
    return 'Hello';
  }
}
