import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator'

@Entity({ name: 'location_eas' })
export class LocationEas extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @Column({ name: 'participant_id' })
  participantId: string

  @Column({ name: 'location_id' })
  locationId: string
  
  @Column({ name: 'location_name' })
  locationName: string

  @Column({ name: 'address1' })
  address1: string
  
  @Column({ name: 'address2' })
  address2: string

  @Column({ name: 'topup_quota' })
  topupQuota: string

  @Column({ name: 'topup_quota_effective_date' })
  topupQuotaEffectiveDate: string

  @Column({ name: 'flag' })
  flag: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

export class LocationInsertData {
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @IsString()
  @IsNotEmpty()
  participantId: string

  @IsString()
  @IsNotEmpty()
  locationId: string
  
  @IsString()
  @IsNotEmpty()
  locationName: string

  @IsOptional()
  @IsNotEmpty()
  address1: string
  
  @IsOptional()
  @IsNotEmpty()
  address2: string

  @IsOptional()
  @IsNotEmpty()
  topupQuota: string

  @IsOptional()
  @IsNotEmpty()
  topupQuotaEffectiveDate: string

  @IsBoolean()
  @IsNotEmpty()
  flag: boolean
}
