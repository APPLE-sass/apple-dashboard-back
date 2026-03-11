import { Module } from '@nestjs/common';
import { AccesoriosStockController } from './accesorios-stock.controller';
import { AccesoriosStockService } from './accesorios-stock.service';

@Module({ controllers: [AccesoriosStockController], providers: [AccesoriosStockService], exports: [AccesoriosStockService] })
export class AccesoriosStockModule {}