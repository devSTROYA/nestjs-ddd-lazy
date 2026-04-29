export type TodoModel = {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  completedAt: Date | null;
};
