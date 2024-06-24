import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveFromCartCommand {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  public static new(userId: number, productId: number) {
    const tmp = new this();

    tmp.userId = userId;
    tmp.productId = productId;

    return tmp;
  }
}
