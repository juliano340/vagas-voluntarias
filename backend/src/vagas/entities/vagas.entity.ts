import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Vaga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descricao: string;

  @Column()
  localidade: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @ManyToOne(() => User, (user) => user.vagas)
  publicadaPor: User;
}
