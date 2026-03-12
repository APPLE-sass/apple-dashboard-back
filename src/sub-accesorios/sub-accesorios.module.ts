import { Module } from '@nestjs/common';
import { SubAccesoriosController } from './sub-accesorios.controller';
import { SubAccesoriosService } from './sub-accesorios.service';

@Module({
  controllers: [SubAccesoriosController],
  providers: [SubAccesoriosService],
  exports: [SubAccesoriosService],
})
export class SubAccesoriosModule {}