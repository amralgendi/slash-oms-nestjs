import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';

@Module({
  providers: [CartsService, CartsRepository],
  controllers: [CartsController],
})
export class CartsModule {}
