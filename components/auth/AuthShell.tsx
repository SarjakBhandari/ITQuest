'use client';

import type { ReactNode } from 'react';

import { AppLogo } from '../../components/ui/AppLogo';
import { siteConfig } from '../../lib/site-config';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  badge?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer, badge }: AuthShellProps) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-[#b8a4ff]" />
      <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-[#b8a4ff]" />
      <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-[#b8a4ff]" />
      <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-[#b8a4ff]" />

      <section className="relative border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000] sm:p-8">
        <header className="mb-8 text-center">
          <div className="mb-5 inline-flex border-4 border-black bg-[#facc15] p-3">
            {badge ?? <AppLogo alt={`${siteConfig.name} logo`} sizeClassName="h-10 w-10" />}
          </div>
          <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-[#d3c4ff] sm:text-3xl">{title}</h1>
          <p className="text-sm text-[#9ca3af] sm:text-base">{subtitle}</p>
        </header>

        {children}
        {footer ? <div className="mt-8 border-t-2 border-[#2a2733] pt-6">{footer}</div> : null}
      </section>
    </div>
  );
}

export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f0f13] px-4 py-10 text-[#e5e7eb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.15),transparent_32%),radial-gradient(circle_at_bottom,rgba(35,217,126,0.08),transparent_28%)]" />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}
