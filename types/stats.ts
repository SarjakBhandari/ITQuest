import type { TaskCategory, TaskPriority, TaskStatus } from './task';

export type CategoryStat = {
  category: TaskCategory;
  count: number;
  xp: number;
};

export type WeeklyCompletion = {
  date: string;
  count: number;
};

export type Achievement = {
  id: string;
  label: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  earned: boolean;
};

export type UserStats = {
  heroName: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
  totalXp: number;
  streak: number;
  freezesAvailable: number;
  completedQuestsCount: number;
  statusBreakdown: Record<TaskStatus, number>;
  priorityBreakdown: Record<TaskPriority, number>;
  categoryBreakdown: CategoryStat[];
  bestCategory: CategoryStat | null;
  weeklyCompletions: WeeklyCompletion[];
  achievements: Achievement[];
};

export type StatsResponse = {
  ok: boolean;
  message?: string;
  stats: UserStats;
};
