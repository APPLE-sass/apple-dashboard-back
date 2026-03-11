import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAccesorioDto } from './create-accesorios.dto';

export class UpdateAccesorioDto extends PartialType(CreateAccesorioDto) {
  @IsOptional() @IsBoolean() isActive?: boolean;
}