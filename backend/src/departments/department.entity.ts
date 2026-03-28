import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'parent_id' })
  parent: Department;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  status: number;

  @ManyToMany(() => User, user => user.departments)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
