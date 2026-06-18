'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '../../lib/api/login';
import { requestRegistrationOtp, verifyRegistrationOtp } from '../../lib/api/registration';

import { AuthPageLayout, AuthShell } from './AuthShell';
import { RetroButton } from '../ui/RetroButton';
import { useToast } from '../ui/ToastProvider';

type OtpFormValues = {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
};

const fieldNames = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'] as const;

export function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const email = searchParams.get('email') ?? '';
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { isSubmitting }
  } = useForm<OtpFormValues>({
    defaultValues: { otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' }
  });

  useEffect(() => {
    if (!email) {
      router.replace('/signup');
    }
  }, [email, router]);

  const onSubmit = async (values: OtpFormValues) => {
    const code = fieldNames.map((fieldName) => values[fieldName]).join('');

    if (code.length !== 6) {
      setMessage('Enter the full 6-digit code.');
      return;
    }

    setMessage('');
    try {
      await verifyRegistrationOtp({ email, code });

      const pending = sessionStorage.getItem('itquest-pending-signup');
      const password = pending ? (JSON.parse(pending) as { password?: string }).password : undefined;

      if (password) {
        await login({ email, password });
        sessionStorage.removeItem('itquest-pending-signup');
        router.push('/dashboard?welcome=1');
      } else {
        showToast('Account created! Please sign in.', 'success');
        router.push('/login');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to verify OTP.');
    }
  };

  const handleResend = async () => {
    const pending = sessionStorage.getItem('itquest-pending-signup');
    if (!pending) {
      setMessage('Go back to signup to request a new code.');
      return;
    }

    setResending(true);
    setMessage('');
    try {
      const payload = JSON.parse(pending) as { heroName: string; email: string; password: string };
      await requestRegistrationOtp(payload);
      setMessage('A new OTP was sent. Check your email or the server console.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthShell subtitle="We sent a 6-digit code to your email." title="Verify OTP">
        {email ? <p className="-mt-4 mb-6 text-center text-sm font-semibold text-[#23d97e]">{email}</p> : null}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {fieldNames.map((fieldName, index) => (
              <input
                key={fieldName}
                aria-label={`OTP digit ${index + 1}`}
                className="aspect-square w-full border-4 border-black bg-[#0f0f13] text-center text-xl font-black text-white shadow-[3px_3px_0px_0px_#000] focus:border-[#a78bfa] focus:outline-none sm:text-2xl"
                inputMode="numeric"
                maxLength={1}
                {...register(fieldName, {
                  required: true,
                  onChange: (event) => {
                    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 1);
                    setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
                    if (value && index < fieldNames.length - 1) {
                      setFocus(fieldNames[index + 1]);
                    }
                  }
                })}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && !event.currentTarget.value && index > 0) {
                    setFocus(fieldNames[index - 1]);
                  }
                }}
                type="text"
              />
            ))}
          </div>

          {message ? (
            <p className={`text-sm ${message.includes('sent') ? 'text-[#23d97e]' : 'text-[#fecaca]'}`}>{message}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <RetroButton
              className="flex-1 justify-center border-4 border-black bg-[#a78bfa] font-black text-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Verifying...' : "Let's Go"}
            </RetroButton>
            <RetroButton
              className="flex-1 justify-center border-4 border-black bg-[#0f0f13] font-black text-white shadow-[4px_4px_0px_0px_#000]"
              onClick={() => router.push('/signup')}
              type="button"
            >
              Cancel
            </RetroButton>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-[#9ca3af]">
          Didn&apos;t get the code?{' '}
          <button className="font-bold text-[#23d97e] hover:underline disabled:opacity-60" disabled={resending} onClick={handleResend} type="button">
            {resending ? 'Sending...' : 'Resend'}
          </button>
          {' · '}
          <Link className="font-bold text-[#a78bfa] hover:underline" href="/signup">
            Back to signup
          </Link>
        </div>
      </AuthShell>
    </AuthPageLayout>
  );
}
