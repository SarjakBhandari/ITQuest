import { Suspense } from 'react';

import { AdminOverviewPage } from '../../components/admin/AdminOverviewPage';

export default function AdminRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminOverviewPage />
    </Suspense>
  );
}
