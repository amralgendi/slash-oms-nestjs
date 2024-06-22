import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type CartItemWrapped = Omit<CartItem, 'id' | 'cartId'> & {
  id?: number;
};

type CartWrapped = Cart & {
  cartItems: CartItemWrapped[];
};

type CartCreate = Omit<CartWrapped, 'id' | 'cartItems' | 'createdAt'>;

@Injectable()
export class CartsRepository {
  constructor(private prisma: PrismaService) {}

  private formattedCart(cart: Cart & { cartItems: CartItem[] }) {
    return {
      ...cart,
      cartItems: cart.cartItems.map<{
        id?: number;
        productId: number;
        quantity: number;
      }>(({ cartId, ...ci }) => ci),
    };
  }

  async getByUserId(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart) return null;

    return this.formattedCart(cart);
  }

  async create(cart: CartCreate) {
    const fetchedCart = await this.prisma.cart.create({
      data: cart,
      include: {
        cartItems: true,
      },
    });

    return this.formattedCart(fetchedCart);
  }

  async update(cart: CartWrapped) {
    console.log(JSON.stringify(cart, null, 1));
    const { id, cartItems, ...data } = cart;

    return this.formattedCart(
      await this.prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          ...data,
          cartItems: {
            deleteMany: {
              id: {
                notIn: cartItems.filter((ci) => ci.id).map((ci) => ci.id),
              },
            },
            upsert: cartItems.map((ci) => ({
              where: {
                id: ci.id ?? -1,
              },
              create: ci,
              update: ci,
            })),
          },
        },
        include: {
          cartItems: true,
        },
      }),
    );
  }
}
