import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export type GetUserOrdersQuery = {
  tokenUserId: number;
  role: string;
  userId: number;
};
