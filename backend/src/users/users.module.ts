import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidatura } from 'src/candidaturas/entities/candidatura.entity';
import { Mensagem } from 'src/mensagens/entities/mensagen.entity';
import { Vaga } from 'src/vagas/entities/vagas.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Candidatura, Mensagem, Vaga])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
