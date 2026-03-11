import { IsOptional, IsBoolean, IsEnum, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EstadoDispositivo } from '@prisma/client';

export class FilterDispositivoDto {
  @IsOptional() @IsUUID() puntoDeVentaId?: string;
  @IsOptional() @IsUUID() catalogoItemId?: string;
  @IsOptional() @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value) @IsBoolean() usado?: boolean;
  @IsOptional() @IsEnum(EstadoDispositivo) estado?: EstadoDispositivo;
  @IsOptional() @IsInt() @Min(1) @Max(100) @Type(() => Number) limit?: number = 20;
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number = 1;
}