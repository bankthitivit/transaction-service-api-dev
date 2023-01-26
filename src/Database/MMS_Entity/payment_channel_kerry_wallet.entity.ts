import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'payment_channel_kerry_wallet' })
export class PaymentChannelKerryWallet extends BaseEntity {
  @PrimaryColumn({ name: 'payment_channel_config_id' })
  id: number

  @Column({ name: 'payment_channel_name' })
  paymentChannelName: string

  @Column({ name: 'config_name' })
  configName: string

  @Column({ name: 'config_value' })
  configValue: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
