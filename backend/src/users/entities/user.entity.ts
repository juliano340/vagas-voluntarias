import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { UserRole } from '../user-role.enum';
import { Exclude } from 'class-transformer';


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
}
