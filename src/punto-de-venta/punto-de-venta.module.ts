// src/punto-de-venta/punto-de-venta.module.ts
import { Module } from '@nestjs/common';
import { PuntoDeVentaController } from './punto-de-venta.controller';
import { PuntoDeVentaService } from './punto-de-venta.service';

@Module({
  controllers: [PuntoDeVentaController],
  providers: [PuntoDeVentaService],
  exports: [PuntoDeVentaService],
})
export class PuntoDeVentaModule {}