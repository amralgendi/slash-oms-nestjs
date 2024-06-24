import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from 'src/users/models';

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
