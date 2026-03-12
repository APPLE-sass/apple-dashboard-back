import { IsOptional, IsString } from 'class-validator';

export class CreatePuntoDeVentaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;
}