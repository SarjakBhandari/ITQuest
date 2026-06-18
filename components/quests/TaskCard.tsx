'use client';

import { Icon } from '../ui/Icon';

import type { Task } from '../../types/task';

const priorityStyles: Record<Task['priority'], { border: string; text: string }> = {
  Low: { border: '#45dfa4', text: '#45dfa4' },
  Medium: { border: '#ffc640', text: '#ffc640' },
  High: { border: '#f87171', text: '#f87171' }
};

function formatDueIn(dueDate: string | null) {
  if (!dueDate) return null;
  const diffMs = new Date(dueDate).getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
}

type TaskCardProps = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onSnooze: () => void;
};

export function TaskCard({ task, onEdit, onDelete, onDragStart, onPause, onResume, onComplete, onSnooze }: TaskCardProps) {
  const priority = priorityStyles[task.priority];
  const dueLabel = formatDueIn(task.dueDate);
  const isDone = task.status === 'done';
  const isOverdue = task.isOverdue && !isDone;

  return (
    <div
      draggable={!isDone}
      onDragStart={isDone ? undefined : onDragStart}
      className={`group flex flex-col gap-3 border-2 p-4 shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] ${
        isDone
          ? 'border-black bg-[#1e1c24] opacity-70 grayscale hover:opacity-100 hover:grayscale-0'
          : isOverdue
            ? 'cursor-grab border-[#f87171] bg-[#2a1518] active:cursor-grabbing'
            : 'cursor-grab border-black bg-[#1e1c24] active:cursor-grabbing'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="border border-[#a78bfa] bg-[#a78bfa]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#a78bfa]">
          {task.category}
        </span>
        <span className="flex items-center gap-1 text-[#facc15]">
          <Icon name="star" filled className="h-3.5 w-3.5" />
          <span className="text-xs font-bold">{task.xp} XP</span>
        </span>
      </div>

      <h4 className="text-sm font-bold leading-tight text-white">{task.title}</h4>
      {task.description ? <p className="text-xs leading-relaxed text-[#9ca3af]">{task.description}</p> : null}

      {isOverdue ? (
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#f87171]">
          <Icon name="warning" className="h-3.5 w-3.5" />
          Overdue
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        {isDone ? (
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#45dfa4]">
            <Icon name="verified" className="h-4 w-4" />
            Completed
          </span>
        ) : (
          <span
            className="border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ borderColor: priority.border, color: priority.text }}
          >
            {task.priority}
          </span>
        )}

        {dueLabel && !isDone ? (
          <span className="flex items-center gap-1 truncate text-[10px] text-[#9ca3af]" title={task.snoozeCount > 0 ? `Snoozed ${task.snoozeCount}x` : undefined}>
            <Icon name="schedule" className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{dueLabel}</span>
            {task.snoozeCount > 0 ? <span className="flex-shrink-0 text-[#60a5fa]">×{task.snoozeCount}</span> : null}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#2a2733] pt-3 opacity-80 transition-opacity group-hover:opacity-100">
        <div className="flex items-center gap-1.5">
          {!isDone && task.status === 'rest' ? (
            <button
              aria-label={`Resume ${task.title}`}
              className="flex h-7 w-7 items-center justify-center border border-black bg-[#45dfa4]/15 text-[#45dfa4] transition-transform hover:scale-110"
              onClick={onResume}
              title="Resume"
              type="button"
            >
              <Icon name="play" className="h-4 w-4" />
            </button>
          ) : null}

          {!isDone && task.status !== 'rest' ? (
            <button
              aria-label={`Pause ${task.title}`}
              className="flex h-7 w-7 items-center justify-center border border-black bg-[#facc15]/15 text-[#facc15] transition-transform hover:scale-110"
              onClick={onPause}
              title="Pause"
              type="button"
            >
              <Icon name="bedtime" className="h-4 w-4" />
            </button>
          ) : null}

          {!isDone && task.status !== 'rest' ? (
            <button
              aria-label={`Snooze ${task.title} by 1 day`}
              className="flex h-7 w-7 items-center justify-center border border-black bg-[#60a5fa]/15 text-[#60a5fa] transition-transform hover:scale-110"
              onClick={onSnooze}
              title="Snooze 1 day (costs XP)"
              type="button"
            >
              <Icon name="schedule" className="h-4 w-4" />
            </button>
          ) : null}

          {!isDone ? (
            <button
              aria-label={`Complete ${task.title}`}
              className="flex h-7 w-7 items-center justify-center border border-black bg-[#23d97e]/15 text-[#23d97e] transition-transform hover:scale-110"
              onClick={onComplete}
              title="Complete"
              type="button"
            >
              <Icon name="task_alt" className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            aria-label={`Edit ${task.title}`}
            className="flex h-7 w-7 items-center justify-center border border-black bg-[#a78bfa]/15 text-[#a78bfa] transition-transform hover:scale-110"
            onClick={onEdit}
            title="Edit"
            type="button"
          >
            <Icon name="edit" className="h-4 w-4" />
          </button>
          <button
            aria-label={`Delete ${task.title}`}
            className="flex h-7 w-7 items-center justify-center border border-black bg-[#f87171]/15 text-[#f87171] transition-transform hover:scale-110"
            onClick={onDelete}
            title="Delete"
            type="button"
          >
            <Icon name="delete" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
