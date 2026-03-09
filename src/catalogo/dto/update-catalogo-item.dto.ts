// src/catalogo/dto/update-catalogo-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoItemDto } from './create-catalogo-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCatalogoItemDto extends PartialType(CreateCatalogoItemDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}