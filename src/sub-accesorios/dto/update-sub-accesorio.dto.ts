import { PartialType } from '@nestjs/mapped-types';
import { CreateSubAccesorioDto } from './create-sub-accesorio.dto';

export class UpdateSubAccesorioDto extends PartialType(CreateSubAccesorioDto) {}