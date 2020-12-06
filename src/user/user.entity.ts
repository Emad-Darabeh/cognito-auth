import { Entity, PrimaryColumn, CreateDateColumn, BaseEntity, Column } from "typeorm";

@Entity('user')
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  username: string;

  @CreateDateColumn() createdAt?: Date;
  @CreateDateColumn() updatedAt?: Date;
}
