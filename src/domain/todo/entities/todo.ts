import { AggregateRoot } from '@core/domain-driven-design';
import { Err, match, None, Ok, Option, Result, Some } from '@core/functional-programming';
import { UserId } from '@domain/user';
import { TodoErrors } from '../errors/todo.errors';
import { TodoId } from '../value-objects/id';
import { Title } from '../value-objects/title';

type TodoProps = {
  title: Title;
  description: Option<string>;
  userId: UserId;
  createdAt: Date;
  completedAt: Option<Date>;
};

export class Todo extends AggregateRoot<TodoProps, TodoId> {
  get title(): Title {
    return this.props.title;
  }

  get description(): Option<string> {
    return this.props.description;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get completedAt(): Option<Date> {
    return this.props.completedAt;
  }

  get isCompleted(): boolean {
    return this.completedAt.isSome();
  }

  private constructor(props: TodoProps, id: TodoId) {
    super(props, id);
  }

  static create(props: Omit<TodoProps, 'completedAt' | 'createdAt'>): Todo {
    return new Todo(
      {
        ...props,
        createdAt: new Date(),
        completedAt: None,
      },
      TodoId.generate(),
    );
  }

  static rehydrate(props: TodoProps, id: TodoId): Todo {
    return new Todo(props, id);
  }

  complete(): Result<void, TodoErrors.AlreadyCompletedError> {
    return match.fromOption(this.completedAt, {
      Some: (_) => Err(new TodoErrors.AlreadyCompletedError()),
      None: () => {
        this.props.completedAt = Some(new Date());
        return Ok(undefined as void);
      },
    });
  }
}
