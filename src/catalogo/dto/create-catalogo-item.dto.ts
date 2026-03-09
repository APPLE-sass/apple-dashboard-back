// src/catalogo/dto/create-catalogo-item.dto.ts
import {
  IsString, IsEnum, IsNumber, IsOptional,
  Min, MinLength, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Categoria } from '@prisma/client';

export class CreateCatalogoItemDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  modelo: string;

  @IsEnum(Categoria, {
    message: `La categoría debe ser uno de: ${Object.values(Categoria).join(', ')}`,
  })
  categoria: Categoria;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  memoria: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  color: string;

  // En el schema el campo se llama "precio", no "precioBase"
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número decimal válido' })
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsString()
  puntoDeVentaId: string;
}