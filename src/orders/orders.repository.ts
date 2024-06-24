import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Order, OrderItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type OrderItemWrapped = Omit<OrderItem, 'orderId'>;

type OrderWrapped = Order & {
  orderItems: OrderItemWrapped[];
};

type OrderCreate = Omit<
  OrderWrapped,
  | 'id'
  | 'createdAt'
  | 'address_country'
  | 'address_city'
  | 'address_street'
  | 'orderStatus'
  | 'updatedAt'
> & {
  address: {
    country: string;
    city: string;
    street: string;
  };
};

@Injectable()
export class OrdersRepository {
  constructor(private prisma: PrismaService) {}

  private formattedOrder({
    address_street,
    address_city,
    address_country,
    ...order
  }: Order & { orderItems: OrderItem[] }) {
    return {
      ...order,
      address: {
        street: address_street,
        city: address_city,
        country: address_country,
      },
      orderItems: order.orderItems.map<{
        productId: number;
        quantity: number;
      }>(({ orderId, ...oi }) => oi),
    };
  }

  async getByUserId(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        orderItems: true,
      },
    });

    return orders.map((o) => this.formattedOrder(o));
  }

  async getById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) return null;

    return this.formattedOrder(order);
  }

  async create({ orderItems, address, ...order }: OrderCreate) {
    const fetchedCart = await this.prisma.order.create({
      data: {
        ...order,
        orderItems: {
          createMany: {
            data: orderItems,
          },
        },
        address_city: address.city,
        address_street: address.street,
        address_country: address.country,
      },
      include: {
        orderItems: true,
      },
    });

    return this.formattedOrder(fetchedCart);
  }

  async update(order: OrderWrapped) {
    const { id, orderItems, ...data } = order;

    data.updatedAt = new Date();

    const updatedCart = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        ...data,
        orderItems: {
          deleteMany: {
            productId: {
              notIn: orderItems
                .filter((ci) => ci.productId)
                .map((ci) => ci.productId),
            },
          },
          upsert: orderItems.map((ci) => {
            console.log({
              cartId: id,
              productId: ci.productId,
            });

            return {
              where: {
                orderId_productId: {
                  orderId: id,
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
        orderItems: true,
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

    return this.formattedOrder(updatedCart);

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
