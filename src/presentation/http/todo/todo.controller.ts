import { CompleteTodo, CreateTodo } from '@application/todo/commands';
import { GetTodos } from '@application/todo/queries';
import { AuthGuard, CurrentUser } from '@common/platform-nestjs';
import { type UserContext } from '@common/types';
import { DomainError, NotFoundError, ValidationError } from '@core/errors';
import { match } from '@core/functional-programming';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddTodoRequest } from './add-todo';
import { CompleteTodoRequest } from './complete-todo';
import { TodoMap } from './todo.map';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getTodosByUser(@CurrentUser() user: UserContext) {
    const query = new GetTodos.Query(user.id);
    const result = await this.queryBus.execute(query);
    return match.fromResult(result, {
      Ok: (todos) => todos.map((todo) => TodoMap.toDto(todo)),
      Err: (error) => {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      },
    });
  }

  @Post()
  async addTodo(@Body() body: AddTodoRequest, @CurrentUser() user: UserContext) {
    const command = new CreateTodo.Command(user.id, body.title, body.description);
    const result = await this.commandBus.execute(command);
    return match.fromResult(result, {
      Ok: (_) => ({}),
      Err: (error) => {
        if (error instanceof ValidationError) {
          throw new HttpException(error.code, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      },
    });
  }

  @Patch(':todoId')
  async completeTodo(@Param() param: CompleteTodoRequest) {
    const command = new CompleteTodo.Command(param.todoId);
    const result = await this.commandBus.execute(command);
    return match.fromResult(result, {
      Ok: (_) => ({}),
      Err: (error) => {
        if (error instanceof ValidationError) {
          throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
        }

        if (error instanceof NotFoundError) {
          throw new HttpException(error.code, HttpStatus.NOT_FOUND);
        }

        if (error instanceof DomainError) {
          throw new HttpException(error.code, HttpStatus.CONFLICT);
        }

        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      },
    });
  }
}
