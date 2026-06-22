import { Suspense } from 'react';

import { StatsPage } from '../../components/stats/StatsPage';

export default function StatsRoutePage() {
  return (
    <Suspense fallback={null}>
      <StatsPage />
    </Suspense>
  );
}
