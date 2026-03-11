// src/products/dto/create-product.dto.ts

import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Matches,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsString()
  @Length(15, 15, { message: 'El IMEI debe tener exactamente 15 dígitos' })
  @Matches(/^\d{15}$/, { message: 'El IMEI solo debe contener números' })
  imei: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bateria?: number;

  @IsOptional()
  @IsBoolean()
  usado?: boolean;

  @IsString()
  catalogoItemId: string;

  @IsString()
  puntoDeVentaId: string;

  @IsOptional()
  @IsString()
  proveedorId?: string;
}

































// // src/products/dto/create-product.dto.ts
// import {
//   IsString, IsEnum, IsInt, IsBoolean,
//   IsOptional, Min, MinLength, MaxLength,
//   IsNumber, Matches, Length,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { Categoria } from '@prisma/client';

// export class CreateProductDto {
//   @IsString()
//   @MinLength(2)
//   @MaxLength(120)
//   modelo: string;

//   @IsEnum(Categoria, {
//     message: `La categoría debe ser uno de: ${Object.values(Categoria).join(', ')}`,
//   })
//   categoria: Categoria;

//   @IsString()
//   @MinLength(1)
//   @MaxLength(20)
//   memoria: string;

//   @IsString()
//   @MinLength(2)
//   @MaxLength(60)
//   color: string;

//   @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número decimal válido' })
//   @Min(0)
//   @Type(() => Number)
//   precio: number;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   @Type(() => Number)
//   bateria?: number;

//   @IsOptional()
//   @IsBoolean()
//   usado?: boolean;

//   @IsInt()
//   @Min(0)
//   @Type(() => Number)
//   stock: number;

//   /**
//    * IMEI de la unidad física (15 dígitos, único por producto).
//    * El frontend lo captura con @zxing/library o entrada manual.
//    * La validación Luhn se aplica en el pipe igual que en /imei/process.
//    */
//   @IsOptional()
//   @IsString()
//   @Length(15, 15, { message: 'El IMEI debe tener exactamente 15 dígitos' })
//   @Matches(/^\d{15}$/, { message: 'El IMEI solo debe contener dígitos numéricos' })
//   imei?: string;

//   /**
//    * ID del ítem del catálogo al que pertenece esta unidad.
//    * Opcional — un producto puede existir sin estar en el catálogo.
//    */
//   @IsOptional()
//   @IsString()
//   catalogoItemId?: string;

//   /**
//    * ID del Punto de Venta donde se encuentra el producto.
//    * Reemplaza sucursalId.
//    */
//   @IsOptional()
//   @IsString()
//   puntoDeVentaId?: string;

//   // ── DEPRECATED — conservado por compatibilidad, ignorar en nuevas altas ──
//   @IsOptional()
//   @IsString()
//   proveedorId?: string;
// }