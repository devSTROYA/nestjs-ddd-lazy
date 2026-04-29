import { Err, None, Ok, Some } from '@core/functional-programming';
import { Title, Todo, TodoRepository } from '@domain/todo';
import { UserId } from '@domain/user';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Command, CommandResult } from './command';

@CommandHandler(Command)
export class Handler implements ICommandHandler<Command> {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: Command): Promise<CommandResult> {
    const titleOrError = Title.create(command.title);
    if (titleOrError.isErr()) {
      return Err(titleOrError.error);
    }

    const userId = UserId.rehydrate(command.userId);
    const todo = this.eventPublisher.mergeObjectContext(
      Todo.create({
        title: titleOrError.value,
        description: command.description ? Some(command.description) : None,
        userId,
      }),
    );

    try {
      await this.todoRepository.save(todo);
      todo.commit();
    } catch (err) {
      return Err(err as Error);
    }

    return Ok(undefined);
  }
}
