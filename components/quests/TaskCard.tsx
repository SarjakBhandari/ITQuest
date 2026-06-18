'use client';

import { DashboardIcon } from '../dashboard/DashboardIcon';

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
};

export function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const priority = priorityStyles[task.priority];
  const dueLabel = formatDueIn(task.dueDate);
  const isDone = task.status === 'done';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`group flex flex-col gap-3 border-2 border-black bg-[#1e1c24] p-4 shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] ${isDone ? 'opacity-70 grayscale hover:opacity-100 hover:grayscale-0' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="border border-[#a78bfa] bg-[#a78bfa]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#a78bfa]">
          {task.category}
        </span>
        <span className="flex items-center gap-1 text-[#facc15]">
          <DashboardIcon name="star" filled className="h-3.5 w-3.5" />
          <span className="text-xs font-bold">{task.xp} XP</span>
        </span>
      </div>

      <h4 className="text-sm font-bold leading-tight text-white">{task.title}</h4>
      {task.description ? <p className="text-xs leading-relaxed text-[#9ca3af]">{task.description}</p> : null}

      <div className="flex items-center justify-between">
        {isDone ? (
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#45dfa4]">
            <DashboardIcon name="verified" className="h-4 w-4" />
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
          <span className="flex items-center gap-1 text-[10px] text-[#9ca3af]">
            <DashboardIcon name="schedule" className="h-3.5 w-3.5" />
            {dueLabel}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-[#2a2733] pt-2 opacity-70 transition-opacity group-hover:opacity-100">
        <button
          aria-label={`Edit ${task.title}`}
          className="flex items-center gap-1 text-[#a78bfa] hover:underline"
          onClick={onEdit}
          type="button"
        >
          <DashboardIcon name="edit" className="h-4 w-4" />
        </button>
        <button
          aria-label={`Delete ${task.title}`}
          className="flex items-center gap-1 text-[#f87171] hover:underline"
          onClick={onDelete}
          type="button"
        >
          <DashboardIcon name="delete" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
