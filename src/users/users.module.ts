import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OrdersRepository } from 'src/orders/orders.repository';

@Module({
  providers: [UsersRepository, UsersService, OrdersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
