import type { TaskCategory, TaskPriority, TaskStatus } from './task';

export interface PriorityQuest {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  xp: number;
  dueDate: string | null;
  status: TaskStatus;
}

export interface WorkloadSegment {
  category: TaskCategory;
  pct: number;
}

export interface DashboardSummary {
  heroName: string;
  avatarColor: string | null;
  theme: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
  totalXp: number;
  streak: number;
  freezesAvailable: number;
  overloadPct: number;
  maxActiveQuests: number;
  workload: WorkloadSegment[];
  priorityQuests: PriorityQuest[];
  weeklyXpPotential: number;
}

export interface DashboardSummaryResponse {
  ok: boolean;
  message?: string;
  summary: DashboardSummary;
}
