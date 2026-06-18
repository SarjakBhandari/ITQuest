'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Icon } from '../ui/Icon';
import { calculateQuestXp, hardnessLabel } from '../../lib/quests/xp';

import type { CreateTaskInput, Task, TaskCategory } from '../../types/task';

type TaskFormValues = {
  title: string;
  days: number;
};

const categories: TaskCategory[] = ['Class', 'Project', 'Certs', 'Exam', 'Other'];

function daysUntil(dueDate: string | null) {
  if (!dueDate) return 4;
  const diffDays = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.min(365, Math.max(1, diffDays));
}

type CategoryPillProps = {
  label: TaskCategory;
  active: boolean;
  onClick: () => void;
};

function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      aria-pressed={active}
      className="min-h-[44px] border-2 px-5 py-2.5 text-sm font-bold transition-all"
      onClick={onClick}
      style={{
        backgroundColor: active ? '#a78bfa' : '#2a2733',
        color: active ? '#0f0f13' : '#9ca3af',
        borderColor: active ? '#a78bfa' : '#3f3d46'
      }}
      type="button"
    >
      {label}
    </button>
  );
}

type TaskFormModalProps = {
  task: Task | null;
  defaultStatus: Task['status'];
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
};

export function TaskFormModal({ task, defaultStatus, onClose, onSubmit }: TaskFormModalProps) {
  const [category, setCategory] = useState<TaskCategory>(task?.category ?? 'Class');
  const [hardness, setHardness] = useState<number>(task?.hardness ?? 5);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    mode: 'onTouched',
    defaultValues: {
      title: task?.title ?? '',
      days: daysUntil(task?.dueDate ?? null)
    }
  });

  useEffect(() => {
    reset({ title: task?.title ?? '', days: daysUntil(task?.dueDate ?? null) });
    setCategory(task?.category ?? 'Class');
    setHardness(task?.hardness ?? 5);
  }, [task, reset]);

  useEffect(() => {
    document.getElementById('questName')?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const days = Number(watch('days')) || 1;
  const xp = calculateQuestXp({ hardness, category, days });
  const complexityLabel = hardnessLabel(hardness);

  const submit = async (values: TaskFormValues) => {
    await onSubmit({
      title: values.title.trim(),
      category,
      hardness,
      days: Number(values.days),
      status: task?.status ?? defaultStatus
    });
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      role="dialog"
      style={{ backgroundColor: 'rgba(10,9,15,0.85)' }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-xl" onClick={(event) => event.stopPropagation()}>
        <div aria-hidden="true" className="absolute -top-2 -left-2 h-4 w-4 bg-[#a78bfa]" />
        <div aria-hidden="true" className="absolute -bottom-2 -left-2 h-4 w-4 bg-[#a78bfa]" />
        <div aria-hidden="true" className="absolute -bottom-2 -right-2 h-4 w-4 bg-[#a78bfa]" />

        <button
          aria-label="Close modal"
          className="absolute -right-2 -top-2 z-10 flex h-11 w-11 items-center justify-center border-4 border-black font-extrabold transition-all hover:brightness-110"
          onClick={onClose}
          style={{ backgroundColor: '#f87171', color: '#0f0f13', boxShadow: '3px 3px 0px 0px #7f1d1d' }}
          type="button"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>

        <section aria-labelledby="modal-title" className="border-2 border-[#a78bfa] bg-[#1e1c27] p-8">
          <div className="mb-7">
            <h2 className="mb-1.5 flex items-center gap-2 text-2xl font-extrabold uppercase tracking-tight text-white" id="modal-title">
              <span style={{ color: '#facc15' }}>
                <Icon name="sparkle" className="h-6 w-6" />
              </span>
              {task ? 'Edit Quest' : 'New Quest'}
            </h2>
            <p className="text-sm text-gray-400">Define your objective to gain experience points.</p>
          </div>

          <form className="space-y-7" noValidate onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest" htmlFor="questName" style={{ color: '#23d97e' }}>
                Quest Name
              </label>
              <input
                id="questName"
                className="w-full px-4 py-4 text-base text-gray-300 placeholder-gray-600 transition-colors focus:outline-none"
                placeholder="Enter quest title..."
                style={{
                  backgroundColor: '#2a2733',
                  border: errors.title ? '2px solid #f87171' : '2px solid #3f3d46',
                  minHeight: '56px'
                }}
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'questName-error' : undefined}
                {...register('title', { required: 'Quest name is required — give your quest a title.' })}
              />
              {errors.title ? (
                <p className="mt-0.5 text-xs text-[#f87171]" id="questName-error" role="alert">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest" id="category-label" style={{ color: '#23d97e' }}>
                Category
              </span>
              <div className="flex flex-wrap gap-3" role="group" aria-labelledby="category-label">
                {categories.map((value) => (
                  <CategoryPill key={value} label={value} active={category === value} onClick={() => setCategory(value)} />
                ))}
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex flex-1 flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest" htmlFor="hardness" style={{ color: '#23d97e' }}>
                  Hardness
                </label>
                <div className="relative flex flex-col gap-2">
                  <input
                    id="hardness"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={hardness}
                    onChange={(event) => setHardness(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none outline-none"
                    style={{
                      background: `linear-gradient(to right, #23d97e 0%, #23d97e ${((hardness - 1) / 9) * 100}%, #3f3d46 ${((hardness - 1) / 9) * 100}%, #3f3d46 100%)`
                    }}
                    aria-label={`Hardness: ${complexityLabel}`}
                    aria-valuetext={complexityLabel}
                  />
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest" style={{ color: '#5a5070' }}>
                    <span>Easy</span>
                    <span>Epic</span>
                  </div>
                </div>
              </div>

              <div
                aria-label={`Reward: ${xp} XP`}
                aria-live="polite"
                className="flex w-48 flex-shrink-0 items-center justify-between gap-4 border-2 px-5 py-4"
                style={{ backgroundColor: '#1a1510', borderColor: '#facc15', boxShadow: '3px 3px 0px 0px #78350f' }}
              >
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#facc15' }}>
                    Reward
                  </p>
                  <p className="flex items-center gap-1.5 text-xl font-extrabold text-white">
                    <Icon name="star" filled className="h-5 w-5" style={{ color: '#facc15' }} />
                    {xp} XP
                  </p>
                </div>
                <Icon name="trophy" className="h-6 w-6" style={{ color: '#facc15' }} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex-shrink-0 text-xs font-bold uppercase tracking-widest" htmlFor="deadline" style={{ color: '#23d97e' }}>
                Deadline :
              </label>
              <input
                id="deadline"
                type="number"
                min={1}
                max={365}
                className="w-16 text-center font-bold text-white transition-colors focus:outline-none"
                style={{
                  backgroundColor: '#2a2733',
                  border: errors.days ? '2px solid #f87171' : '2px solid #3f3d46',
                  minHeight: '44px'
                }}
                aria-invalid={errors.days ? 'true' : 'false'}
                aria-describedby={errors.days ? 'deadline-error' : undefined}
                {...register('days', {
                  required: true,
                  valueAsNumber: true,
                  min: { value: 1, message: 'Deadline must be at least 1 day.' },
                  max: { value: 365, message: 'Deadline cannot exceed 365 days.' }
                })}
              />
              <span className="text-sm font-medium text-gray-400">Days</span>
              {errors.days ? (
                <p className="text-xs text-[#f87171]" id="deadline-error" role="alert">
                  {errors.days.message}
                </p>
              ) : null}
            </div>

            <div className="flex gap-4 pt-2">
              <button
                className="flex-[2] border-4 border-black py-4 text-lg font-extrabold uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                style={{ backgroundColor: '#a78bfa', color: '#0f0f13', boxShadow: isSubmitting ? 'none' : '4px 4px 0px 0px #312e81', minHeight: '60px' }}
                type="submit"
              >
                {isSubmitting ? 'Saving…' : 'Save Quest'}
              </button>

              <button
                className="flex-1 border-4 border-black py-4 text-lg font-extrabold uppercase tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                onClick={onClose}
                style={{ backgroundColor: '#2a2733', color: '#e5e7eb', boxShadow: '4px 4px 0px 0px #111', minHeight: '60px' }}
                type="button"
              >
                Discard
              </button>
            </div>
          </form>
        </section>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #23d97e;
          border: 3px solid #000;
          box-shadow: 2px 2px 0px #065f46;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #23d97e;
          border: 3px solid #000;
          box-shadow: 2px 2px 0px #065f46;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
