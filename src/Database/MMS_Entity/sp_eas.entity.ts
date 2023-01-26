import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator'

@Entity({ name: 'sp_eas' })
export class SpEas extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @Column({ name: 'participant_group' })
  participantGroup: string

  @Column({ name: 'acquirer_id' })
  acquirerId: string
  
  @Column({ name: 'participant_id' })
  participantId: string

  @Column({ name: 'name' })
  name: string
  
  @Column({ name: 'short_name' })
  shortName: string

  @Column({ name: 'tax_id' })
  taxId: string

  @Column({ name: 'is_linepay_participant' })
  isLinepayParticipant: string

  @Column({ name: 'linepay_id' })
  linepayId: string

  @Column({ name: 'service_type' })
  serviceType: string

  @Column({ name: 'linepay_channel_id' })
  linepayChannelId: string

  @Column({ name: 'linepay_channel_secret_key' })
  linepayChannelSecretKey: string

  @Column({ name: 'topup_quota' })
  topupQuota: string

  @Column({ name: 'brand_name' })
  brandName: string

  @Column({ name: 'is_direct_topup' })
  isDirectTopup: string

  @Column({ name: 'archive_ind' })
  archiveInd: string

  @Column({ name: 'creator_user_id' })
  creatorUserId: string

  @Column({ name: 'flag' })
  flag: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

export class SpInsertData {
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @IsString()
  @IsNotEmpty()
  participantGroup: string

  @IsString()
  @IsNotEmpty()
  acquirerId: string

  @IsString()
  @IsNotEmpty()
  participantId: string

  @IsString()
  @IsNotEmpty()
  name: string
  
  @IsString()
  @IsNotEmpty()
  shortName: string

  @IsString()
  @IsNotEmpty()
  taxId: string

  @IsString()
  @IsNotEmpty()
  isLinepayParticipant: string

  @IsString()
  @IsNotEmpty()
  linepayId: string

  @IsString()
  @IsNotEmpty()
  serviceType: string

  @IsString()
  @IsNotEmpty()
  linepayChannelId: string

  @IsString()
  @IsNotEmpty()
  linepayChannelSecretKey: string

  @IsString()
  @IsOptional()
  topupQuota: string

  @IsString()
  @IsOptional()
  brandName: string

  @IsString()
  @IsNotEmpty()
  isDirectTopup: string

  @IsString()
  @IsNotEmpty()
  archiveInd: string

  @IsString()
  @IsNotEmpty()
  creatorUserId: string

  @IsBoolean()
  @IsNotEmpty()
  flag: boolean
}