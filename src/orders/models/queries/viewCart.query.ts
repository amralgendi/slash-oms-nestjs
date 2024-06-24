import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ViewCartQuery {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  tokenId: number;

  public static new(tokenId: number, userId: number) {
    const tmp = new this();

    tmp.userId = userId;
    tmp.tokenId = tokenId;

    return tmp;
  }
}
