'use client';

import { useEffect, useState } from 'react';

function formatRemaining(endsAt: string) {
  const remainingMs = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const totalMinutes = Math.floor(remainingMs / (60 * 1000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

export function SeasonCountdown({ endsAt }: { endsAt: string }) {
  const [label, setLabel] = useState(() => formatRemaining(endsAt));

  useEffect(() => {
    const interval = setInterval(() => setLabel(formatRemaining(endsAt)), 60 * 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return <>{label}</>;
}
