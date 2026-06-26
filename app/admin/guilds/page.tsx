import { Suspense } from 'react';

import { AdminGuildsPage } from '../../../components/admin/AdminGuildsPage';

export default function AdminGuildsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminGuildsPage />
    </Suspense>
  );
}
