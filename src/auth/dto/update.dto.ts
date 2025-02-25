import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @IsOptional()
  password?: string;
}
