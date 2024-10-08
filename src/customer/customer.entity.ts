import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';

import { User } from '../user/user.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @IsPhoneNumber(null) // Uses a default phone number format, can be customized
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ type: 'simple-array' })
  @IsArray()
  @IsString({ each: true })
  address: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  // maybe this shouldn't be nullable
  @OneToOne(() => User, (user) => user.customer, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;
}
