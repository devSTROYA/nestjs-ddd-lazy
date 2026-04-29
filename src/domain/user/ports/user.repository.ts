import { Repository } from '@core/domain-driven-design';
import { User } from '../entities/user';
import { Email } from '../value-objects/email';

export abstract class UserRepository extends Repository<User> {
  abstract exists(email: Email): Promise<boolean>;
}
