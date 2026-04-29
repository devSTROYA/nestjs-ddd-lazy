import { None, Some } from '@core/functional-programming';
import { Title, Todo, TodoId } from '@domain/todo';
import { UserId } from '@domain/user';
import { TodoModel } from './todo.model';

export class TodoMap {
  toDomain(todoModel: TodoModel): Todo {
    return Todo.rehydrate(
      {
        title: Title.rehydrate(todoModel.title),
        description: todoModel.description ? Some(todoModel.description) : None,
        userId: UserId.rehydrate(todoModel.userId),
        createdAt: todoModel.createdAt,
        completedAt: todoModel.completedAt ? Some(todoModel.completedAt) : None,
      },
      TodoId.rehydrate(todoModel.id),
    );
  }

  toPersistence(todo: Todo): TodoModel {
    return {
      id: todo.id.value,
      title: todo.title.value,
      description: todo.description.value,
      userId: todo.userId.value,
      createdAt: todo.createdAt,
      completedAt: todo.completedAt.value,
    };
  }
}
