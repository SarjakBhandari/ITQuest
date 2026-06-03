import { Suspense } from 'react';

import { OtpVerificationPage } from '../../components/auth/OtpVerificationPage';

export default function OtpSignupRoutePage() {
  return (
    <Suspense fallback={null}>
      <OtpVerificationPage />
    </Suspense>
  );
}