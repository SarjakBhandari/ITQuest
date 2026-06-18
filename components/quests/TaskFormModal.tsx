'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { RetroButton } from '../ui/RetroButton';

import type { CreateTaskInput, Task, TaskCategory, TaskPriority, TaskStatus } from '../../types/task';

type TaskFormValues = {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  xp: number;
  dueDate: string;
  status: TaskStatus;
};

const categories: TaskCategory[] = ['Class', 'Certs', 'Project', 'Exam', 'Other'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'rest', label: 'Rest' },
  { value: 'done', label: 'Done' }
];

function toDateInputValue(dueDate: string | null) {
  if (!dueDate) return '';
  return new Date(dueDate).toISOString().slice(0, 10);
}

type TaskFormModalProps = {
  task: Task | null;
  defaultStatus: TaskStatus;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
};

export function TaskFormModal({ task, defaultStatus, onClose, onSubmit }: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      category: task?.category ?? 'Class',
      priority: task?.priority ?? 'Low',
      xp: task?.xp ?? 100,
      dueDate: toDateInputValue(task?.dueDate ?? null),
      status: task?.status ?? defaultStatus
    }
  });

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      category: task?.category ?? 'Class',
      priority: task?.priority ?? 'Low',
      xp: task?.xp ?? 100,
      dueDate: toDateInputValue(task?.dueDate ?? null),
      status: task?.status ?? defaultStatus
    });
  }, [task, defaultStatus, reset]);

  useEffect(() => {
    document.getElementById('title')?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const submit = async (values: TaskFormValues) => {
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      priority: values.priority,
      xp: Number(values.xp),
      dueDate: values.dueDate || null,
      status: values.status
    });
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-extrabold text-white">{task ? 'Edit Quest' : 'New Quest'}</h2>

        <form className="space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
              {...register('title', { required: 'Title is required.', maxLength: { value: 120, message: 'Too long.' } })}
            />
            {errors.title ? <p className="mt-1 text-xs text-[#fecaca]">{errors.title.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
              {...register('description', { maxLength: { value: 1000, message: 'Too long.' } })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
                {...register('category')}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
                {...register('priority')}
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="xp">
                XP
              </label>
              <input
                id="xp"
                type="number"
                min={0}
                max={1000}
                className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
                {...register('xp', { required: true, min: 0, max: 1000, valueAsNumber: true })}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
                {...register('dueDate')}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#9ca3af]" htmlFor="status">
              Column
            </label>
            <select
              id="status"
              className="w-full border-2 border-black bg-[#0f0f13] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
              {...register('status')}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <RetroButton
              className="flex-1 justify-center border-4 border-black bg-[#a78bfa] font-black text-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Saving...' : task ? 'Save Changes' : 'Create Quest'}
            </RetroButton>
            <RetroButton
              className="flex-1 justify-center border-4 border-black bg-[#0f0f13] font-black text-white shadow-[4px_4px_0px_0px_#000]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </RetroButton>
          </div>
        </form>
      </div>
    </div>
  );
}
