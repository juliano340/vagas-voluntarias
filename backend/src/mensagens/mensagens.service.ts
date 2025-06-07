import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensagem } from './entities/mensagen.entity';
import { Repository } from 'typeorm';
import { CreateMensagemDto } from './dto/create-mensagen.dto';
import { User } from 'src/users/entities/user.entity';
import { Vaga } from 'src/vagas/entities/vagas.entity';
import { Candidatura } from '../candidaturas/entities/candidatura.entity';

@Injectable()
export class MensagensService {
  constructor(
    @InjectRepository(Mensagem)
    private readonly mensagemRepo: Repository<Mensagem>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Vaga)
    private readonly vagaRepo: Repository<Vaga>,

    @InjectRepository(Candidatura)
    private candidaturaRepo: Repository<Candidatura>,
  ) {}

  async create(remetenteId: number, dto: CreateMensagemDto): Promise<Mensagem> {
    const { destinatarioId, texto, vagaId } = dto;

    const remetente = await this.userRepo.findOne({
      where: { id: remetenteId },
    });
    const destinatario = await this.userRepo.findOne({
      where: { id: destinatarioId },
    });
    const vaga = await this.vagaRepo.findOne({
      where: { id: vagaId },
      relations: ['publicadaPor'],
    });

    if (!remetente || !destinatario || !vaga) {
      throw new NotFoundException(
        'Remetente, destinatário ou vaga não encontrados',
      );
    }

    const candidatoRelacionado = await this.candidaturaRepo.findOne({
      where: {
        usuario: { id: remetenteId },
        vaga: { id: vagaId },
      },
    });

    const remetenteÉOfertante = vaga.publicadaPor.id === remetenteId;

    if (!remetenteÉOfertante && !candidatoRelacionado) {
      throw new ForbiddenException(
        'Você não está autorizado a enviar mensagens nesta vaga.',
      );
    }

    const novaMensagem = this.mensagemRepo.create({
      texto,
      remetente,
      destinatario,
      vaga,
    });

    return this.mensagemRepo.save(novaMensagem);
  }

  async findConversaEntreUsuarios(
    vagaId: number,
    usuarioA: number,
    usuarioB: number,
  ) {
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
        { destinatario: { id: usuarioId } },
      ],
      relations: ['remetente', 'destinatario', 'vaga'],
      order: { dataEnvio: 'DESC' },
    });

    const conversasMap = new Map<string, any>();

    for (const msg of mensagens) {
      const outro =
        msg.remetente.id === usuarioId ? msg.destinatario : msg.remetente;
      const chave = `${msg.vaga.id}-${outro.id}`;

      if (!conversasMap.has(chave)) {
        conversasMap.set(chave, {
          vaga: msg.vaga,
          usuario: outro,
          ultimaMensagem: msg.texto,
          data: msg.dataEnvio,
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

    const vagaIds = mensagens.map((m) => m.vaga.id);

    return [...new Set(vagaIds)];
  }
}
