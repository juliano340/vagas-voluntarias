import { Module } from '@nestjs/common';
import { VagasService } from './vagas.service';
import { VagasController } from './vagas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaga } from './entities/vagas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vaga]),],
  controllers: [VagasController],
  providers: [VagasService],
})
export class VagasModule {}
