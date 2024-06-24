import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './models';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/auth.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async createOrder(@Body() { address }: CreateOrderDto, @GetUser() { sub }) {
    return await this.orderService.createOrder({ userId: sub, address });
  }
}
