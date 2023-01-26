import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm'
import { Owner } from './owner.entity'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

@Entity({ name: 'master_merchant' })
export class MasterMerchant extends BaseEntity {
  @PrimaryColumn({ name: 'master_id' })
  id: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'owner_id' })
  ownerId: string

  @OneToOne(() => Owner)
  @JoinColumn({ name: 'owner_id' })
  owner: Owner
}

export class MasterInsertData {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsUUID()
  @IsNotEmpty()
  ownerId: string
}
