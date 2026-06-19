import { Suspense } from 'react';

import { GroupsPage } from '../../components/groups/GroupsPage';

export default function GroupsRoutePage() {
  return (
    <Suspense fallback={null}>
      <GroupsPage />
    </Suspense>
  );
}
