'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { verifyRegistrationOtp } from '../../lib/api/registration';
import { otpDigits } from '../../lib/site-content';
import { siteConfig } from '../../lib/site-config';

import { AppLogo } from '../../components/ui/AppLogo';
import { RetroButton } from '../../components/ui/RetroButton';

type OtpFormValues = {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
};

export function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [message, setMessage] = useState('');
  const fieldNames = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'] as const;

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { isSubmitting }
  } = useForm<OtpFormValues>({
    defaultValues: {
      otp1: otpDigits[0].value,
      otp2: otpDigits[1].value,
      otp3: otpDigits[2].value,
      otp4: otpDigits[3].value,
      otp5: otpDigits[4].value,
      otp6: otpDigits[5].value
    }
  });

  useEffect(() => {
    if (!email) {
      router.replace('/signup');
    }
  }, [email, router]);

  const onSubmit = async (values: OtpFormValues) => {
    const code = fieldNames.map((fieldName) => values[fieldName]).join('');

    try {
      await verifyRegistrationOtp({
        email,
        code
      });

      router.push('/dashboard');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to verify OTP.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#141219] flex items-center justify-center font-sans antialiased p-4 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,164,255,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(69,223,164,0.08),transparent_28%)]" />
      <section className="relative w-full max-w-xl bg-[#2d2a33] border-4 border-black shadow-retro-sharp-lg p-6 sm:p-8 md:p-12" data-purpose="verification-modal">
        <div className="absolute top-0 left-0 w-3 h-3 bg-[#b8a4ff] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#b8a4ff] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#b8a4ff] -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#b8a4ff] translate-x-1/2 translate-y-1/2" />

        <div className="text-center mb-8">
          <div className="inline-block bg-[#c5a000] border-4 border-black p-3 mb-6">
            <AppLogo alt={`${siteConfig.name} logo`} sizeClassName="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#d3c4ff] uppercase tracking-tight mb-2">Enter Your OTP</h1>
          <p className="text-gray-300 text-sm md:text-base">We sent a one-time passcode to your email. Enter it below to continue.</p>
          {email ? <p className="mt-3 text-sm text-gray-300">{email}</p> : null}
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <label className="block text-[#c5a000] font-bold text-xs uppercase tracking-wider" htmlFor={otpDigits[0].id}>
              Enter your OTP
            </label>

            <div className="grid grid-cols-6 gap-2 md:gap-4" data-purpose="otp-slots">
              {fieldNames.map((fieldName, index) => (
                <input
                  key={fieldName}
                  className="w-full aspect-square rounded-none border-4 border-black bg-[#141219] text-center text-2xl font-bold text-white shadow-retro"
                  inputMode="numeric"
                  maxLength={1}
                  defaultValue={otpDigits[index].value}
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
          </div>

          {message ? <p className="text-sm text-red-300">{message}</p> : null}

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <RetroButton className="flex-1 justify-center bg-[#b8a4ff] text-black font-black border-4 border-black shadow-retro-sharp hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:translate-x-0 active:shadow-none disabled:opacity-70" disabled={isSubmitting} type="submit">
              <svg className="h-6 w-6 transform rotate-45" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.37,3.14l-2.51,2.51c-0.29-0.29-0.76-0.29-1.06,0l-1.06,1.06c-0.29,0.29-0.29,0.76,0,1.06l1.06,1.06l-4.59,4.59 c-0.29,0.29-0.29,0.76,0,1.06l1.06,1.06l-2.12,2.12c-0.39,0.39-0.39,1.02,0,1.41l2.12,2.12c0.39,0.39,1.02,0.39,1.41,0l2.12-2.12 l1.06,1.06c0.29,0.29,0.76,0.29,1.06,0l4.59-4.59l1.06,1.06c0.29,0.29,0.76,0.29,1.06,0l1.06-1.06c0.29-0.29,0.29-0.76,0-1.06 l-2.51-2.51l5.3-5.3c0.78-0.78,0.78-2.05,0-2.83l-2.83-2.83C21.42,2.36,20.15,2.36,19.37,3.14z M3,21l1-5l8,8L3,21z" />
              </svg>
              LET&apos;S GO
            </RetroButton>
            <RetroButton className="flex-1 justify-center bg-[#141219] text-white font-black border-4 border-black shadow-retro-sharp hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-0 active:translate-x-0 active:shadow-none" type="button">
              CANCEL
            </RetroButton>
          </div>
        </form>

        <div className="mt-12 text-center text-sm">
          <span className="text-gray-400">Didnt get otp?</span>
          <a className="text-[#4ade80] font-bold ml-1 hover:underline" href={`mailto:${siteConfig.supportEmail}`}>
            Resend
          </a>
        </div>
      </section>
    </main>
  );
}