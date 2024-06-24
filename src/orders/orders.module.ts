import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { CartsModule } from 'src/carts/carts.module';
import { ProductsRepository } from 'src/products/products.repository';
import { UsersRepository } from 'src/users/users.repository';
import { CartsRepository } from 'src/carts/carts.repository';

@Module({
  providers: [
    OrdersService,
    OrdersRepository,
    ProductsRepository,
    UsersRepository,
    CartsRepository,
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
