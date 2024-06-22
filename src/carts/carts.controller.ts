import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AddToCartCommand,
  AddToCartDto,
  RemoveFromCartCommand,
  UpdateToCartCommand,
  ViewCartQuery,
} from './models';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/auth.decorator';
import { CartsService } from './carts.service';
import { UpdateToCartDto } from './models/dtos/updateToCart.dto';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @UseGuards(AuthGuard)
  @Post('/add')
  async addToCart(@Body() body: AddToCartDto, @GetUser() { sub }) {
    return await this.cartsService.addToCart(
      AddToCartCommand.new(sub, body.productId, body.quantity),
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/remove')
  async removeFromCart(
    @Query('productId', ParseIntPipe) productId: number,
    @GetUser() { sub },
  ) {
    return await this.cartsService.removeFromCart(
      RemoveFromCartCommand.new(sub, productId),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async viewCart(
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() { sub },
  ) {
    return await this.cartsService.viewCart(ViewCartQuery.new(sub, userId));
  }

  @UseGuards(AuthGuard)
  @Put('/update')
  async updateToCart(
    @Body() { productId, quantity }: UpdateToCartDto,
    @GetUser() { sub },
  ) {
    return await this.cartsService.updateToCart(
      UpdateToCartCommand.new(sub, productId, quantity),
    );
  }
}
