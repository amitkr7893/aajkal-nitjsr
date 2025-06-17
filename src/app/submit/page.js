import { Suspense } from 'react';
import SubmitPage from './submitPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Loading form...</div>}>
      <SubmitPage />
    </Suspense>
  );
}
