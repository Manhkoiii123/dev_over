import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product';
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async create(body: CreateProductTcpRequest) {
    return this.productRepository.create(body);
  }
  async getList() {
    return this.productRepository.findAll();
  }
}
