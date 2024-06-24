import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderCommand } from './models';
import { OrdersRepository } from './orders.repository';
import { CartsRepository } from 'src/carts/carts.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ProductsRepository } from 'src/products/products.repository';

@Injectable()
export class OrdersService {
  constructor(
    private userRepository: UsersRepository,
    private orderRepository: OrdersRepository,
    private cartRepository: CartsRepository,
    private productRepository: ProductsRepository,
  ) {}
  async createOrder({ userId, address }: CreateOrderCommand) {
    let user = await this.userRepository.getById(userId);

    const cart = await this.cartRepository.getByUserId(userId);

    if (!cart) throw new NotFoundException('Cart of User not Found!');

    console.log('HERE!');

    if (address) {
      user.address = address;

      user = await this.userRepository.update(user);
    }

    if (!user.address) {
      throw new BadRequestException('Address must be given');
    }

    const orderItems: {
      price: number;
      productId: number;
      quantity: number;
    }[] = [];

    for (const cartItem of cart.cartItems) {
      const product = await this.productRepository.getById(cartItem.productId);

      orderItems.push({
        price: product.price,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });
    }

    const order = await this.orderRepository.create({
      address: user.address,
      orderItems,
      userId: user.id,
    });

    cart.cartItems = [];

    await this.cartRepository.update(cart);

    return order;
  }
  // async removeFromCart({ userId, productId }: RemoveFromCartCommand) {
  //   const cart = await this.cartRepository.getByUserId(userId);
  //   if (!cart) throw new NotFoundException('Cart not Found');
  //   const ci = cart.cartItems.find((ci) => ci.productId === productId);
  //   if (!ci) throw new NotFoundException('Product not Found in Cart');
  //   cart.cartItems = cart.cartItems.filter((ci) => ci.productId !== productId);
  //   return await this.cartRepository.update(cart);
  // }
  // async updateToCart({
  //   userId,
  //   productId,
  //   quantity,
  // }: updateOrderStatusCommand) {
  //   const cart = await this.cartRepository.getByUserId(userId);
  //   if (!cart) {
  //     throw new NotFoundException('Cart not Found');
  //   }
  //   const product = await this.productRepository.getById(productId);
  //   if (!product) {
  //     throw new NotFoundException(`Product with Id ${productId} Not Found`);
  //   }
  //   const ci = cart.cartItems.find((ci) => ci.productId === productId);
  //   if (!ci) {
  //     throw new NotFoundException('Product not Found in Cart');
  //   }
  //   ci.quantity = quantity;
  //   console.log('CI', ci);
  //   console.log('CIS', cart.cartItems);
  //   const updatedCart = await this.cartRepository.update(cart);
  //   return updatedCart;
  // }
  // async viewCart({ userId }: ViewCartQuery) {
  //   console.log('VIEW CART');
  //   const cart = await this.cartRepository.getByUserId(userId);
  //   if (!cart) {
  //     throw new NotFoundException('Cart not Found');
  //   }
  //   if (cart.userId !== userId) {
  //     throw new UnauthorizedException();
  //   }
  //   return cart;
  // }
}
