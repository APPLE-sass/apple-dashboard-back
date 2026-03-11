import { Module } from '@nestjs/common';
import { CatalogoGlobalController } from './catalogo-global.controller';
import { CatalogoGlobalService } from './catalogo-global.service';

@Module({ controllers: [CatalogoGlobalController], providers: [CatalogoGlobalService], exports: [CatalogoGlobalService] })
export class CatalogoGlobalModule {}