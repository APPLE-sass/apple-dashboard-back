import { PartialType } from '@nestjs/mapped-types';
import { CreateAccesorioDto } from './create-accesorio.dto';

export class UpdateAccesorioDto extends PartialType(CreateAccesorioDto) {}