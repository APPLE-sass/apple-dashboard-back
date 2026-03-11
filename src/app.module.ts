import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ImeiModule } from './imei/imei.module';
import { PuntoDeVentaModule } from './punto-de-venta/punto-de-venta.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { envValidation } from './config/env.validation';
import { CatalogoGlobalModule } from './catalogo-global/catalogo-global.module';
import { CatalogoPdvModule } from './catalogo-pdv/catalogo-pdv.module';
import { DispositivosStockModule } from './dispositivos-stock/dispositivos-stock.module';
import { AccesoriosStockModule } from './accesorios-stock/accesorios-stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: envValidation, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ImeiModule,
    PuntoDeVentaModule,
    CatalogoGlobalModule,
    CatalogoPdvModule,
    DispositivosStockModule,
    AccesoriosStockModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}