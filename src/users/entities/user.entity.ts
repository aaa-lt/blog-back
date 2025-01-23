import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Exclude()
  @Column()
  public password: string;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  public currentRefreshToken?: string | null;
}

export default User;
