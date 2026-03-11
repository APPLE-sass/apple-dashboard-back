import { IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePrecioLocalDto {
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Type(() => Number)
  precioLocal?: number | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
}