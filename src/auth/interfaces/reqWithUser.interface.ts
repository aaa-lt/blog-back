import { Request } from 'express';
import User from 'src/users/entities/user.entity';

interface ReqWithUser extends Request {
  user: User;
}

export default ReqWithUser;
