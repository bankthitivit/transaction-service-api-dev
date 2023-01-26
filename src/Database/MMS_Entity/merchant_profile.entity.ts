import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm'
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'
import { MerchantData } from './merchant_data.entity'
import { PaymentChannelConfig } from './payment_channel_config.entity'
import { MdrGroup } from './mdr_group.entity'
import { PgwConfig } from './pgw_config.entity'

@Entity({ name: 'merchant_profile' })
export class MerchantProfile extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @PrimaryColumn({ name: 'payment_channel_id' })
  paymentChannelId: number

  @PrimaryColumn({ name: 'payment_channel_config_id' })
  paymentChannelConfigId: number

  @PrimaryColumn({ name: 'mdr_group_id' })
  mdrGroupId: number

  @Column({ name: 'pgw_config_id' })
  pgwConfigId: number

  @Column({ name: 'profile_status' })
  profileStatus: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToOne(() => MerchantData)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantData

  @OneToOne(() => PaymentChannelConfig)
  @JoinColumn({ name: 'payment_channel_id' })
  paymentChannelConfig: PaymentChannelConfig

  @OneToOne(() => MdrGroup)
  @JoinColumn({ name: 'mdr_group_id' })
  mdrGroup: MdrGroup

  @OneToOne(() => PgwConfig)
  @JoinColumn({ name: 'pgw_config_id' })
  pgwConfig: PgwConfig
}

export class GetMerchantProfile {
  @IsString()
  @IsNotEmpty()
  merchant_id: string

  @IsBoolean()
  @IsNotEmpty()
  get_picture: boolean
}
