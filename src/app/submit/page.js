import { Suspense } from 'react';
import SubmitPage from '../components/SubmitPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Loading form...</div>}>
      <SubmitPage />
    </Suspense>
  );
}
