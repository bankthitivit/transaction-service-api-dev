import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'pgw_config' })
export class PgwConfig extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'pgw_config_id' })
  id: number

  @Column({ name: 'noti_retry_amount' })
  notiRetryAmount: number

  @Column({ name: 'noti_retry_delay' })
  notiRetryDelay: number

  @Column({ name: 'vat' })
  vat: number

  @Column({ name: 'withholding_tax' })
  withholdingTax: number

  @Column({ name: 'qr_timeout' })
  qrTimeout: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
