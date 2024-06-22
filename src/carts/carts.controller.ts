import { Body, Controller, Post } from '@nestjs/common';
import { AddToCartDto } from './dto';

@Controller('carts')
export class CartsController {
  @Post('/add')
  async addToCart(@Body() body: AddToCartDto) {}
}
