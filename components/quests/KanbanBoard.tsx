'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { createTask, deleteTask, listTasks, updateTask } from '../../lib/api/tasks';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { RetroButton } from '../ui/RetroButton';

import { TaskCard } from './TaskCard';
import { TaskFormModal } from './TaskFormModal';

import type { CreateTaskInput, Task, TaskStatus } from '../../types/task';

const columns: { status: TaskStatus; label: string; icon: string; accent: string }[] = [
  { status: 'backlog', label: 'Backlog', icon: 'inventory_2', accent: '#9ca3af' },
  { status: 'in-progress', label: 'In Progress', icon: 'swords', accent: '#a78bfa' },
  { status: 'rest', label: 'Rest', icon: 'bedtime', accent: '#60a5fa' },
  { status: 'done', label: 'Done', icon: 'task_alt', accent: '#45dfa4' }
];

export function KanbanBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState<{ task: Task | null; status: TaskStatus } | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Task | null>(null);
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

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setModalState({ task: null, status: 'backlog' });
      router.replace('/quests');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!deleteCandidate) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDeleteCandidate(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [deleteCandidate]);

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

  async function handleCreateOrUpdate(input: CreateTaskInput) {
    if (modalState?.task) {
      const { task } = await updateTask(modalState.task._id, input);
      setTasks((prev) => prev.map((item) => (item._id === task._id ? task : item)));
    } else {
      const { task } = await createTask(input);
      setTasks((prev) => [...prev, task]);
    }
    setModalState(null);
  }

  async function handleDelete(task: Task) {
    setDeleteCandidate(null);
    setTasks((prev) => prev.filter((item) => item._id !== task._id));
    try {
      await deleteTask(task._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete quest.');
      setTasks((prev) => [...prev, task]);
    }
  }

  async function handleDrop(status: TaskStatus) {
    setDragOverStatus(null);
    if (!draggedTaskId) return;

    const task = tasks.find((item) => item._id === draggedTaskId);
    setDraggedTaskId(null);
    if (!task || task.status === status) return;

    const targetOrder = grouped[status].length;
    const previous = task;
    setTasks((prev) =>
      prev.map((item) => (item._id === task._id ? { ...item, status, order: targetOrder } : item))
    );

    try {
      await updateTask(task._id, { status, order: targetOrder });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to move quest.');
      setTasks((prev) => prev.map((item) => (item._id === previous._id ? previous : item)));
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
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
                  <DashboardIcon name={column.icon} className="h-5 w-5 flex-shrink-0" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: column.accent }}>
                    {column.label}
                  </h3>
                  <span className="ml-auto text-xs font-bold text-[#9ca3af]">{grouped[column.status].length}</span>
                </div>

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
