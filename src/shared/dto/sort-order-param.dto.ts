import { IsEnum, IsOptional } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class OrderSortParamDto {
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: Order;
}
