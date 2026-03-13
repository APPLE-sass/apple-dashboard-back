import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
 
export class FilterAccesorioDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;
 
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 12;
 
  @IsOptional()
  @IsString()
  search?: string;
 
  @IsOptional()
  @IsString()
  tipo?: string;
 
  // query string llega como "true"/"false" — Transform lo convierte
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  activo?: boolean;
 
  @IsOptional()
  @IsString()
  puntoDeVentaId?: string;
}