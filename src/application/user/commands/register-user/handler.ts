import { Err, Ok } from '@core/functional-programming';
import { Email, Name, Password, User, UserRepository } from '@domain/user';
import { UserErrors } from '@domain/user/errors/user.errors';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { Command, CommandResult } from './command';

@CommandHandler(Command)
export class Handler implements ICommandHandler<Command> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: Command): Promise<CommandResult> {
    const nameOrError = Name.create(command.name);
    if (nameOrError.isErr()) {
      return Err(nameOrError.error);
    }

    const emailOrError = Email.create(command.email);
    if (emailOrError.isErr()) {
      return Err(emailOrError.error);
    }

    const passwordOrError = await Password.create(command.password);
    if (passwordOrError.isErr()) {
      return Err(passwordOrError.error);
    }

    const existingUser = await this.userRepository.exists(emailOrError.value);
    if (existingUser) {
      return Err(new UserErrors.EmailAlreadyInUseError());
    }

    const user = this.eventPublisher.mergeObjectContext(
      User.create({
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
      }),
    );

    try {
      await this.userRepository.save(user);
      user.commit();
    } catch (err) {
      return Err(err as Error);
    }

    let accessToken: string;
    try {
      accessToken = await this.jwtService.signAsync({
        sub: user.id.value,
        sid: randomUUID(),
      });
    } catch (error) {
      return Err(error as Error);
    }

    return Ok({ accessToken });
  }
}
