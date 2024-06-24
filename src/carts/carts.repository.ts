import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type CartItemWrapped = Omit<CartItem, 'cartId'>;

type CartWrapped = Cart & {
  cartItems: CartItemWrapped[];
};

type CartCreate = Omit<
  CartWrapped,
  'id' | 'cartItems' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class CartsRepository {
  constructor(private prisma: PrismaService) {}

  private formattedCart(cart: Cart & { cartItems: CartItem[] }) {
    return {
      ...cart,
      cartItems: cart.cartItems.map<{
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
    console.log(cart.userId);
    const fetchedCart = await this.prisma.cart.create({
      data: cart,
      include: {
        cartItems: true,
      },
    });

    return this.formattedCart(fetchedCart);
  }

  async update(cart: CartWrapped) {
    const { id, cartItems, ...data } = cart;

    data.updatedAt = new Date();

    const updatedCart = await this.prisma.cart.update({
      where: {
        id,
      },
      data: {
        ...data,
        cartItems: {
          deleteMany: {
            productId: {
              notIn: cartItems
                .filter((ci) => ci.productId)
                .map((ci) => ci.productId),
            },
          },
          upsert: cartItems.map((ci) => {
            console.log({
              cartId: id,
              productId: ci.productId,
            });

            return {
              where: {
                cartId_productId: {
                  cartId: id,
                  productId: ci.productId,
                },
                cartId: id,
                productId: ci.productId,
              },

              create: ci,
              update: ci,
            };
          }),
        },
      },
      include: {
        cartItems: true,
      },
    });

    // cartItems: {
    //   upsert: cartItems.map((ci) => ({
    //     create: ci,
    //     update: ci,
    //     where: {
    //       cartId_productId: {
    //         cartId: id,
    //         productId: ci.productId,
    //       },
    //     },
    //   })),
    // },

    return this.formattedCart(updatedCart);

    // ...data,
    // cartItems: {
    //   deleteMany: {
    //     id: {
    //       notIn: cartItems.filter((ci) => ci.id).map((ci) => ci.id),
    //     },
    //   },
    //   upsert: cartItems.map((ci) => ({
    //     where: {
    //       id: ci.id ?? -1,
    //     },
    //     create: ci,
    //     update: ci,
    //   })),
    // },
  }
}
