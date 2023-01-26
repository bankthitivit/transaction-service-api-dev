import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { IsBoolean, IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator'

@Entity({ name: 'settlement_eas' })
export class SettlementEas extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @Column({ name: 'account_code' })
  accountCode: string

  @Column({ name: 'expiry_date' })
  expiryDate: Date
  
  @Column({ name: 'description' })
  description: string

  @Column({ name: 'acquirer_ind' })
  acquirerInd: string
  
  @Column({ name: 'archive_ind' })
  archiveInd: string

  @Column({ name: 'ags_id' })
  agsId: string

  @Column({ name: 'establishment_date' })
  establishmentDate: string

  @Column({ name: 'flag' })
  flag: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

export class SettlementInsertData {
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @IsString()
  @IsNotEmpty()
  accountCode: string

  @IsDate()
  @IsOptional()
  expiryDate: Date
  
  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  acquirerInd: string
  
  @IsString()
  @IsNotEmpty()
  archiveInd: string

  @IsString()
  @IsNotEmpty()
  agsId: string

  @IsBoolean()
  @IsNotEmpty()
  flag: boolean
}
