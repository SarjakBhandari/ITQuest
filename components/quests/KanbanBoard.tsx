'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { createTask, deleteTask, listTasks, snoozeTask, updateTask } from '../../lib/api/tasks';
import { Icon } from '../ui/Icon';
import { RetroButton } from '../ui/RetroButton';
import { useToast } from '../ui/ToastProvider';

import { Confetti } from './Confetti';
import { OverloadWarningModal } from './OverloadWarningModal';
import { PauseQuestModal } from './PauseQuestModal';
import { ResumeQuestModal } from './ResumeQuestModal';
import { TaskCard } from './TaskCard';
import { TaskFormModal } from './TaskFormModal';

import type { CreateTaskInput, Task, TaskStatus } from '../../types/task';

const ACTIVE_QUEST_LIMIT = 5;

const columns: { status: TaskStatus; label: string; icon: string; accent: string }[] = [
  { status: 'backlog', label: 'Backlog', icon: 'inventory_2', accent: '#9ca3af' },
  { status: 'in-progress', label: 'In Progress', icon: 'swords', accent: '#a78bfa' },
  { status: 'rest', label: 'Rest', icon: 'bedtime', accent: '#60a5fa' },
  { status: 'done', label: 'Done', icon: 'task_alt', accent: '#45dfa4' }
];

const statusLabel: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  rest: 'Rest',
  done: 'Done'
};

