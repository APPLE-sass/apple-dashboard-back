// src/imei/dto/process-imei.dto.ts
import { IsString, Length, Matches } from 'class-validator';

export class ProcessImeiDto {
  /**
   * The 15-digit IMEI number to look up.
   * Must contain exactly 15 numeric digits.
   */
  @IsString({ message: 'El IMEI debe ser un string.' })
  @Length(15, 15, { message: 'El IMEI debe tener exactamente 15 dígitos.' })
  @Matches(/^\d{15}$/, { message: 'El IMEI solo debe contener dígitos numéricos.' })
  imei: string;
}