import { BaseEntity, Column, Entity, PrimaryColumn, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'mdr_group' })
export class MdrGroup extends BaseEntity {
  @PrimaryColumn({ name: 'mdr_group_id' })
  id: number

  @Column({ name: 'group_name' })
  groupName: string

  @Column({ name: 'mdr' })
  mdr: number
z
  @Column({ name: 'payment_channel_name' })
  paymentChannelName: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
