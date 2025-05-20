'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthClientWrapper({
  children,
  token,
}: {
  children: React.ReactNode;
  token?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (token && !pathname.startsWith('/auth/verify-email')) {
      router.replace('/dashboard');
    }
  }, []);

  return <>{children}</>;
}