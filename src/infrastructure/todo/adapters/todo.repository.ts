import { None, Option, Some } from '@core/functional-programming';
import { Todo, TodoId, TodoRepository } from '@domain/todo';
import { UserId } from '@domain/user';
import { Injectable } from '@nestjs/common';
import { TodoMap } from './todo.map';
import { TodoModel } from './todo.model';

@Injectable()
export class InMemoryTodoRepository implements TodoRepository {
  private todos: Map<string, TodoModel> = new Map();
  private todoMap = new TodoMap();

  constructor() {}

  async findAllByUserId(userId: UserId): Promise<Todo[]> {
    return Array.from(this.todos.values())
      .filter((todo) => todo.userId === userId.value)
      .map((todo) => this.todoMap.toDomain(todo));
  }

  async findById(id: TodoId): Promise<Option<Todo>> {
    const todo = this.todos.get(id.value);
    return todo ? Some(this.todoMap.toDomain(todo)) : None;
  }

  async save(todo: Todo): Promise<void> {
    const snapshot = this.todoMap.toPersistence(todo);
    this.todos.set(todo.id.value, snapshot);
  }
}
