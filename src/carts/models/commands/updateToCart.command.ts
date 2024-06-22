import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateToCartCommand {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  public static new(userId: number, productId: number, quantity: number) {
    const tmp = new this();

    tmp.userId = userId;
    tmp.productId = productId;
    tmp.quantity = quantity;

    return tmp;
  }
}
