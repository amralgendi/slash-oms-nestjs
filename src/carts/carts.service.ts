import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AddToCartCommand,
  RemoveFromCartCommand,
  UpdateToCartCommand,
  ViewCartQuery,
} from './models';
import { ProductsRepository } from 'src/products/products.repository';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(
    private productRepository: ProductsRepository,
    private cartRepository: CartsRepository,
  ) {}

  async addToCart({ userId, productId, quantity }: AddToCartCommand) {
    const cart =
      (await this.cartRepository.getByUserId(userId)) ??
      (await this.cartRepository.create({ userId }));

    console.log(JSON.stringify(cart.cartItems.map((ci) => ci.productId)));

    const product = await this.productRepository.getById(productId);

    if (!product) {
      throw new NotFoundException(`Product with Id ${productId} Not Found`);
    }

    if (cart.cartItems.find((ci) => ci.productId === productId)) {
      throw new ForbiddenException('Product already exists in Cart');
    }

    cart.cartItems.push({
      quantity,
      productId: product.id,
    });

    const updatedCart = await this.cartRepository.update(cart);

    return updatedCart;
  }

  async removeFromCart({ userId, productId }: RemoveFromCartCommand) {
    const cart = await this.cartRepository.getByUserId(userId);

    if (!cart) throw new NotFoundException('Cart not Found');

    const ci = cart.cartItems.find((ci) => ci.productId === productId);

    if (!ci) throw new NotFoundException('Product not Found in Cart');

    cart.cartItems = cart.cartItems.filter((ci) => ci.productId !== productId);

    return await this.cartRepository.update(cart);
  }

  async updateToCart({ userId, productId, quantity }: UpdateToCartCommand) {
    const cart = await this.cartRepository.getByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not Found');
    }

    const product = await this.productRepository.getById(productId);

    if (!product) {
      throw new NotFoundException(`Product with Id ${productId} Not Found`);
    }

    const ci = cart.cartItems.find((ci) => ci.productId === productId);

    if (!ci) {
      throw new NotFoundException('Product not Found in Cart');
    }

    ci.quantity = quantity;

    console.log('CI', ci);
    console.log('CIS', cart.cartItems);

    const updatedCart = await this.cartRepository.update(cart);

    return updatedCart;
  }

  async viewCart({ userId }: ViewCartQuery) {
    console.log('VIEW CART');
    const cart = await this.cartRepository.getByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not Found');
    }

    if (cart.userId !== userId) {
      throw new UnauthorizedException();
    }

    return cart;
  }
}
