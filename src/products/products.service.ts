import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: Relational query
    });
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term))
      product = await this.productRepository.findOneBy({ id: term });
    else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', { slug: term.toLowerCase(), title: term.toUpperCase() }).getOne();
    }
    if (!product)
      throw new NotFoundException(`Product with id ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productRepository.remove(producto);
  }

  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(`Error creating product`, error);

    throw new InternalServerErrorException('Unexpected error creating product, check the logs for more details');
  }
}
