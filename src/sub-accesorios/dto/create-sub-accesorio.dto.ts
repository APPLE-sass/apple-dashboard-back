import { ArrayMaxSize, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSubAccesorioDto {
    @IsString()
    nombre: string;

    @IsString()
    tipo: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    cantidad?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    colores?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(5, { message: 'No se pueden cargar más de 5 imágenes' })
    imagenes?: string[];

    @IsString()
    puntoDeVentaId: string;
}