import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'int', nullable: true })
  linkedId!: number | null;

  @Column({ type: 'varchar', length: 20 })
  linkPrecedence!: 'primary' | 'secondary';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;
}
