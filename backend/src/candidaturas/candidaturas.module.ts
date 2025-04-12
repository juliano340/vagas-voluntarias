import { Module } from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service';
import { CandidaturasController } from './candidaturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidatura } from './entities/candidatura.entity';
import { Vaga } from 'src/vagas/entities/vagas.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidatura, Vaga, User])],

  controllers: [CandidaturasController],
  providers: [CandidaturasService],
})
export class CandidaturasModule {}
