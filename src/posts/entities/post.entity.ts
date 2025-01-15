import { Exclude } from 'class-transformer';
import Series from 'src/series/entities/series.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  public id: string;

  @Column()
  public title: string;

  @Column({ default: 'Hello world!' })
  @Exclude()
  public content: string;

  @Column({ default: 'Hello world!' })
  public previewContent: string;

  @Column({ nullable: true })
  public imageUrl?: string;

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  public updatedAt: Date;

  @Column()
  public seriesPostId: number;

  @Column()
  public published: boolean;

  @Column({ unique: true })
  public path: string;

  @ManyToOne(() => Series, (series) => series.posts)
  public series: Series;
}

export default Post;
