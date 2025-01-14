import { IsUUID } from 'class-validator';

export class FindOneByUuidDto {
  @IsUUID()
  id: string;
}
