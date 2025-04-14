import { Injectable, ForbiddenException, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
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

  async update(id: number, dto: UpdateVagasDto, user: User) {
    const vaga = await this.vagaRepository.findOne({ where: { id }, relations: ['publicadaPor'] });
  
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
  
    if (vaga.publicadaPor.id !== user.id) {
      throw new ForbiddenException('Você não tem permissão para editar esta vaga');
    }
  
    Object.assign(vaga, dto);
    return this.vagaRepository.save(vaga);
  }
  

  

async remove(id: number, user: User) {
  const vaga = await this.vagaRepository.findOne({
    where: { id },
    relations: ['publicadaPor'],
  });

  if (!vaga) throw new NotFoundException('Vaga não encontrada');

  if (vaga.publicadaPor.id !== user.id) {
    throw new ForbiddenException('Você não tem permissão para remover esta vaga');
  }

  try {
    await this.vagaRepository.remove(vaga);
  } catch (error) {
    if (error.code === '23503') {
      // Código do PostgreSQL para violação de chave estrangeira
      throw new ConflictException('Não é possível excluir a vaga pois existem candidatos inscritos.');
    }

    throw new InternalServerErrorException('Erro ao tentar excluir a vaga.');
  }
}
  async findMinhas(userId: number) {
    return this.vagaRepository.find({
      where: {
        publicadaPor: { id: userId },
      },
      relations: ['publicadaPor'],
      order: {
        dataCriacao: 'DESC',
      },
    });
  }
  
}
