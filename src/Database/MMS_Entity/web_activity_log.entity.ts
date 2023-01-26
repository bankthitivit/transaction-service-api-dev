import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'web_activity_log' })
export class WebActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @CreateDateColumn({ name: 'date_time' })
  dateTime: Date

  @Column({ name: 'email' })
  email: string

  @Column({ name: 'menu' })
  menu: string

  @Column({ name: 'activity' })
  activity: string

  @Column({ name: 'detail' })
  detail: string
}
