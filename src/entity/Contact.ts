import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'int', nullable: true, name: 'linked_id' })
  linkedId!: number | null;

  @Column({ type: 'varchar', length: 20, name: 'link_precedence' })
  linkPrecedence!: 'primary' | 'secondary';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null;
}
