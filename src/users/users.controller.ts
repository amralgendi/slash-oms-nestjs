import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getUser(
    @GetUser() tokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.userService.getUser({
      tokenUserId: tokenPayload.sub,
      userId,
      role: '',
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:userId/orders')
  async getUserOrders(
    @GetUser() tokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.userService.getUserOrders({
      tokenUserId: tokenPayload.sub,
      userId,
      role: '',
    });
  }
}
