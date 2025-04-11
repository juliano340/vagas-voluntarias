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

  async findAll(filtros: { localidade?: string; titulo?: string }) {
    const { localidade, titulo } = filtros;
  
    const query = this.vagaRepository.createQueryBuilder('vaga')
      .leftJoinAndSelect('vaga.publicadaPor', 'user')
      .orderBy('vaga.dataCriacao', 'DESC');
  
    if (localidade) {
      query.andWhere('vaga.localidade ILIKE :localidade', { localidade: `%${localidade}%` });
    }
  
    if (titulo) {
      query.andWhere('vaga.titulo ILIKE :titulo', { titulo: `%${titulo}%` });
    }
  
    return query.getMany();
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
