import { BaseEntity, Column, Entity, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm'
import { MerchantData } from './merchant_data.entity'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

@Entity({ name: 'merchant_auth' })
export class MerchantAuth extends BaseEntity {
  @PrimaryColumn({ name: 'partner_id' })
  partnerId: string

  @Column({ name: 'partner_secret' })
  partnerSecret: string

  @Column({ name: 'merchant_id' })
  merchantId: string

  @OneToOne(() => MerchantData)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantData
}

export class MerchantAuthInsertData {
  @IsUUID()
  @IsNotEmpty()
  partnerId: string

  @IsString()
  @IsNotEmpty()
  partnerSecret: string

  @IsString()
  @IsNotEmpty()
  merchantId: string
}