'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import '../nprogress.css'

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300); // simulate short delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
