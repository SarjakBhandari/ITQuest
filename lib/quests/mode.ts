import type { TaskCategory } from '../../types/task';

export type QuestMode = 'Normal' | 'Certs' | 'Exam';

// Mirrors the backend's dashboard mode filter: each mode narrows the board to
// its matching quest category; Normal leaves the list unfiltered.
export const MODE_CATEGORY_FILTER: Partial<Record<QuestMode, TaskCategory>> = {
  Certs: 'Certs',
  Exam: 'Exam'
};

export const MODE_CONFIG: { label: QuestMode; color: string; shadow: string; icon: string }[] = [
  { label: 'Normal', color: '#23d97e', shadow: '#065f46', icon: 'sparkle' },
  { label: 'Certs', color: '#facc15', shadow: '#78350f', icon: 'shield' },
  { label: 'Exam', color: '#f87171', shadow: '#7f1d1d', icon: 'assignment' }
];
