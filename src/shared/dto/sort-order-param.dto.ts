import { IsEnum, IsOptional } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class OrderSortParamDto {
  @IsOptional()
  @IsEnum(Order)
  order?: Order;
}
