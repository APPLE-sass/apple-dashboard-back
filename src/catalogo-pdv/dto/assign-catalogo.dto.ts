import { IsOptional, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignCatalogoDto {
  @IsUUID() catalogoGlobalId: string;
  @IsUUID() puntoDeVentaId: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Type(() => Number)
  precioLocal?: number;
}