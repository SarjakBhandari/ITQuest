'use client';

import { useEffect, useState } from 'react';

import { createAdminAnnouncement, listAdminAnnouncements } from '../../lib/api/admin';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/ToastProvider';

import { AdminShell } from './AdminShell';

import type { Announcement } from '../../types/admin';

function timeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AdminAnnouncementsPage() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'all' | 'user'>('all');
  const [targetEmail, setTargetEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  function refresh() {
    setIsLoading(true);
    listAdminAnnouncements()
      .then(({ announcements: fetched }) => setAnnouncements(fetched))
      .catch((err) => showToast(err instanceof Error ? err.message : 'Unable to load announcements.', 'error'))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    setIsSending(true);
    try {
      const { message } = await createAdminAnnouncement({
        title,
        body,
        audience,
        targetEmail: audience === 'user' ? targetEmail : undefined
      });
      showToast(message, 'success');
      setTitle('');
      setBody('');
      setTargetEmail('');
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to send announcement.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminShell title="Announcements">
      <main className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <section className="border-2 border-black bg-[#1e1c24] p-6 shadow-[6px_6px_0px_0px_#000]">
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-white">Broadcast a Message</h3>

          <div className="mb-4 flex gap-3" role="tablist">
            <button
              aria-selected={audience === 'all'}
              className="flex-1 border-2 border-black py-2 text-xs font-bold uppercase tracking-wide"
              onClick={() => setAudience('all')}
              role="tab"
              style={{
                backgroundColor: audience === 'all' ? '#a78bfa' : '#1e1c24',
                color: audience === 'all' ? '#0f0f13' : '#a78bfa'
              }}
              type="button"
            >
              Everyone
            </button>
            <button
              aria-selected={audience === 'user'}
              className="flex-1 border-2 border-black py-2 text-xs font-bold uppercase tracking-wide"
              onClick={() => setAudience('user')}
              role="tab"
              style={{
                backgroundColor: audience === 'user' ? '#23d97e' : '#1e1c24',
                color: audience === 'user' ? '#0f0f13' : '#23d97e'
              }}
              type="button"
            >
              Specific User
            </button>
          </div>

          {audience === 'user' ? (
            <input
              className="mb-3 w-full border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
              onChange={(event) => setTargetEmail(event.target.value)}
              placeholder="user@example.com"
              type="email"
              value={targetEmail}
            />
          ) : null}

          <input
            className="mb-3 w-full border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            value={title}
          />
          <textarea
            className="mb-4 w-full resize-none border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
            maxLength={500}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Message"
            rows={4}
            value={body}
          />

          <button
            className="w-full border-4 border-black bg-[#a78bfa] py-3 text-sm font-extrabold uppercase tracking-wide text-[#0f0f13] shadow-[4px_4px_0px_0px_#000] disabled:opacity-60"
            disabled={isSending || !title.trim() || !body.trim()}
            onClick={submit}
            type="button"
          >
            {isSending ? 'Sending...' : 'Send Announcement'}
          </button>
        </section>

        <section className="border-2 border-black bg-[#1e1c24] p-6 shadow-[6px_6px_0px_0px_#000]">
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-white">Sent History</h3>
          {isLoading ? (
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Icon className="h-4 w-4 animate-spin" name="schedule" />
              Loading...
            </p>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements sent yet.</p>
          ) : (
            <div className="max-h-[480px] space-y-3 overflow-y-auto">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-2 border-[#2a2733] bg-[#141219] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-white">{announcement.title}</p>
                    <span className="flex-shrink-0 text-[10px] uppercase text-gray-600">{timeAgo(announcement.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">{announcement.body}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#a78bfa]">
                    {announcement.audience === 'all' ? 'Everyone' : 'One user'} - {announcement.recipientCount} recipient
                    {announcement.recipientCount === 1 ? '' : 's'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </AdminShell>
  );
}
