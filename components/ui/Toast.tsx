'use client';

import { Icon } from '../ui/Icon';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastData {
  id: string;
  message: string;
  tone: ToastTone;
}

const toneStyles: Record<ToastTone, { border: string; text: string; icon: string }> = {
  success: { border: 'border-[#23d97e]', text: 'text-[#23d97e]', icon: 'verified' },
  error: { border: 'border-[#f87171]', text: 'text-[#fecaca]', icon: 'warning' },
  info: { border: 'border-[#a78bfa]', text: 'text-[#cebdff]', icon: 'notifications' }
};

type ToastProps = {
  toast: ToastData;
  onDismiss: (id: string) => void;
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const style = toneStyles[toast.tone];

  return (
    <div
      className={`toast-enter pointer-events-auto flex items-center gap-3 border-4 ${style.border} bg-[#141219] px-5 py-3 shadow-[4px_4px_0px_0px_#000]`}
      role="status"
    >
      <Icon name={style.icon} className={`h-5 w-5 flex-shrink-0 ${style.text}`} />
      <p className={`text-sm font-bold ${style.text}`}>{toast.message}</p>
      <button
        aria-label="Dismiss notification"
        className="ml-2 flex-shrink-0 text-[#6b7280] transition-colors hover:text-white"
        onClick={() => onDismiss(toast.id)}
        type="button"
      >
        <Icon name="delete" className="h-4 w-4" />
      </button>
    </div>
  );
}
