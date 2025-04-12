import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../user-role.enum';
import { Exclude } from 'class-transformer';
import { Vaga } from 'src/vagas/entities/vagas.entity';
import { Candidatura } from 'src/candidaturas/entities/candidatura.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATO,
  })
    role: UserRole;

  @OneToMany(() => Vaga, (vaga) => vaga.publicadaPor)
  vagas: Vaga[];

  @OneToMany(() => Candidatura, candidatura => candidatura.usuario)
  candidaturas: Candidatura[];


}
