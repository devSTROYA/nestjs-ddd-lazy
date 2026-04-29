import { AggregateRoot } from '@core/domain-driven-design';
import { None, Option } from '@core/functional-programming';
import { Email } from '../value-objects/email';
import { UserId } from '../value-objects/id';
import { Name } from '../value-objects/name';
import { Password } from '../value-objects/password';

type UserProps = {
  name: Name;
  email: Email;
  password: Password;
  createdAt: Date;
  updatedAt: Option<Date>;
};

export class User extends AggregateRoot<UserProps, UserId> {
  get name(): Name {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Option<Date> {
    return this.props.updatedAt;
  }

  private constructor(props: UserProps, id: UserId) {
    super(props, id);
  }

  static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>): User {
    return new User(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: None,
      },
      UserId.generate(),
    );
  }

  static rehydrate(props: UserProps, id: UserId): User {
    return new User(props, id);
  }
}
