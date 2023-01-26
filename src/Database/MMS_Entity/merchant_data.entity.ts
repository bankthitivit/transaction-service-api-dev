import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { IsNotEmpty, IsNumberString, IsString, IsUUID, IsNumber, IsObject, ValidateNested, IsOptional, IsInt, NotEquals } from 'class-validator'
import { Type } from 'class-transformer'
import { Owner } from './owner.entity'
import { BankAccount } from './bank_account.entity'
import { Category } from './category.entity'
import { SubCategory } from './sub_category.entity'
import { PaymentLimit } from './payment_limit.entity'
import { MerchantGroup } from './merchant_group.entity'

@Entity({ name: 'merchant_data' })
export class MerchantData extends BaseEntity {
  @PrimaryColumn({ name: 'merchant_id' })
  id: string

  @Column({ name: 'name_th' })
  nameTH: string

  @Column({ name: 'name_en' })
  nameEN: string

  @Column({ name: 'location_id' })
  locationId: number

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

  @Column({ name: 'phone_no' })
  phoneNo: string

  @Column({ name: 'order_amount' })
  orderAmount: string

  @Column({ name: 'avg_amount' })
  avgAmount: string

  @Column({ name: 'how_long' })
  howLong: string

  @Column({ name: 'payment_solution' })
  paymentSolution: string

  @Column({ name: 'description' })
  description: string

  @Column({ name: 'store_indoor' })
  storeIndoor: string

  @Column({ name: 'store_outdoor' })
  storeOutdoor: string

  @Column({ name: 'product' })
  product: string

  @Column({ name: 'merchant_status' })
  merchantStatus: number

  @Column({ name: 'settlement_time' })
  settlementTime: number

  @Column({ name: 'dbd_registered' })
  dbdRegistered: string

  @Column({ name: 'company_seal' })
  companySeal: string

  @Column({ name: 'shareholders_id_card' })
  shareholdersIdCard: string

  @Column({ name: 'shareholders_list' })
  shareholdersList: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'owner_id' })
  ownerId: string

  @ManyToOne(() => Owner)
  @JoinColumn({ name: 'owner_id' })
  owner: Owner

  @Column({ name: 'bank_account' })
  bankAccount: string
  
  @OneToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account' })
  bankAccountData: BankAccount

  @Column({ name: 'category_main_id' })
  categoryMainId: number

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_main_id' })
  categoryMain: Category

  @Column({ name: 'category_sub_id' })
  categorySubId: number

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  @OneToOne(() => SubCategory)
  @JoinColumn({ name: 'category_sub_id' })
  categorySub: SubCategory

  @Column({ name: 'payment_limit_id' })
  paymentLimitId: number

  @OneToOne(() => PaymentLimit)
  @JoinColumn({ name: 'payment_limit_id' })
  paymentLimit: PaymentLimit

  @OneToOne(() => MerchantGroup)
  @JoinColumn({ name: 'merchant_id' })
  merchantGroup: MerchantGroup
}

export class ownerInfo {
  @IsUUID()
  @IsNotEmpty()
  owner_id: string

  @IsNumberString()
  @IsNotEmpty()
  id_card_number: string

  @IsString()
  @IsNotEmpty()
  front_id_card: string | Buffer

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  first_name_th: string

  @IsString()
  @IsNotEmpty()
  last_name_th: string

  @IsString()
  @IsNotEmpty()
  first_name_en: string

  @IsString()
  @IsNotEmpty()
  last_name_en: string

  @IsNumberString()
  @IsNotEmpty()
  date_of_birth: string

  @IsString()
  @IsNotEmpty()
  phone_no: string

  @IsNumber()
  @IsNotEmpty()
  owner_type: number

  @IsString()
  @IsOptional()
  address: string

  @IsString()
  @IsNotEmpty()
  postcode: string

  @IsString()
  @IsNotEmpty()
  province: string

  @IsString()
  @IsNotEmpty()
  district: string

  @IsString()
  @IsNotEmpty()
  sub_district: string

  @IsString()
  @IsNotEmpty()
  tax_id: string

  @IsString()
  @IsOptional()
  company_name_th: string

  @IsString()
  @IsOptional()
  company_name_en: string

  @IsString()
  @IsOptional()
  branch_name: string
}

export class merchantInfo {
  @IsString()
  @IsNotEmpty()
  bank_account: string

  @IsString()
  @IsNotEmpty()
  bank_provider: string

  @IsString()
  @IsOptional()
  account_name_th?: string

  @IsString()
  @IsOptional()
  account_name_en?: string

  @IsString()
  @IsOptional()
  bank_passbook?: string | Buffer

  @IsString()
  @IsNotEmpty()
  name_th: string

  @IsString()
  @IsNotEmpty()
  name_en: string

  @IsString()
  @IsOptional()
  address: string

  @IsString()
  @IsOptional()
  postcode: string

  @IsString()
  @IsNotEmpty()
  province: string

  @IsString()
  @IsOptional()
  district: string

  @IsString()
  @IsOptional()
  sub_district: string

  @IsString()
  @IsNotEmpty()
  phone_no: string

  @IsNumber()
  @IsNotEmpty()
  category_id: number

  @IsNumber()
  @IsNotEmpty()
  sub_category_id: number

  @IsString()
  @IsNotEmpty()
  order_amount: string

  @IsString()
  @IsNotEmpty()
  avg_amount: string

  @IsString()
  @IsNotEmpty()
  how_long: string

  @IsString()
  @IsNotEmpty()
  payment_solution: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsNotEmpty()
  store_indoor: string | Buffer

  @IsString()
  @IsNotEmpty()
  store_outdoor: string | Buffer

  @IsString()
  @IsNotEmpty()
  product: string | Buffer

  @IsString()
  @IsOptional()
  dbd_registered: string | Buffer

  @IsString()
  @IsOptional()
  company_seal: string | Buffer

  @IsString()
  @IsOptional()
  shareholders_id_card: string | Buffer

  @IsString()
  @IsOptional()
  shareholders_list: string | Buffer
}

export class RegisterMerchantData {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ownerInfo)
  owner: ownerInfo

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => merchantInfo)
  merchant: merchantInfo
}

export class EditMerchantProfile{
  @IsString()
  @IsNotEmpty()
  merchant_id: string

  @IsString()
  @IsNotEmpty()
  merchant_name_th: string

  @IsString()
  @IsNotEmpty()
  merchant_name_en: string

  @IsString()
  @IsNotEmpty()
  province: string
}
