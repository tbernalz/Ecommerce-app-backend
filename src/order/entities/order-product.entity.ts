import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

import { Order } from './order.entity';
import { Product } from '../../product/product.entity';

@Entity('order_products')
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @Column({ type: 'int' })
  @Min(1)
  quantity: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Order, (order) => order.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  product: Product;
}
