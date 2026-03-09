// src/imei/imei.service.ts
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ImeiScanStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProcessImeiResponseDto } from './dto/imei-lookup-result.dto';

@Injectable()
export class ImeiService {
  private readonly logger = new Logger(ImeiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processImei(imei: string, userId: string): Promise<ProcessImeiResponseDto> {
    try {
      const scanLog = await this.prisma.imeiScanLog.create({
        data: {
          imei,
          status: ImeiScanStatus.SUCCESS,
          userId,
        },
      });

      this.logger.log(`IMEI ${imei} escaneado correctamente por usuario ${userId}`);

      return {
        imei,
        scanId: scanLog.id,
        scannedAt: scanLog.createdAt,
      };
    } catch (error) {
      this.logger.error(
        `Error al persistir el escaneo del IMEI ${imei}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Error interno al registrar el escaneo del IMEI.',
      );
    }
  }
}