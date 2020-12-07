import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  BaseEntity,
  Column,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn() createdAt?: Date;
  @CreateDateColumn() updatedAt?: Date;
}
