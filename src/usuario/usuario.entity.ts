import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 15 })
  telefone: string;

  @Column({ length: 100 })
  rua: string;

  @Column()
  numero: number;

  @Column({ length: 50 })
  bairro: string;

  @Column({ length: 3 })
  alterado: string;

  @Column({ length: 255 })
  senha: string;

  @Column()
  acesso: number;

}