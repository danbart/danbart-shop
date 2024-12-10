import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interface';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  @Auth(ValidRoles.ADMIN)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
