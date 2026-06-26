import { Suspense } from 'react';

import { AdminUsersPage } from '../../../components/admin/AdminUsersPage';

export default function AdminUsersRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminUsersPage />
    </Suspense>
  );
}
