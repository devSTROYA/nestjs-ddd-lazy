import { Err, Ok } from '@core/functional-programming';
import { TodoId, TodoRepository } from '@domain/todo';
import { TodoErrors } from '@domain/todo/errors/todo.errors';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Command, CommandResult } from './command';

@CommandHandler(Command)
export class Handler implements ICommandHandler<Command> {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: Command): Promise<CommandResult> {
    const todoId = TodoId.rehydrate(command.todoId);
    const todoOrError = await this.todoRepository.findById(todoId);
    if (todoOrError.isNone()) {
      return Err(new TodoErrors.TodoDoesNotExistError());
    }

    const todo = this.eventPublisher.mergeObjectContext(todoOrError.value);
    const completeResult = todo.complete();
    if (completeResult.isErr()) {
      return Err(completeResult.error);
    }

    try {
      await this.todoRepository.save(todo);
      todo.commit();
    } catch (err) {
      return Err(err as Error);
    }

    return Ok(undefined);
  }
}
