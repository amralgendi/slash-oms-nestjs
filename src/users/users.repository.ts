import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        address: true,
      },
    });
  }

  async getById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });
  }

  async create(user: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({
        data: user,
        include: { address: true },
      });
    } catch (error) {
      throw new ForbiddenException('Email already Exists!');
    }
  }

  async update(user: Prisma.UserUpdateInput & { id: number }): Promise<User> {
    user.updatedAt = new Date();

    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });
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
