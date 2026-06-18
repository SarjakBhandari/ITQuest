import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import { siteConfig } from '../lib/site-config';
import { ToastProvider } from '../components/ui/ToastProvider';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.tagline
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}