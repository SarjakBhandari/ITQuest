import { Suspense } from 'react';

import { QuestsPage } from '../../components/quests/QuestsPage';

export default function QuestsRoutePage() {
  return (
    <Suspense fallback={null}>
      <QuestsPage />
    </Suspense>
  );
}
