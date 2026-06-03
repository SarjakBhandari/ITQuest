'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

type FieldProps = {
  label: string;
  icon?: ReactNode;
  wrapperClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, icon, wrapperClassName, id, className, ...props }: FieldProps) {
  return (
    <div className={`space-y-2 ${wrapperClassName ?? ''}`}>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor={id}>
        {label}
      </label>
      <div className="relative retro-input flex items-center px-4 py-3">
        {icon}
        <input
          className={`bg-transparent border-none focus:ring-0 text-white w-full p-0 placeholder-gray-600 ${className ?? ''}`}
          id={id}
          {...props}
        />
      </div>
    </div>
  );
}