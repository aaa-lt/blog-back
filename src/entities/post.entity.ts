import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column()
  public previewContent: string;
  @Column()
  public imageUrl: string;
  @Column()
  public createdAt: Date;
  @Column()
  public updatedAt: Date;
  @Column()
  public seriesId: number;
  @Column()
  public published: boolean;
  @Column()
  public postPath: string;
}

export default Post;
