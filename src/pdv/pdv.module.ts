import { Module } from '@nestjs/common';
import { PdvService } from './pdv.service';
import { PdvController } from './pdv.controller';

@Module({
  controllers: [PdvController],
  providers: [PdvService],
})
export class PdvModule {}
