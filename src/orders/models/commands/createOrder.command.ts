import { AddressDto } from 'src/users/models';

export type CreateOrderCommand = {
  userId: number;
  address?: AddressDto;
};
