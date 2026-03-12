import { Module } from '@nestjs/common';
import { PuntoDeVentaController } from './pdv.controller';
import { PuntoDeVentaService } from './pdv.service';

@Module({
  controllers: [PuntoDeVentaController],
  providers: [PuntoDeVentaService],
})
export class PdvModule {}
