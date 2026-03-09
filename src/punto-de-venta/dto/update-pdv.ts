// src/punto-de-venta/dto/update-pdv.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePdvDto } from './create-pdv.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePdvDto extends PartialType(CreatePdvDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}