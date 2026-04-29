import { Handler as CompleteTodoHandler } from './complete-todo/handler';
import { Handler as CreateTodoHandler } from './create-todo/handler';

export const commands = [CreateTodoHandler, CompleteTodoHandler];

export * as CompleteTodo from './complete-todo';
export * as CreateTodo from './create-todo';
