import { WalletGuard } from '@/components/WalletGuard';
import { Sidebar } from '@/components/Sidebar';

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletGuard>
      <div className="flex min-h-screen bg-wallet-bg">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </WalletGuard>
  );
}