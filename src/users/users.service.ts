import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { GetUserQuery } from './models/queries/getUser.query';
import { GetUserOrdersQuery } from './models/queries/getUserOrders.query';
import { OrdersRepository } from 'src/orders/orders.repository';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private orderRepository: OrdersRepository,
  ) {}

  async getUser(query: GetUserQuery) {
    const user = await this.userRepository.getById(query.userId);

    return user;
  }

  async getUserOrders(query: GetUserOrdersQuery) {
    return this.orderRepository.getByUserId(query.userId);
  }
}
