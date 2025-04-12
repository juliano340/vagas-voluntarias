import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Candidatura } from 'src/candidaturas/entities/candidatura.entity';

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

  @OneToMany(() => Candidatura, candidatura => candidatura.vaga)
  candidaturas: Candidatura[];
}
