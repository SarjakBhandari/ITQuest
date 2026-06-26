import { Suspense } from 'react';

import { AdminAnnouncementsPage } from '../../../components/admin/AdminAnnouncementsPage';

export default function AdminAnnouncementsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminAnnouncementsPage />
    </Suspense>
  );
}
