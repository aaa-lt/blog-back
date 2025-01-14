import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  previewContent?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  seriesId: number;

  @IsBoolean()
  @IsNotEmpty()
  published: boolean;

  @IsString()
  @IsNotEmpty()
  postPath: string;
}
