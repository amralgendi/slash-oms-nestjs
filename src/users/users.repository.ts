import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Prisma, Address } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type WrappedUser = User & {
  address?: WrappedAddress;
};

type WrappedAddress = Omit<Address, 'id' | 'userId'>;

type CreateUser = Omit<
  User,
  'id' | 'address' | 'createdAt' | 'updatedAt' | 'name'
>;

@Injectable()
export class UsersRepository {
  private wrapUser(user: User & { address?: Address }): WrappedUser {
    if (user.address) {
      const { userId, id, ...newAddress } = user.address;
      return { ...user, address: newAddress };
    }
    return user;
  }

  constructor(private prisma: PrismaService) {}

  async getByEmail(email: string) {
    console.log({ email });
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        address: true,
      },
    });

    console.log({ user });

    return this.wrapUser(user);
  }

  async getById(id: number) {
    const u = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });

    return this.wrapUser(u);
  }

  async create(user: CreateUser) {
    try {
      const newUser = await this.prisma.user.create({
        data: user,
        include: { address: true },
      });

      return this.wrapUser(newUser);
    } catch (error) {
      throw new ForbiddenException('Email already Exists!');
    }
  }

  async update(user: WrappedUser): Promise<User> {
    user.updatedAt = new Date();

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        address: {
          upsert: {
            where: {
              userId: user.id,
            },
            create: user.address,
            update: user.address,
          },
        },
      },
    });

    return this.wrapUser(updatedUser);
  }

  async delete(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }
}
