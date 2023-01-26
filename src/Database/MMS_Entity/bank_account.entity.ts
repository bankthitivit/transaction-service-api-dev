import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

@Entity({ name: 'bank_account' })
export class BankAccount extends BaseEntity {
  @PrimaryColumn({ name: 'bank_account' })
  bankAccount: string

  @Column({name: 'account_name_th' })
  accountNameTH: string

  @Column({name: 'account_name_en' })
  accountNameEN: string

  @Column({ name: 'bank_provider' })
  bankProvider: string

  @Column({ name: 'bank_passbook' })
  bankPassbook: string

  @Column({ name: 'merchant_id' })
  merchantId: string
}

export class BankAccountInsertData {
  @IsString()
  @IsNotEmpty()
  bankAccount: string

  @IsString()
  @IsOptional()
  accountNameTH?: string

  @IsString()
  @IsOptional()
  accountNameEN?: string

  @IsString()
  @IsNotEmpty()
  bankProvider: string

  @IsString()
  @IsOptional()
  bankPassbook?: string

  @IsString()
  @IsNotEmpty()
  merchantId: string
}