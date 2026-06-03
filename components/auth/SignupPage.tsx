'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { requestRegistrationOtp } from '../../lib/api/registration';
import { signupFields } from '../../lib/site-content';
import { siteConfig } from '../../lib/site-config';

import { AuthShell } from '../../components/auth/AuthShell';
import { Field } from '../../components/ui/Field';
import { RetroButton } from '../../components/ui/RetroButton';

type SignupFormValues = {
  heroName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function ShieldIcon() {
  return (
    <svg className="h-10 w-10 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}

function SwordIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" x2="19" y1="19" y2="13" />
      <line x1="16" x2="20" y1="16" y2="20" />
      <line x1="19" x2="21" y1="21" y2="19" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<SignupFormValues>({
    defaultValues: {
      heroName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', {
        message: 'Passwords do not match.'
      });
      return;
    }

    try {
      await requestRegistrationOtp({
        heroName: values.heroName,
        email: values.email,
        password: values.password
      });

      router.push(`/otp-signup?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Unable to start registration.'
      });
    }
  };

  return (
    <AuthShell
      className="relative w-full max-w-2xl"
      footer={
        <footer className="mt-10 text-center">
          <p className="text-gray-400 font-semibold">
            Already have an account?{' '}
            <Link className="text-[#00c0a3] hover:underline ml-1" href="/login">
              Sign In
            </Link>
          </p>
        </footer>
      }
      subtitle="Every great journey begins with a name."
      title={siteConfig.name}
    >
      <section className="relative w-full max-w-2xl" data-purpose="signup-container">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#a78bfa]" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#a78bfa]" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#a78bfa]" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#a78bfa]" />

        <section className="bg-[#2d2b33] border-4 border-black p-8 md:p-12 shadow-retro-lg">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-[#facc15] border-4 border-black flex items-center justify-center mb-6 shadow-retro">
              <ShieldIcon />
            </div>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-[#a78bfa] mb-2">Create Your Hero</h1>
            <p className="text-gray-400 text-lg">Every great journey begins with a name.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {signupFields.map((field) => (
                <Field
                  key={field.id}
                  className={field.id === 'hero-name' ? 'font-bold placeholder-gray-600' : 'placeholder-gray-600'}
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  {...register(field.id as keyof Omit<SignupFormValues, 'confirmPassword'>, {
                    required: `${field.label} is required.`
                  })}
                />
              ))}

              <Field
                className="placeholder-gray-600"
                id="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required.'
                })}
              />
            </div>

            {errors.root?.message ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
            {errors.confirmPassword?.message ? <p className="text-sm text-red-300">{errors.confirmPassword.message}</p> : null}

            <div className="pt-4">
              <RetroButton className="w-full justify-center bg-[#a78bfa] text-black font-extrabold text-xl sm:text-2xl border-4 border-black shadow-retro hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-purple-400 disabled:opacity-70" disabled={isSubmitting} type="submit">
                <SwordIcon />
                Start Your Quest
              </RetroButton>
            </div>
          </form>

          <div className="flex items-center my-10">
            <div className="flex-grow h-px bg-gray-700" />
            <span className="px-4 text-sm font-bold text-gray-500 uppercase">OR</span>
            <div className="flex-grow h-px bg-gray-700" />
          </div>

          <div className="space-y-4">
            <Link className="w-full bg-[#1e1c24] text-gray-300 font-bold border-4 border-black py-4 shadow-retro flex items-center justify-center gap-3 hover:bg-black transition-all" href="/login">
              <GoogleIcon />
              LOGIN WITH GOOGLE
            </Link>
          </div>
        </section>
      </section>
    </AuthShell>
  );
}