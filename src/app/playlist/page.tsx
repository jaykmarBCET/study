import { Suspense } from 'react';
import PlaylistClient from './PlaylistClient';

export default function PlaylistPage() {
  return (
    <Suspense fallback={<div className="text-white p-4 flex flex-col">Loading playlist...</div>}>
      <PlaylistClient />
    </Suspense>
  );
}
