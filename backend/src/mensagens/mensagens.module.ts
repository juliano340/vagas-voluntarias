import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensagensService } from './mensagens.service';
import { MensagensController } from './mensagens.controller';
import { Mensagem } from './entities/mensagen.entity';
import { User } from 'src/users/entities/user.entity';
import { Vaga } from 'src/vagas/entities/vagas.entity';
import { Candidatura } from 'src/candidaturas/entities/candidatura.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mensagem, User, Vaga, Candidatura]) 
  ],
  controllers: [MensagensController],
  providers: [MensagensService]
})
export class MensagensModule {}
