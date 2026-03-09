// src/imei/imei.module.ts
import { Module } from '@nestjs/common';
import { ImeiController } from './imei.controller';
import { ImeiService } from './imei.service';

/**
 * ImeiModule
 *
 * Handles IMEI scanning: validates format + Luhn checksum,
 * then persists an audit log in ImeiScanLog.
 *
 * PrismaModule is already global — no need to re-import.
 *
 * Register in AppModule:
 *   imports: [..., ImeiModule]
 */
@Module({
  controllers: [ImeiController],
  providers: [ImeiService],
  exports: [ImeiService],
})
export class ImeiModule {}