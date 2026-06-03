'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { login } from '../../lib/api/login';
import { loginFields, authProviders } from '../../lib/site-content';
import { siteConfig } from '../../lib/site-config';

import { AuthShell } from '../../components/auth/AuthShell';
import { Field } from '../../components/ui/Field';
import { RetroButton } from '../../components/ui/RetroButton';

type LoginFormValues = {
  email: string;
  password: string;
};

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      router.push('/dashboard');
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Unable to sign in.'
      });
    }
  };

  return (
    <AuthShell
      footer={
        <footer className="mt-8 text-center" data-purpose="footer-links">
          <p className="text-gray-400 font-medium">
            New here?{' '}
            <Link className="text-[#4ade80] underline underline-offset-4 decoration-2 font-bold hover:text-green-300 transition-colors" href="/signup">
              Create Account
            </Link>
          </p>
        </footer>
      }
      subtitle="Ready for your next adventure in code?"
      title={siteConfig.name}
    >
      <section className="w-full retro-border bg-[#1a1622] p-6 sm:p-10 relative" data-purpose="login-form-card">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {loginFields.map((field) => (
            <Field
              key={field.id}
              autoComplete={field.autoComplete}
              className="placeholder-gray-600"
              icon={field.icon === 'mail' ? <EmailIcon /> : <PasswordIcon />}
              id={field.id}
              label={field.label}
              placeholder=""
              type={field.type}
              {...register(field.id as keyof LoginFormValues, {
                required: `${field.label} is required.`
              })}
            />
          ))}

          {errors.root?.message ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}

          <RetroButton className="btn-primary-retro w-full justify-center text-[#1a1622] font-black text-lg sm:text-xl uppercase tracking-tight disabled:opacity-70" disabled={isSubmitting} type="submit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
            Sign In
          </RetroButton>

          <div className="text-right">
            <a className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors" href="#">
              Forgot Password?
            </a>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-800" />
            <span className="flex-shrink mx-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Or Connect With</span>
            <div className="flex-grow border-t border-gray-800" />
          </div>

          {authProviders.map((provider) => (
            <Link key={provider.label} className="btn-social-retro w-full py-4 flex items-center justify-center gap-3 text-gray-300 font-bold text-sm uppercase tracking-widest" href={provider.href ?? '/login'}>
              <GoogleIcon />
              {provider.label}
            </Link>
          ))}
        </form>
      </section>
    </AuthShell>
  );
}