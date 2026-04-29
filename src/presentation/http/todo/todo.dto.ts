export class TodoDto {
  id!: string;
  title!: string;
  description!: string | null;
  createdAt!: Date;
  isCompleted!: boolean;
}
