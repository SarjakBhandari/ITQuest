'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

type AuthFormFieldProps = {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  wrapperClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthFormField({
  id,
  label,
  error,
  helperText,
  icon,
  endAdornment,
  wrapperClassName,
  className,
  ...props
}: AuthFormFieldProps) {
  const describedBy = [helperText ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-2 ${wrapperClassName ?? ''}`}>
      <label className="block text-xs font-black uppercase tracking-[0.3em] text-white/70" htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex items-center gap-3 border-2 bg-[#141219] px-4 py-3 ${error ? 'border-[#f87171]' : 'border-[#2a2733] focus-within:border-[#a78bfa]'}`}
      >
        {icon ? <span className="shrink-0 text-white/60">{icon}</span> : null}
        <input
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`w-full border-none bg-transparent p-0 text-white outline-none placeholder:text-white/30 focus:ring-0 ${className ?? ''}`}
          id={id}
          {...props}
        />
        {endAdornment ? <span className="shrink-0">{endAdornment}</span> : null}
      </div>
      {helperText ? (
        <p id={`${id}-help`} className="text-xs text-white/45">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}