import { PartialType } from '@nestjs/mapped-types';
import { CreatePuntoDeVentaDto } from './create-pdv.dto';

export class UpdatePuntoDeVentaDto extends PartialType(CreatePuntoDeVentaDto) {}