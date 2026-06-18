import type { TaskCategory, TaskPriority } from '../../types/task';

const CATEGORY_WEIGHT: Record<TaskCategory, number> = {
  Class: 1,
  Project: 1.15,
  Certs: 1.3,
  Exam: 1.4,
  Other: 0.9
};

export function calculateQuestXp({ hardness, category, days }: { hardness: number; category: TaskCategory; days: number }) {
  const safeHardness = Math.min(10, Math.max(1, hardness));
  const safeDays = Math.min(30, Math.max(0, days));
  const categoryWeight = CATEGORY_WEIGHT[category] ?? 1;
  const daysFactor = 1 + (safeDays / 30) * 0.5;

  const rawXp = safeHardness * 30 * categoryWeight * daysFactor;
  return Math.min(1000, Math.round(rawXp / 10) * 10);
}

export function derivePriority(hardness: number): TaskPriority {
  const safeHardness = Math.min(10, Math.max(1, hardness));
  if (safeHardness <= 3) return 'Low';
  if (safeHardness <= 7) return 'Medium';
  return 'High';
}

export function hardnessLabel(hardness: number) {
  if (hardness <= 2) return 'Easy';
  if (hardness <= 5) return 'Normal';
  if (hardness <= 8) return 'Hard';
  return 'Epic';
}
