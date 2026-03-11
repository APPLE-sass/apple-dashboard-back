import { IsString, IsBoolean, IsOptional, IsInt, Min, Matches, Length, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoDispositivo } from '@prisma/client';

export class CreateDispositivoDto {
  @IsString() @Length(15, 15, { message: 'El IMEI debe tener exactamente 15 dígitos' })
  @Matches(/^\d{15}$/, { message: 'El IMEI solo debe contener números' })
  imei: string;

  @IsOptional() @IsString() memoria?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) bateria?: number;
  @IsOptional() @IsBoolean() usado?: boolean;
  @IsOptional() @IsEnum(EstadoDispositivo) estado?: EstadoDispositivo;
  @IsOptional() @IsString() notas?: string;

  @IsUUID() catalogoItemId: string;
  @IsUUID() puntoDeVentaId: string;
  @IsOptional() @IsUUID() proveedorId?: string;
}