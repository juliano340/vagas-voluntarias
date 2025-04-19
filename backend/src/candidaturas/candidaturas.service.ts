import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { Candidatura } from './entities/candidatura.entity';
import { Vaga } from '../vagas/entities/vagas.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CandidaturasService {
  constructor(
    @InjectRepository(Candidatura)
    private candidaturaRepository: Repository<Candidatura>,

    @InjectRepository(Vaga)
    private vagaRepository: Repository<Vaga>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, createCandidaturaDto: CreateCandidaturaDto): Promise<Candidatura> {
    const { vagaId } = createCandidaturaDto;
  
    const vaga = await this.vagaRepository.findOne({ where: { id: vagaId } });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
  
    const candidaturaExistente = await this.candidaturaRepository.findOne({
      where: { vaga: { id: vagaId }, usuario: { id: userId } },
    });
  
    if (candidaturaExistente) {
      throw new ConflictException('Usuário já se candidatou a esta vaga');
    }
  
    const novaCandidatura = this.candidaturaRepository.create({
      vaga,
      usuario: user,
    });
  
    return this.candidaturaRepository.save(novaCandidatura);
  }

  async findAll(): Promise<Candidatura[]> {
    return this.candidaturaRepository.find({
      relations: ['vaga', 'user'],
    });
  }

  async findOne(id: number): Promise<Candidatura> {
    const candidatura = await this.candidaturaRepository.findOne({
      where: { id },
      relations: ['vaga', 'user'],
    });

    if (!candidatura) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return candidatura;
  }

  async update(id: number, updateDto: UpdateCandidaturaDto): Promise<Candidatura> {
    const candidatura = await this.findOne(id);

    // Exemplo de atualização simples, adapte conforme os campos do DTO
    Object.assign(candidatura, updateDto);

    return this.candidaturaRepository.save(candidatura);
  }

  async remove(id: number): Promise<void> {
    const candidatura = await this.findOne(id);
    await this.candidaturaRepository.remove(candidatura);
  }  
  
  async findVagasDoUsuario(usuarioId: number): Promise<number[]> {
    const candidaturas = await this.candidaturaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['vaga', 'usuario'], // 👈 IMPORTANTE: carregar 'usuario'
    });
  
    console.log('📝 Candidaturas encontradas para usuário', usuarioId, ':', candidaturas);
  
    return candidaturas.map(c => c.vaga.id);
  }
  
  
  
  
  
}