export function KanbanBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState<{ task: Task | null; status: TaskStatus } | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Task | null>(null);
  const [pauseCandidate, setPauseCandidate] = useState<Task | null>(null);
  const [resumeCandidate, setResumeCandidate] = useState<{ task: Task; targetStatus: TaskStatus } | null>(null);
  const [showOverloadWarning, setShowOverloadWarning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { tasks: fetched } = await listTasks();
        if (!cancelled) setTasks(fetched);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load quests.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { backlog: [], 'in-progress': [], rest: [], done: [] };
    for (const task of tasks) {
      map[task.status].push(task);
    }
    for (const status of Object.keys(map) as TaskStatus[]) {
      map[status].sort((a, b) => a.order - b.order);
    }
    return map;
  }, [tasks]);

  const activeQuestCount = grouped['in-progress'].length;
  const isOverloaded = activeQuestCount >= ACTIVE_QUEST_LIMIT;

  useEffect(() => {
    if (searchParams.get('new') !== '1') return;
    router.replace('/quests');
    if (isOverloaded) {
      setShowOverloadWarning(true);
    } else {
      setModalState({ task: null, status: 'backlog' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  async function handleCreateOrUpdate(input: CreateTaskInput) {
    if (modalState?.task) {
      const { task } = await updateTask(modalState.task._id, input);
      setTasks((prev) => prev.map((item) => (item._id === task._id ? task : item)));
      showToast(`"${task.title}" updated.`, 'success');
    } else {
      const { task } = await createTask(input);
      setTasks((prev) => [...prev, task]);
      showToast(`"${task.title}" added to Backlog — worth ${task.xp} XP!`, 'success');
    }
    setModalState(null);
  }

  async function handleDelete(task: Task) {
    setDeleteCandidate(null);
    setTasks((prev) => prev.filter((item) => item._id !== task._id));
    try {
      await deleteTask(task._id);
      showToast(`"${task.title}" deleted.`, 'info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete quest.');
      setTasks((prev) => [...prev, task]);
    }
  }

  async function completeTask(task: Task) {
    try {
      const { task: updated, earlyBonus, bonusXp } = await updateTask(task._id, { status: 'done' });
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      if (earlyBonus) {
        showToast(`Quest complete! +${updated.xp} XP plus a +${bonusXp} early-bird bonus!`, 'success');
      } else {
        showToast(`Quest complete! +${updated.xp} XP banked.`, 'success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete quest.');
    }
  }

  async function handleSnooze(task: Task) {
    try {
      const { task: updated, cutXp } = await snoozeTask(task._id);
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showToast(`"${task.title}" snoozed for 1 more day — -${cutXp} XP.`, 'info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to snooze quest.');
    }
  }

  async function confirmPause(note: string) {
    if (!pauseCandidate) return;
    const task = pauseCandidate;
    try {
      const { task: updated } = await updateTask(task._id, { status: 'rest', note });
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showToast(`"${task.title}" paused — resting until you're ready.`, 'info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to pause quest.');
    } finally {
      setPauseCandidate(null);
    }
  }

  async function confirmResume() {
    if (!resumeCandidate) return;
    const { task, targetStatus } = resumeCandidate;
    try {
      const { task: updated } = await updateTask(task._id, { status: targetStatus });
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showToast(`"${task.title}" resumed — back in action!`, 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resume quest.');
    } finally {
      setResumeCandidate(null);
    }
  }

  async function moveTask(task: Task, status: TaskStatus) {
    const targetOrder = grouped[status].length;
    const previous = task;
    setTasks((prev) => prev.map((item) => (item._id === task._id ? { ...item, status, order: targetOrder } : item)));

    try {
      await updateTask(task._id, { status, order: targetOrder });
      showToast(`"${task.title}" moved to ${statusLabel[status]}.`, 'info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to move quest.');
      setTasks((prev) => prev.map((item) => (item._id === previous._id ? previous : item)));
    }
  }

  async function handleDrop(status: TaskStatus) {
    setDragOverStatus(null);
    if (!draggedTaskId) return;

    const task = tasks.find((item) => item._id === draggedTaskId);
    setDraggedTaskId(null);
    if (!task || task.status === status) return;

    if (task.status === 'done') {
      showToast("Completed quests can't be moved.", 'error');
      return;
    }

    if (status === 'rest') {
      setPauseCandidate(task);
      return;
    }

    if (task.status === 'rest') {
      setResumeCandidate({ task, targetStatus: status });
      return;
    }

    if (status === 'done') {
      await completeTask(task);
      return;
    }

    await moveTask(task, status);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {showConfetti ? <Confetti /> : null}

      {error ? (
        <p className="border-b-2 border-[#f87171] bg-[#f87171]/10 px-6 py-2 text-sm text-[#fecaca]">{error}</p>
      ) : null}

      <section className="flex-1 overflow-x-auto p-6">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading quests...</p>
        ) : (
          <div className="flex h-full min-w-max gap-6">
            {columns.map((column) => (
              <div
                key={column.status}
                className="flex w-80 flex-shrink-0 flex-col gap-4"
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverStatus(column.status);
                }}
                onDragLeave={() => setDragOverStatus((prev) => (prev === column.status ? null : prev))}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(column.status);
                }}
              >
                <div
                  className="flex items-center gap-3 border-2 border-black p-4"
                  style={{ backgroundColor: '#1e1c24', boxShadow: '4px 4px 0px 0px #000' }}
                >
                  <Icon name={column.icon} className="h-5 w-5 flex-shrink-0" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: column.accent }}>
                    {column.label}
                  </h3>
                  <span className="ml-auto text-xs font-bold text-[#9ca3af]">{grouped[column.status].length}</span>
                </div>

                {column.status === 'in-progress' ? (
                  <p className={`text-xs font-bold ${isOverloaded ? 'text-[#f87171]' : 'text-[#6b7280]'}`}>
                    {activeQuestCount} / {ACTIVE_QUEST_LIMIT} active {isOverloaded ? '— overloaded!' : ''}
                  </p>
                ) : null}

                <div
                  className={`flex flex-1 flex-col gap-4 overflow-y-auto rounded-sm p-1 transition-colors ${dragOverStatus === column.status ? 'bg-white/5' : ''}`}
                >
                  {grouped[column.status].length === 0 ? (
                    <div className="flex h-32 items-center justify-center border-2 border-dashed border-[#3f3d46] p-6 text-center">
                      <p className="text-xs italic text-[#6b7280]">No quests here...</p>
                    </div>
                  ) : (
                    grouped[column.status].map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', task._id);
                          setDraggedTaskId(task._id);
                        }}
                        onEdit={() => setModalState({ task, status: task.status })}
                        onDelete={() => setDeleteCandidate(task)}
                        onPause={() => setPauseCandidate(task)}
                        onResume={() => setResumeCandidate({ task, targetStatus: 'in-progress' })}
                        onComplete={() => completeTask(task)}
                        onSnooze={() => handleSnooze(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalState ? (
        <TaskFormModal
          task={modalState.task}
          defaultStatus={modalState.status}
          onClose={() => setModalState(null)}
          onSubmit={handleCreateOrUpdate}
        />
      ) : null}

      {pauseCandidate ? (
        <PauseQuestModal
          questTitle={pauseCandidate.title}
          onClose={() => setPauseCandidate(null)}
          onConfirm={confirmPause}
        />
      ) : null}

      {resumeCandidate ? (
        <ResumeQuestModal
          questTitle={resumeCandidate.task.title}
          note={resumeCandidate.task.note}
          onClose={() => setResumeCandidate(null)}
          onConfirm={confirmResume}
        />
      ) : null}

      {showOverloadWarning ? <OverloadWarningModal onDismiss={() => setShowOverloadWarning(false)} /> : null}

      {deleteCandidate ? (
        <div
          aria-modal="true"
          role="alertdialog"
          aria-labelledby="delete-quest-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            className="w-full max-w-sm border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-quest-title" className="mb-2 text-lg font-extrabold text-white">
              Delete this quest?
            </h2>
            <p className="mb-5 text-sm text-gray-400">
              <span className="font-bold text-white">&ldquo;{deleteCandidate.title}&rdquo;</span> will be permanently
              removed. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <RetroButton
                className="flex-1 justify-center border-4 border-black bg-[#f87171] font-black text-black shadow-[4px_4px_0px_0px_#000]"
                onClick={() => handleDelete(deleteCandidate)}
                type="button"
              >
                Delete
              </RetroButton>
              <RetroButton
                className="flex-1 justify-center border-4 border-black bg-[#0f0f13] font-black text-white shadow-[4px_4px_0px_0px_#000]"
                onClick={() => setDeleteCandidate(null)}
                type="button"
              >
                Cancel
              </RetroButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
