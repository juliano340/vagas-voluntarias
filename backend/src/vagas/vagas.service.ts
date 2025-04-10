import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVagasDto } from './dto/create-vagas.dto';
import { UpdateVagasDto } from './dto/update-vagas.dto';
import { Vaga } from './entities/vagas.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VagasService {
  constructor(
    @InjectRepository(Vaga)
    private vagaRepository: Repository<Vaga>,
  ) {}

  async create(dto: CreateVagasDto, user: User) {
    if (user.role !== 'ofertante') {
      throw new ForbiddenException('Apenas usuários ofertantes podem criar vagas.');
    }

    const novaVaga = this.vagaRepository.create({
      ...dto,
      publicadaPor: user,
    });

    return this.vagaRepository.save(novaVaga);
  }

  findAll() {
    return this.vagaRepository.find({ relations: ['publicadaPor'] });
  }

  findOne(id: number) {
    return this.vagaRepository.findOne({ where: { id }, relations: ['publicadaPor'] });
  }

  async update(id: number, dto: UpdateVagasDto) {
    await this.vagaRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.vagaRepository.delete(id);
  }
}
