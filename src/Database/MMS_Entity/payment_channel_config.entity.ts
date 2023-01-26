import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'payment_channel_config' })
export class PaymentChannelConfig extends BaseEntity {
  @PrimaryColumn({ name: 'payment_channel_id' })
  id: number

  @Column({ name: 'payment_channel_table_name' })
  paymentChannelTableName: string

  @Column({ name: 'payment_channel_status' })
  paymentChannelStatus: number

  @Column({ name: 'current_payment_channel_id' })
  currentPaymentChannelId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
