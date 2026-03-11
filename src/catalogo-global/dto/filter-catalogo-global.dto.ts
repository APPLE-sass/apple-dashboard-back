import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Categoria } from '@prisma/client';

export class FilterCatalogoGlobalDto {
  @IsOptional() @IsEnum(Categoria) categoria?: Categoria;
  @IsOptional() @IsString() modelo?: string;
  @IsOptional() @IsInt() @Min(1) @Max(100) @Type(() => Number) limit?: number = 20;
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number = 1;
}