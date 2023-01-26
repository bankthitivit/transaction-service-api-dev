import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

@Entity({ name: 'fee_eas' })
export class FeeEas extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @Column({ name: 'fee_type' })
  feeType: string

  @Column({ name: 'good_for_settle_ind' })
  goodForSettleInd: string

  @Column({ name: 'source_id' })
  sourceId: string

  @Column({ name: 'dest_id' })
  destId: string

  @Column({ name: 'service_id' })
  serviceId: string

  @Column({ name: 'payer_id' })
  payerId: string

  @Column({ name: 'payee_id' })
  payeeId: string

  @Column({ name: 'establishment_date' })
  establishmentDate: string

  @Column({ name: 'description' })
  description: string

  @Column({ name: 'days' })
  days: string

  @Column({ name: 'fee_amount' })
  feeAmount: string

  @Column({ name: 'min_value' })
  minValue: string

  @Column({ name: 'max_value' })
  maxValue: string

  @Column({ name: 'currency' })
  currency: string

  @Column({ name: 'tax_code0' })
  taxCode0: string

  @Column({ name: 'tax_code1' })
  taxCode1: string

  @Column({ name: 'ags_id' })
  agsId: string

  @Column({ name: 'flag' })
  flag: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

export class FeeInsertData {
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @IsString()
  @IsNotEmpty()
  feeType: string

  @IsString()
  @IsNotEmpty()
  goodForSettleInd: string

  @IsString()
  @IsNotEmpty()
  sourceId: string

  @IsString()
  @IsNotEmpty()
  destId: string

  @IsString()
  @IsNotEmpty()
  serviceId: string

  @IsString()
  @IsNotEmpty()
  payerId: string

  @IsString()
  @IsNotEmpty()
  payeeId: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  days: string

  @IsString()
  @IsNotEmpty()
  feeAmount: string

  @IsString()
  @IsNotEmpty()
  minValue: string

  @IsString()
  @IsNotEmpty()
  maxValue: string

  @IsString()
  @IsNotEmpty()
  currency: string

  @IsString()
  @IsNotEmpty()
  taxCode0: string

  @IsString()
  @IsNotEmpty()
  taxCode1: string

  @IsString()
  @IsNotEmpty()
  agsId: string

  @IsBoolean()
  @IsNotEmpty()
  flag: boolean
}
