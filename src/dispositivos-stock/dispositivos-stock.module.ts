import { Module } from '@nestjs/common';
import { DispositivosStockController } from './dispositivos-stock.controller';
import { DispositivosStockService } from './dispositivos-stock.service';

@Module({ controllers: [DispositivosStockController], providers: [DispositivosStockService], exports: [DispositivosStockService] })
export class DispositivosStockModule {}