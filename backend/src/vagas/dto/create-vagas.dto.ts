import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVagasDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  localidade: string;
}
