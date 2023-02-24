import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/health')
@ApiTags('Health Check')
export class AppController {
  @Get()
  getHealth() {
    return 'Ok';
  }
}
