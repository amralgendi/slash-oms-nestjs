import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { ProductsModule } from './products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    CartsModule,
    OrdersModule,
    CouponsModule,
  ],
})
export class AppModule {}
