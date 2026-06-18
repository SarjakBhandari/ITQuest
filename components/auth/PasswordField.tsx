'use client';

import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { AuthFormField } from './AuthFormField';

type PasswordFieldProps = {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  icon?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function PasswordField({ id, label, error, helperText, icon, wrapperClassName, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  const toggleLabel = visible ? 'Hide password' : 'Show password';

  return (
    <AuthFormField
      id={id}
      label={label}
      error={error}
      helperText={helperText}
      icon={icon}
      endAdornment={
        <button
          aria-label={toggleLabel}
          className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-white/60 transition hover:border-white/20 hover:text-white"
          type="button"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
      wrapperClassName={wrapperClassName}
      type={visible ? 'text' : 'password'}
      {...props}
    />
  );
}