import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';
import { ProductsModule } from 'src/products/products.module';
import { ProductsRepository } from 'src/products/products.repository';

@Module({
  providers: [CartsService, CartsRepository, ProductsRepository],
  controllers: [CartsController],
})
export class CartsModule {}
