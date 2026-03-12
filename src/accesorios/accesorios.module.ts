import { Module } from '@nestjs/common';
import { AccesoriosController } from './accesorios.controller';
import { AccesoriosService } from './accesorios.service';

@Module({
  controllers: [AccesoriosController],
  providers: [AccesoriosService],
  exports: [AccesoriosService],
})
export class AccesoriosModule {}