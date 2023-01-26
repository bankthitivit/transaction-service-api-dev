import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number

  @Column({ name: 'category_th' })
  categoryTH: string

  @Column({ name: 'category_en' })
  categoryEN: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
