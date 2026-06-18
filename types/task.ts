export type TaskStatus = 'backlog' | 'in-progress' | 'rest' | 'done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Class' | 'Certs' | 'Project' | 'Exam' | 'Other';

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  xp: number;
  dueDate: string | null;
  status: TaskStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  ok: boolean;
  message?: string;
  tasks: Task[];
}

export interface TaskResponse {
  ok: boolean;
  message: string;
  task: Task;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  xp?: number;
  dueDate?: string | null;
  status?: TaskStatus;
}

export type UpdateTaskInput = Partial<CreateTaskInput> & { order?: number };
