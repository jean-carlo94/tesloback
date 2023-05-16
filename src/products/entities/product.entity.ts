import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({ 
        example: 'f51de02b-07f5-4b54-971e-ca0eec609d35',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({ 
        example: 'T-Shit Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;


    @ApiProperty({ 
        example: 0,
        description: 'Product prise',
    })
    @Column('float',{
        default: 0
    })
    price: number;


    @ApiProperty({ 
        example: 'Reprehenderit cupidatat sunt qui id ut pariatur nisi.',
        description: 'Product description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string


    @ApiProperty({
        example: 't_shit_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: null
    })
    @Column({
        unique: true
    })
    slug: string;


    @ApiProperty({
        example: 10,
        description: 'Product in stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;


    @ApiProperty({
        example: ['M','XL', 'XXL'],
        description: 'Product sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[]


    @ApiProperty({
        example: 'women',
        description: 'Product Gender',
    })
    @Column('text', {
        nullable: false
    })
    gender: string;


    @ApiProperty({
        example: ['tang1','tang2', 'tang3'],
        description: 'Product Tags',
    })
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];


    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title
              .toLowerCase()
        };

        this.slug = this.slug
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');

    };


    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
    };
}
