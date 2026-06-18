'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { login } from '../../lib/api/login';

import { AuthPageLayout, AuthShell } from './AuthShell';
import { AuthFormField } from './AuthFormField';
import { PasswordField } from './PasswordField';
import { Icon } from '../ui/Icon';
import { RetroButton } from '../ui/RetroButton';

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormValues>({
    mode: 'onTouched',
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      const redirectTo = searchParams.get('redirectTo');
      router.push(redirectTo || '/dashboard?welcome=1');
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Unable to sign in.'
      });
    }
  };

  return (
    <AuthPageLayout>
      <AuthShell
        footer={
          <p className="text-center text-sm font-semibold text-[#9ca3af]">
            Need an account?{' '}
            <Link className="font-bold text-[#23d97e] hover:underline" href="/signup">
              Sign Up
            </Link>
          </p>
        }
        subtitle="Sign in to continue your quest."
        title="Welcome Back"
      >
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <AuthFormField
            id="email"
            label="Email"
            placeholder="wizard@quest.com"
            autoComplete="email"
            inputMode="email"
            icon={<Icon name="mail" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address.'
              }
            })}
          />

          <PasswordField
            id="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Icon name="lock" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required.',
              minLength: { value: 8, message: 'Password must be at least 8 characters.' }
            })}
          />

          {errors.root?.message ? (
            <p className="rounded border-2 border-[#f87171] bg-[#f87171]/10 px-3 py-2 text-sm text-[#fecaca]">{errors.root.message}</p>
          ) : null}

          <RetroButton
            className="w-full justify-center border-4 border-black bg-[#a78bfa] text-base font-black text-[#1d1a21] shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </RetroButton>
        </form>
      </AuthShell>
    </AuthPageLayout>
  );
}
