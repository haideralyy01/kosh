'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { FullScreenSpinner } from '@/components/ui/Spinner';

interface WalletGuardProps {
  children: React.ReactNode;
}

export const WalletGuard = ({ children }: WalletGuardProps) => {
  const router = useRouter();
  const { status, initialize } = useWallet();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    initialize();
    setChecking(false);
  }, [initialize]);

  React.useEffect(() => {
    if (checking) return;

    if (status === 'uninitialized') {
      router.replace('/');
    }

    if (status === 'locked') {
      router.replace('/');
    }
  }, [status, checking, router]);

  if (checking) return <FullScreenSpinner />;

  if (status !== 'unlocked') return <FullScreenSpinner />;

  return <>{children}</>;
};