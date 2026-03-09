// src/imei/imei.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ImeiService } from './imei.service';
import { ProcessImeiDto } from './dto/process-imei.dto';
import { LuhnValidationPipe } from './pipes/luhn-validation.pipe';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('imei')
@UseGuards(JwtAccessGuard)
export class ImeiController {
  constructor(private readonly imeiService: ImeiService) {}

  /**
   * POST /imei/process
   *
   * Validates the IMEI (format via DTO + Luhn via pipe), queries the external
   * lookup API, persists the result and returns structured device information.
   *
   * Requires a valid JWT access token (Bearer).
   */
  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processImei(
    @Body() dto: ProcessImeiDto,
    // Apply Luhn pipe only to the imei field extracted from the validated DTO
    @Body('imei', LuhnValidationPipe) imei: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.imeiService.processImei(imei, user.sub);
  }
}