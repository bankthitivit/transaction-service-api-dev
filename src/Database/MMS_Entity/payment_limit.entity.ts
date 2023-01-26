import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'payment_limit' })
export class PaymentLimit extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'payment_limit_id' })
  id: number

  @Column({ name: 'day_limit' })
  dayLimit: string

  @Column({ name: 'month_limit' })
  monthLimit: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
