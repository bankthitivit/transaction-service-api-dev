import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm'
import { Category } from './category.entity'

@Entity({ name: 'sub_category' })
export class SubCategory extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'sub_category_id' })
  id: number

  @Column({ name: 'sub_category_th' })
  subCategoryTH: string

  @Column({ name: 'category_en' })
  subCategoryEN: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  categoryId: Category
}
