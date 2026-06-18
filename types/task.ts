export type TaskStatus = 'backlog' | 'in-progress' | 'rest' | 'done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Class' | 'Certs' | 'Project' | 'Exam' | 'Other';

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  hardness: number;
  xp: number;
  note: string;
  dueDate: string | null;
  status: TaskStatus;
  order: number;
  xpAwarded: boolean;
  pausedAt: string | null;
  snoozeCount: number;
  isOverdue: boolean;
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
  earlyBonus?: boolean;
  bonusXp?: number;
  cutXp?: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category?: TaskCategory;
  hardness: number;
  days: number;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategory;
  hardness?: number;
  days?: number;
  note?: string;
  status?: TaskStatus;
  order?: number;
}
