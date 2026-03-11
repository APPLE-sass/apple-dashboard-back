import { IsString, IsOptional, IsNumber, IsInt, Min, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccesorioDto {
  @IsOptional() @IsString() @MaxLength(60) sku?: string;
  @IsOptional() @IsString() @MaxLength(60) color?: string;
  @IsOptional() @IsString() @MaxLength(500) descripcion?: string;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Type(() => Number) precio: number;
  @IsInt() @Min(0) @Type(() => Number) cantidad: number;
  @IsUUID() catalogoItemId: string;
  @IsUUID() puntoDeVentaId: string;
}