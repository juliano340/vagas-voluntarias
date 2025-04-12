import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vaga } from '../../vagas/entities/vagas.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Candidatura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vaga, vaga => vaga.candidaturas)
  vaga: Vaga;

  @ManyToOne(() => User, user => user.candidaturas)
  usuario: User;

  @CreateDateColumn()
  dataCandidatura: Date;
}
