'use client';

import { useEffect, useRef, useState } from 'react';

import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../../lib/api/notifications';
import { Icon } from './Icon';

import type { AppNotification } from '../../types/notification';

function timeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function refresh() {
    return listNotifications()
      .then(({ notifications: fetched, unreadCount: count }) => {
        setNotifications(fetched);
        setUnreadCount(count);
      })
      .catch(() => {
        /* notifications are non-critical */
      });
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      /* optimistic update is good enough here */
    }
  };

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) return;

    setIsLoading(true);
    refresh().finally(() => {
      setIsLoading(false);
      // Viewing the panel marks every notification as read, mirroring the badge clearing immediately.
      handleMarkAllRead();
    });
  };

  const handleMarkRead = async (notification: AppNotification) => {
    if (notification.read) return;
    setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationRead(notification.id);
    } catch {
      /* optimistic update is good enough here */
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className="relative rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:scale-110 hover:bg-[#2b2930] active:translate-y-1"
        onClick={toggleOpen}
        type="button"
      >
        <Icon name="notifications" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center border-2 border-black bg-[#f87171] px-1 text-[10px] font-bold text-[#0f0f13]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 border-2 border-black bg-[#1d1a21] shadow-[6px_6px_0px_0px_#000]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="border-b-2 border-[#2a2733] p-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-white">Notifications</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="p-6 text-center text-sm text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500">You&apos;re all caught up.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`flex w-full items-start gap-3 border-b border-[#2a2733] p-3 text-left transition-colors hover:bg-[#2b2930] ${notification.read ? 'opacity-60' : ''}`}
                  onClick={() => handleMarkRead(notification)}
                  type="button"
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-black"
                    style={{ backgroundColor: notification.read ? '#2a2733' : '#a78bfa', color: notification.read ? '#9ca3af' : '#0f0f13' }}
                  >
                    <Icon className="h-4 w-4" name={notification.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-white">{notification.title}</span>
                    <span className="block text-xs leading-relaxed text-gray-400">{notification.body}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-widest text-gray-600">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </span>
                  {!notification.read ? <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#f87171]" /> : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
