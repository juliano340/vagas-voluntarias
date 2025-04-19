import { Injectable, ForbiddenException, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVagasDto } from './dto/create-vagas.dto';
import { UpdateVagasDto } from './dto/update-vagas.dto';
import { Vaga } from './entities/vagas.entity';
import { User } from '../users/entities/user.entity';
import { Candidatura } from 'src/candidaturas/entities/candidatura.entity';
import { Mensagem } from 'src/mensagens/entities/mensagen.entity';

@Injectable()
export class VagasService {
  

  
  constructor(
    @InjectRepository(Vaga)
    private vagaRepository: Repository<Vaga>,
    @InjectRepository(Candidatura)
    private candidaturaRepository: Repository<Candidatura>,
    @InjectRepository(Mensagem)
    private mensagemRepository: Repository<Mensagem>,
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
      // 🧹 1. Remove mensagens relacionadas à vaga
      await this.mensagemRepository.delete({ vaga: { id } });
  
      // 🧹 2. Remove candidaturas relacionadas à vaga
      await this.candidaturaRepository.delete({ vaga: { id } });
  
      // 🧹 3. Remove a vaga
      await this.vagaRepository.remove(vaga);
  
    } catch (error) {
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

  async listarCandidatosDaVaga(vagaId: number, user: User) {
    const vaga = await this.vagaRepository.findOne({
      where: { id: vagaId },
      relations: ['publicadaPor'],
    });
  
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
  
    if (vaga.publicadaPor.id !== user.id) {
      throw new ForbiddenException('Você não tem permissão para ver os candidatos desta vaga.');
    }
  
    const candidaturas = await this.candidaturaRepository.find({
      where: { vaga: { id: vagaId } },
      relations: ['usuario'],
      order: { dataCandidatura: 'DESC' },
    });
  
    return candidaturas.map(c => ({
      id: c.usuario.id,
      nome: c.usuario.name,
      email: c.usuario.email,
      dataCandidatura: c.dataCandidatura,
    }));
  }
  
  
}
