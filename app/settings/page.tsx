import { Suspense } from 'react';

import { SettingsPage } from '../../components/settings/SettingsPage';

export default function SettingsRoutePage() {
  return (
    <Suspense fallback={null}>
      <SettingsPage />
    </Suspense>
  );
}
