import { Module } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Module({
  providers: [ProductsRepository],
})
export class ProductsModule {}
