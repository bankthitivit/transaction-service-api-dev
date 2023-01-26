import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

@Entity({ name: 'owner' })
export class Owner extends BaseEntity {
  @PrimaryColumn({ name: 'owner_id' })
  id: string

  @Column({ name: 'spid' })
  spid: number

  @Column({ name: 'id_card_number' })
  idCardNumber: string

  @Column({ name: 'front_id_card' })
  frontIdCard: string

  @Column({ name: 'title' })
  title: string

  @Column({ name: 'first_name_th' })
  firstNameTH: string

  @Column({ name: 'last_name_th' })
  lastNameTH: string

  @Column({ name: 'first_name_en' })
  firstNameEN: string

  @Column({ name: 'last_name_en' })
  lastNameEN: string

  @Column({ name: 'date_of_birth' })
  dateOfBirth: string

  @Column({ name: 'phone_no' })
  phoneNo: string

  @Column({ name: 'tax_id' })
  taxId: string

  @Column({ name: 'owner_type' })
  ownerType: number

  @Column({ name: 'address' })
  address: string

  @Column({ name: 'province' })
  province: string

  @Column({ name: 'district' })
  district: string

  @Column({ name: 'sub_district' })
  subDistrict: string

  @Column({ name: 'postcode' })
  postcode: string

  @Column({ name: 'company_name_th' })
  companyNameTH: string

  @Column({ name: 'company_name_en' })
  companyNameEN: string

  @Column({ name: 'branch_name' })
  branchName: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export class OwnerInsertData {
  @IsUUID()
  @IsNotEmpty()
  id: string

  @IsInt()
  @IsNotEmpty()
  spid: number

  @IsString()
  @IsNotEmpty()
  idCardNumber: string

  @IsString()
  @IsNotEmpty()
  frontIdCard: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  firstNameTH: string

  @IsString()
  @IsNotEmpty()
  lastNameTH: string

  @IsString()
  @IsNotEmpty()
  firstNameEN: string

  @IsString()
  @IsNotEmpty()
  lastNameEN: string

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string

  @IsString()
  @IsNotEmpty()
  phoneNo: string

  @IsString()
  @IsNotEmpty()
  taxId: string

  @IsInt()
  @IsNotEmpty()
  ownerType: number

  @IsString()
  @IsOptional()
  address: string

  @IsString()
  @IsNotEmpty()
  province: string

  @IsString()
  @IsNotEmpty()
  district: string

  @IsString()
  @IsNotEmpty()
  subDistrict: string

  @IsString()
  @IsNotEmpty()
  postcode: string

  @IsString()
  @IsOptional()
  companyNameTH: string

  @IsString()
  @IsOptional()
  companyNameEN: string

  @IsString()
  @IsOptional()
  branchName: string
}

export class GetCitizenId {
  @IsUUID()
  @IsNotEmpty()
  owner_id: string
}
