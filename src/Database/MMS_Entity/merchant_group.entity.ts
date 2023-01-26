import { BaseEntity, Column, Entity, PrimaryColumn, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'
import { MasterMerchant } from './master_merchant.entity'
import { MerchantData } from './merchant_data.entity'

@Entity({ name: 'merchant_group' })
export class MerchantGroup extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @Column({ name: 'master_id' })
  masterId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToOne(() => MerchantData)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantData

  @ManyToOne(() => MasterMerchant)
  @JoinColumn({ name: 'master_id' })
  master: MasterMerchant
}

export class MerchantGroupInsertData {
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @IsString()
  @IsNotEmpty()
  masterId: string
}
