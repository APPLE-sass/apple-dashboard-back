import { IsString, IsEnum, IsNumber, IsOptional, Min, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Categoria } from '@prisma/client';

export class CreateCatalogoGlobalDto {
  @IsEnum(Categoria)
  categoria: Categoria;

  @IsString() @MinLength(2) @MaxLength(120)
  modelo: string;

  @IsOptional() @IsString() @MaxLength(500)
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Type(() => Number)
  precioSugerido: number;
}