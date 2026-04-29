import { None, Option, Some } from '@core/functional-programming';
import { Email, User, UserId, UserRepository } from '@domain/user';
import { Injectable } from '@nestjs/common';
import { UserMap } from './user.map';
import { UserModel } from './user.model';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, UserModel> = new Map();
  private userMap = new UserMap();

  constructor() {}

  async exists(email: Email): Promise<boolean> {
    return Array.from(this.users.values()).some((user) => user.email === email.value);
  }

  async findById(id: UserId): Promise<Option<User>> {
    const user = this.users.get(id.value);
    return user ? Some(this.userMap.toDomain(user)) : None;
  }

  async save(user: User): Promise<void> {
    const snapshot = this.userMap.toPersistence(user);
    this.users.set(user.id.value, snapshot);
  }
}
