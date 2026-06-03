'use client';

import type { ReactNode } from 'react';

import { AppLogo } from '../../components/ui/AppLogo';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

export function AuthShell({ title, subtitle, children, footer, className }: AuthShellProps) {
  return (
    <div className={`w-full max-w-2xl flex flex-col items-center px-4 py-8 sm:px-6 ${className ?? ''}`.trim()}>
      <div className="w-full rounded-[32px] border-4 border-black bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] shadow-retro-sharp-lg p-4 sm:p-6 backdrop-blur-sm">
        <header className="mb-8 text-center" data-purpose="branding-header">
          <div className="mb-6 flex justify-center">
            <AppLogo className="logo-frame bg-white p-1 rounded-sm" sizeClassName="w-24 h-24 sm:w-32 sm:h-32" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#d3c4ff] mb-2 tracking-tight">{title}</h1>
          <p className="mx-auto max-w-md text-gray-300 text-sm sm:text-base">{subtitle}</p>
        </header>

        <div className="space-y-8">{children}</div>
        {footer}
      </div>
    </div>
  );
}