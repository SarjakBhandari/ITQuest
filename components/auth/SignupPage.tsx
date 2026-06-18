'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { requestRegistrationOtp } from '../../lib/api/registration';

import { AuthPageLayout, AuthShell } from './AuthShell';
import { AuthFormField } from './AuthFormField';
import { PasswordField } from './PasswordField';
import { RetroButton } from '../ui/RetroButton';

type SignupFormValues = {
  heroName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 21a8 8 0 1 0-16 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M7 11V8a5 5 0 1 1 10 0v3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M5 11h14v10H5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues
  } = useForm<SignupFormValues>({
    mode: 'onTouched',
    defaultValues: { heroName: '', email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await requestRegistrationOtp({
        heroName: values.heroName,
        email: values.email,
        password: values.password
      });
      sessionStorage.setItem(
        'itquest-pending-signup',
        JSON.stringify({ heroName: values.heroName, email: values.email, password: values.password })
      );
      router.push(`/otp-signup?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Unable to start registration.'
      });
    }
  };

  return (
    <AuthPageLayout>
      <AuthShell
        footer={
          <p className="text-center text-sm font-semibold text-[#9ca3af]">
            Already have an account?{' '}
            <Link className="font-bold text-[#23d97e] hover:underline" href="/login">
              Sign In
            </Link>
          </p>
        }
        subtitle="Every great journey begins with a name."
        title="Create Your Hero"
      >
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <AuthFormField
            id="heroName"
            label="Hero Name"
            placeholder="QuestMaster"
            autoComplete="nickname"
            icon={<UserIcon />}
            error={errors.heroName?.message}
            {...register('heroName', {
              required: 'Hero Name is required.',
              minLength: { value: 3, message: 'Hero Name must be at least 3 characters.' },
              maxLength: { value: 24, message: 'Hero Name must be 24 characters or fewer.' }
            })}
          />

          <AuthFormField
            id="email"
            label="Email"
            placeholder="wizard@quest.com"
            autoComplete="email"
            inputMode="email"
            icon={<MailIcon />}
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
            autoComplete="new-password"
            icon={<LockIcon />}
            helperText="At least 8 characters with a letter."
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required.',
              minLength: { value: 8, message: 'Password must be at least 8 characters.' },
              validate: (value) => /[A-Za-z]/.test(value) || 'Password must include a letter.'
            })}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<LockIcon />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm password is required.',
              validate: (value) => value === getValues('password') || 'Passwords do not match.'
            })}
          />

          {errors.root?.message ? (
            <p className="rounded border-2 border-[#f87171] bg-[#f87171]/10 px-3 py-2 text-sm text-[#fecaca]">{errors.root.message}</p>
          ) : null}

          <RetroButton
            className="w-full justify-center border-4 border-black bg-[#facc15] text-base font-black text-[#0f0f13] shadow-[4px_4px_0px_0px_#78350f] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Sending OTP...' : 'Start Your Quest'}
          </RetroButton>
        </form>
      </AuthShell>
    </AuthPageLayout>
  );
}
