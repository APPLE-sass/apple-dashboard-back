// src/punto-de-venta/dto/create-pdv.dto.ts
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreatePdvDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  ciudad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;
}