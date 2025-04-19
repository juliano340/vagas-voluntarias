export class Mensagen {}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Vaga } from 'src/vagas/entities/vagas.entity';

@Entity()
export class Mensagem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  remetente: User;

  @ManyToOne(() => User, { eager: true })
  destinatario: User;

  @ManyToOne(() => Vaga, { eager: true })
  vaga: Vaga;

  @Column()
  texto: string;

  @CreateDateColumn()
  dataEnvio: Date;
}
