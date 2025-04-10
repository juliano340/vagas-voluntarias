import { PartialType } from '@nestjs/mapped-types';
import { CreateVagasDto } from './create-vagas.dto';

export class UpdateVagasDto extends PartialType(CreateVagasDto) {}
