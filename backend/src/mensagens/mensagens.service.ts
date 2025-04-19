import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensagem } from './entities/mensagen.entity';
import { Repository } from 'typeorm';
import { CreateMensagemDto } from './dto/create-mensagen.dto';
import { User } from 'src/users/entities/user.entity';
import { Vaga } from 'src/vagas/entities/vagas.entity';

@Injectable()
export class MensagensService {
  constructor(
    @InjectRepository(Mensagem)
    private readonly mensagemRepo: Repository<Mensagem>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Vaga)
    private readonly vagaRepo: Repository<Vaga>,
  ) {}

  async create(remetenteId: number, dto: CreateMensagemDto) {
    const remetente = await this.userRepo.findOne({ where: { id: remetenteId } });
    const destinatario = await this.userRepo.findOne({ where: { id: dto.destinatarioId } });
    const vaga = await this.vagaRepo.findOne({ where: { id: dto.vagaId } });

    if (!remetente || !destinatario || !vaga) {
      throw new NotFoundException('Remetente, destinatário ou vaga não encontrados');
    }

    const mensagem = this.mensagemRepo.create({
      remetente,
      destinatario,
      vaga,
      texto: dto.texto,
    });

    return this.mensagemRepo.save(mensagem);
  }

  async findConversaEntreUsuarios(vagaId: number, usuarioA: number, usuarioB: number) {
    return this.mensagemRepo.find({
      where: [
        {
          vaga: { id: vagaId },
          remetente: { id: usuarioA },
          destinatario: { id: usuarioB },
        },
        {
          vaga: { id: vagaId },
          remetente: { id: usuarioB },
          destinatario: { id: usuarioA },
        },
      ],
      order: { dataEnvio: 'ASC' },
    });
  }

  async listarConversasPorUsuario(usuarioId: number) {
    const mensagens = await this.mensagemRepo.find({
      where: [
        { remetente: { id: usuarioId } },
        { destinatario: { id: usuarioId } }
      ],
      relations: ['remetente', 'destinatario', 'vaga'],
      order: { dataEnvio: 'DESC' }
    });
  
    // Agrupar por vaga + outro usuário
    const conversasMap = new Map<string, any>();
  
    for (const msg of mensagens) {
      const outro = msg.remetente.id === usuarioId ? msg.destinatario : msg.remetente;
      const chave = `${msg.vaga.id}-${outro.id}`;
  
      if (!conversasMap.has(chave)) {
        conversasMap.set(chave, {
          vaga: msg.vaga,
          usuario: outro,
          ultimaMensagem: msg.texto,
          data: msg.dataEnvio
        });
      }
    }
  
    return Array.from(conversasMap.values());
  }

  async listarVagaIdsComMensagensRecebidas(userId: number): Promise<number[]> {
    const mensagens = await this.mensagemRepo.find({
      where: { destinatario: { id: userId } },
      relations: ['vaga'],
    });
  
    // extrai os ids das vagas
    const vagaIds = mensagens.map(m => m.vaga.id);
    // remove duplicados
    return [...new Set(vagaIds)];
  }
  
  
  
}
