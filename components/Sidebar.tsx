'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  Settings,
  LogOut,
} from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useBalance } from '@/hooks/useBalance';
import { CopyButton } from '@/components/ui/CopyButton';
import { buttonTap } from '@/lib/animations';

const navItems = [
  { label: 'Dashboard', icon: Wallet,    path: '/dashboard' },
  { label: 'Send',      icon: ArrowUp,   path: '/send'      },
  { label: 'Receive',   icon: ArrowDown, path: '/receive'   },
  { label: 'Settings',  icon: Settings,  path: '/settings'  },
];

export const Sidebar = () => {
  const router   = useRouter();
  const pathname = usePathname();
  const { publicKey, activeAccount, lock } = useWallet();
  const { balance } = useBalance();

  const handleLock = () => {
    lock();
    router.replace('/');
  };

  return (
    <aside className="w-60 shrink-0 border-r border-wallet-border flex flex-col justify-between py-6 px-4 glass-strong sticky top-0 h-screen">

      <div className="flex flex-col gap-8">

        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-wallet-primary/20 border border-wallet-primary/30 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-wallet-primary" />
          </div>
          <span className="text-sm font-semibold text-wallet-text">Kosh</span>
        </div>

        {publicKey && (
          <div className="flex flex-col gap-1 bg-wallet-surface border border-wallet-border rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-wallet-success shrink-0" />
              <span className="text-xs font-medium text-wallet-text truncate">
                {activeAccount?.name ?? 'Account 1'}
              </span>
            </div>
            <span className="text-[11px] text-wallet-dim font-mono truncate px-4">
              {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
            </span>
            <div className="px-4 mt-0.5">
              <CopyButton text={publicKey} label="Address" />
            </div>
            <div className="border-t border-wallet-border mt-2 pt-2 px-0">
              <span className="text-xs text-wallet-dim">Balance</span>
              <p className="text-sm font-semibold text-wallet-text mt-0.5">
                {balance !== null ? balance.toFixed(4) : '—'}
                <span className="text-xs text-wallet-muted ml-1">SOL</span>
              </p>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <motion.button
                key={item.label}
                {...buttonTap}
                onClick={() => router.push(item.path)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-wallet-primary/10 text-wallet-primary border border-wallet-primary/20'
                    : 'text-wallet-muted hover:bg-wallet-surface hover:text-wallet-text border border-transparent'
                  }
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

      </div>

      <motion.button
        {...buttonTap}
        onClick={handleLock}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-wallet-muted hover:text-wallet-danger hover:bg-wallet-danger/10 transition-all border border-transparent"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Lock wallet
      </motion.button>

    </aside>
  );
};