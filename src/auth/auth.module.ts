import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
