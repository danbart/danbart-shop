import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product_image.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '32c5cab3-aca5-4212-b41d-f23ffaad6579',
    description: 'The unique identifier of the product',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt',
    description: 'The title of the product',
    title: 'Title',
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty()
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty()
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty()
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      cascade: true,
      eager: true,
    },
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    // {
    //   onDelete: 'CASCADE',
    // },
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug)
      this.slug = this.title;
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(/[^a-z0-9_]/g, '')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(/[^a-z0-9_]/g, '')
      .replaceAll("'", '');
  }
}
