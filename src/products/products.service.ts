import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );
      return product;
    } catch (error) {
        this.handleDbExceptions(error);
    };
  };

  async findAll( paginationDto:PaginationDto) {
    
    const { limit = 10, offset = 0 } =paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  };

  async findOne(id: string) {
    const product = await this.productRepository.findBy({ id });    
    if( !product || product.length === 0 ) throw new NotFoundException(`Product with id ${ id } not found`);
    return product;
  };

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  };

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );
  };

  private handleDbExceptions( error:any ) {
    if( error.code === '23505' ) throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');   
  };
}
