export class CreatePostDto {
  title: string;
  content?: string;
  previewContent?: string;
  imageUrl?: string;
  seriesId: number;
  published: boolean;
  postPath: string;
}
