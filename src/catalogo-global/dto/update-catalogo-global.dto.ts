import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateCatalogoGlobalDto } from './create-catalogo-global.dto';

export class UpdateCatalogoGlobalDto extends PartialType(CreateCatalogoGlobalDto) {
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}