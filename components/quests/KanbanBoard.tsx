'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getDashboardSummary } from '../../lib/api/dashboard';
import { getMyGroup } from '../../lib/api/groups';
import {
  createTask,
  deleteTask,
  disableExamMode,
  enableExamMode,
  listTasks,
  snoozeTask,
  sortTasksByPriority,
  updateTask
} from '../../lib/api/tasks';
import { Icon } from '../ui/Icon';
import { RetroButton } from '../ui/RetroButton';
import { useToast } from '../ui/ToastProvider';

import { Confetti } from './Confetti';
import { ModeSelector } from './ModeSelector';
import { OverloadWarningModal } from './OverloadWarningModal';
import { PauseQuestModal } from './PauseQuestModal';
import { QuestCompleteModal } from './QuestCompleteModal';
import { ResumeQuestModal } from './ResumeQuestModal';
import { TaskCard } from './TaskCard';
import { TaskFormModal } from './TaskFormModal';

import { MODE_CATEGORY_FILTER, type QuestMode } from '../../lib/quests/mode';
import type { CreateTaskInput, Task, TaskStatus } from '../../types/task';

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
  const [questCompleteData, setQuestCompleteData] = useState<{
    xpEarned: number;
    bonusXp: number;
    level: number;
    xpIntoLevel: number;
    xpForNextLevel: number;
  } | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const [mode, setMode] = useState<QuestMode>('Normal');
  const [groupRank, setGroupRank] = useState<{ groupName: string; rank: number } | null>(null);
  const [activeQuestLimit, setActiveQuestLimit] = useState(5);
  const [lastTouchedTaskId, setLastTouchedTaskId] = useState<string | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [isTogglingExamMode, setIsTogglingExamMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMyGroup()
      .then(({ group }) => {
        if (cancelled || !group) return;
        const mine = group.leaderboard.find((entry) => entry.isYou);
        if (mine) setGroupRank({ groupName: group.name, rank: mine.rank });
      })
      .catch(() => {
        /* group membership is optional, ignore failures */
      });

    getDashboardSummary()
      .then(({ summary }) => {
        if (!cancelled) setActiveQuestLimit(summary.maxActiveQuests);
      })
      .catch(() => {
        /* fall back to the default limit */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { tasks: fetched, lastTouchedTaskId: touchedId } = await listTasks();
        if (!cancelled) {
          setTasks(fetched);
          setLastTouchedTaskId(touchedId);
        }
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

  const modeCategory = MODE_CATEGORY_FILTER[mode];
  const visibleTasks = useMemo(
    () => (modeCategory ? tasks.filter((task) => task.category === modeCategory) : tasks),
    [tasks, modeCategory]
  );

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { backlog: [], 'in-progress': [], rest: [], done: [] };
    for (const task of visibleTasks) {
      map[task.status].push(task);
    }
    for (const status of Object.keys(map) as TaskStatus[]) {
      map[status].sort((a, b) => a.order - b.order);
    }
    return map;
  }, [visibleTasks]);

  // Overload always reflects the true total workload, regardless of which mode is being viewed.
  const activeQuestCount = useMemo(() => tasks.filter((task) => task.status === 'in-progress').length, [tasks]);
  const isOverloaded = activeQuestCount > activeQuestLimit;

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
      showToast(`"${task.title}" added to Backlog - worth ${task.xp} XP!`, 'success');
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

      const { summary } = await getDashboardSummary();
      setQuestCompleteData({
        xpEarned: updated.xp,
        bonusXp: earlyBonus ? bonusXp ?? 0 : 0,
        level: summary.level,
        xpIntoLevel: summary.xp,
        xpForNextLevel: summary.xpForNextLevel
      });
      window.dispatchEvent(new Event('itquest:xp-updated'));

      if (groupRank) {
        try {
          const { group: updatedGroup } = await getMyGroup();
          const mine = updatedGroup?.leaderboard.find((entry) => entry.isYou);
          if (mine) {
            if (mine.rank < groupRank.rank) {
              showToast(`You climbed to #${mine.rank} in ${updatedGroup!.name}!`, 'success');
            }
            setGroupRank({ groupName: updatedGroup!.name, rank: mine.rank });
          }
        } catch {
          /* group rank check is non-critical */
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete quest.');
    }
  }

  async function handleSnooze(task: Task) {
    try {
      const { task: updated, cutXp } = await snoozeTask(task._id);
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      showToast(`"${task.title}" snoozed for 1 more day - -${cutXp} XP.`, 'info');
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
      showToast(`"${task.title}" paused - resting until you're ready.`, 'info');
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
      showToast(`"${task.title}" resumed - back in action!`, 'success');
      if (targetStatus === 'in-progress' && activeQuestCount + 1 > activeQuestLimit) {
        setShowOverloadWarning(true);
      }
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
      if (status === 'in-progress' && activeQuestCount + 1 > activeQuestLimit) {
        setShowOverloadWarning(true);
      }
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

      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#2a2733] bg-[#15131a] px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-extrabold text-white">Your Quest Board</h2>
          <p className="text-xs text-[#6b7280]">
            {tasks.length} total quest{tasks.length === 1 ? '' : 's'} tracked
          </p>
        </div>
        <ModeSelector compact mode={mode} onChange={setMode} />
      </div>

      <section className="flex-1 overflow-x-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Icon className="h-4 w-4 animate-spin" name="schedule" />
              Loading quests...
            </p>
          </div>
        ) : (
          <div className="flex h-full min-w-max gap-4 sm:gap-6">
            {columns.map((column) => (
              <div
                key={column.status}
                className="flex w-[78vw] max-w-[320px] flex-shrink-0 flex-col gap-4 sm:w-80"
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
                  style={{ backgroundColor: '#1e1c24', boxShadow: '4px 4px 0px 0px #000', borderTop: `4px solid ${column.accent}` }}
                >
                  <Icon name={column.icon} className="h-5 w-5 flex-shrink-0" style={{ color: column.accent }} />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: column.accent }}>
                    {column.label}
                  </h3>
                  <span
                    className="ml-auto flex h-6 min-w-[24px] items-center justify-center border border-black px-1.5 text-xs font-bold"
                    style={{ backgroundColor: column.accent, color: '#0f0f13' }}
                  >
                    {grouped[column.status].length}
                  </span>
                </div>

                {column.status === 'in-progress' ? (
                  <div
                    className={`flex items-center gap-1.5 border-2 px-3 py-1.5 text-xs font-bold ${
                      isOverloaded
                        ? 'border-[#f87171] bg-[#f87171]/10 text-[#f87171]'
                        : 'border-[#2a2733] bg-[#1a1827] text-[#9ca3af]'
                    }`}
                  >
                    <Icon name={isOverloaded ? 'warning' : 'trending_up'} className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {activeQuestCount} / {activeQuestLimit} active {isOverloaded ? '- overloaded!' : ''}
                    </span>
                  </div>
                ) : null}

                <div
                  className={`flex flex-1 flex-col gap-4 overflow-y-auto rounded-sm p-1 transition-colors ${dragOverStatus === column.status ? 'bg-white/5' : ''}`}
                >
                  {grouped[column.status].length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center gap-2 border-2 border-dashed border-[#3f3d46] p-6 text-center">
                      <Icon className="h-6 w-6 opacity-20" name={column.icon} />
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

      {questCompleteData ? (
        <QuestCompleteModal
          xpEarned={questCompleteData.xpEarned}
          bonusXp={questCompleteData.bonusXp}
          level={questCompleteData.level}
          xpIntoLevel={questCompleteData.xpIntoLevel}
          xpForNextLevel={questCompleteData.xpForNextLevel}
          onClose={() => setQuestCompleteData(null)}
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
