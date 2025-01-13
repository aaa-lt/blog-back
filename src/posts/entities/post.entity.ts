import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column({ default: 'Hello world!' })
  public content: string;

  @Column({ default: 'Hello world!' })
  public previewContent: string;

  @Column({ nullable: true })
  public imageUrl: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public seriesId: number;

  @Column()
  public published: boolean;

  @Column()
  public postPath: string;
}

export default Post;
