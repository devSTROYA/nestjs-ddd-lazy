import { Todo } from '@domain/todo';
import { TodoDto } from './todo.dto';

export class TodoMap {
  static toDto(todo: Todo): TodoDto {
    return {
      id: todo.id.value,
      title: todo.title.value,
      description: todo.description.value,
      createdAt: todo.createdAt,
      isCompleted: todo.isCompleted,
    };
  }
}
