import { None, Some } from '@core/functional-programming';
import { Email, Name, Password, User, UserId } from '@domain/user';
import { UserModel } from './user.model';

export class UserMap {
  toDomain(userModel: UserModel): User {
    return User.rehydrate(
      {
        name: Name.rehydrate(userModel.name),
        email: Email.rehydrate(userModel.email),
        password: Password.rehydrate(userModel.password),
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt ? Some(userModel.updatedAt) : None,
      },
      UserId.rehydrate(userModel.id),
    );
  }

  toPersistence(user: User): UserModel {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt.value,
    };
  }
}
