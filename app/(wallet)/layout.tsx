import { WalletGuard } from '@/components/WalletGuard';

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletGuard>
      {children}
    </WalletGuard>
  );
}