import { Module } from '@nestjs/common';
import { VagasService } from './vagas.service';
import { VagasController } from './vagas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaga } from './entities/vagas.entity';
import { Candidatura } from 'src/candidaturas/entities/candidatura.entity';
import { Mensagem } from 'src/mensagens/entities/mensagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vaga, Candidatura, Mensagem]),],
  controllers: [VagasController],
  providers: [VagasService],
})
export class VagasModule {}
