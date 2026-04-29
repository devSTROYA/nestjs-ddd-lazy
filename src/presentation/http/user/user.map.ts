import { User } from '@domain/user';
import { UserDto } from './get-current-user.dto';

export class UserMap {
  static toDto(user: User): UserDto {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      createdAt: user.createdAt,
    };
  }
}
