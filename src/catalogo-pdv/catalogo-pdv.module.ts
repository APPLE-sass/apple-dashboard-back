import { Module } from '@nestjs/common';
import { CatalogoPdvController } from './catalogo-pdv.controller';
import { CatalogoPdvService } from './catalogo-pdv.service';

@Module({ controllers: [CatalogoPdvController], providers: [CatalogoPdvService], exports: [CatalogoPdvService] })
export class CatalogoPdvModule {}