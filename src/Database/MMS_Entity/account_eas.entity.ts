import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'

@Entity({ name: 'account_eas' })
export class AccountEas extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  merchantId: string

  @Column({ name: 'account_code' })
  accountCode: string

  @Column({ name: 'account_type' })
  accountType: String
  
  @Column({ name: 'currency' })
  currency: string

  @Column({ name: 'participant_id' })
  participantId: string
  
  @Column({ name: 'bank_account_branch' })
  bankAccountBranch: string

  @Column({ name: 'bank_account_number' })
  bankAccountNumber: string

  @Column({ name: 'bank_account_name' })
  bankAccountName: string

  @Column({ name: 'bank_interface_id' })
  bankInterfaceId: string

  @Column({ name: 'archive_ind' })
  archiveInd: String

  @Column({ name: 'flag' })
  flag: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

export class AccountInsertData {
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @IsString()
  @IsNotEmpty()
  accountCode: string

  @IsString()
  @IsNotEmpty()
  accountType: String
  
  @IsString()
  @IsNotEmpty()
  currency: string

  @IsString()
  @IsNotEmpty()
  participantId: string
  
  @IsString()
  @IsNotEmpty()
  bankAccountBranch: string

  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string

  @IsString()
  @IsNotEmpty()
  bankAccountName: string

  @IsString()
  @IsNotEmpty()
  bankInterfaceId: string

  @IsString()
  @IsNotEmpty()
  archiveInd: String

  @IsBoolean()
  @IsNotEmpty()
  flag: boolean
}
