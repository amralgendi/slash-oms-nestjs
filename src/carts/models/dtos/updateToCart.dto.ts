import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateToCartDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
