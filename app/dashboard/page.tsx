import { Suspense } from 'react';

import { DashboardPage } from '../../components/dashboard/DashboardPage';

export default function DashboardRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141219]" />}>
      <DashboardPage />
    </Suspense>
  );
}
