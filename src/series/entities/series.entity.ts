import Post from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Series {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column({ default: 'Hello world!' })
  public description: string;

  @Column({ nullable: true })
  public imageUrl?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ unique: true })
  public path: string;

  @OneToMany(() => Post, (post) => post.series)
  public posts: Post[];
}

export default Series;
