import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { envValidation } from './config/env.validation';
import { AccesoriosModule } from './accesorios/accesorios.module';
import { SubAccesoriosModule } from './sub-accesorios/sub-accesorios.module';
import { PdvModule } from './pdv/pdv.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: envValidation, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AccesoriosModule,
    SubAccesoriosModule,
    PdvModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}