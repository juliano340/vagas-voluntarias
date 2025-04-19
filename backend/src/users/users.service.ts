import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Candidatura } from '../candidaturas/entities/candidatura.entity';
import { Mensagem } from 'src/mensagens/entities/mensagen.entity';
import { Vaga } from '../vagas/entities/vagas.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Candidatura)
    private candidaturaRepository: Repository<Candidatura>,

    @InjectRepository(Mensagem)
    private mensagemRepository: Repository<Mensagem>,

    @InjectRepository(Vaga)
    private vagaRepository: Repository<Vaga>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
  
    if (existing) {
      throw new BadRequestException('Email já cadastrado.');
    }
      
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
  
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUserProfile(id: number, data: { name: string; email: string }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  
    user.name = data.name;
    user.email = data.email;
  
    return this.userRepository.save(user);
  }

  async removerUsuarioComTudo(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
  
    // 🧹 1. Remove mensagens enviadas ou recebidas
    await this.mensagemRepository
      .createQueryBuilder()
      .delete()
      .where('remetenteId = :userId OR destinatarioId = :userId', { userId })
      .execute();
  
    // 🧹 2. Remove candidaturas feitas pelo usuário
    await this.candidaturaRepository.delete({ usuario: { id: userId } });
  
    // 🧹 3. Busca todas as vagas criadas pelo usuário
    const vagasCriadas = await this.vagaRepository.find({
      where: { publicadaPor: { id: userId } }
    });
  
    for (const vaga of vagasCriadas) {
      // 🧹 3.1 Remove candidaturas relacionadas a essa vaga
      await this.candidaturaRepository.delete({ vaga: { id: vaga.id } });
  
      // 🧹 3.2 Remove mensagens relacionadas a essa vaga
      await this.mensagemRepository.delete({ vaga: { id: vaga.id } });
  
      // 🧹 3.3 Remove a vaga
      await this.vagaRepository.delete(vaga.id);
    }
  
    // 🧹 4. Por fim, remove o usuário
    await this.userRepository.remove(user);
  }
  
  
  
  
}
