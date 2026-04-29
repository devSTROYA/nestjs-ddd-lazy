import { commands } from '@application/todo/commands';
import { queries } from '@application/todo/queries';
import { TodoRepository } from '@domain/todo';
import { InMemoryTodoRepository } from '@infrastructure/todo';
import { Module } from '@nestjs/common';
import { TodoController } from '@presentation/http/todo';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [
    {
      provide: TodoRepository,
      useClass: InMemoryTodoRepository,
    },
    ...commands,
    ...queries,
  ],
})
export class TodoModule {}
