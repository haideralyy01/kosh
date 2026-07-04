'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowUp, ArrowDown, LogOut,
  Settings, Wallet, RefreshCw
} from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useBalance } from '@/hooks/useBalance';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  pageVariants,
  buttonTap,
  listVariants,
  listItemVariants,
} from '@/lib/animations';

export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, activeAccount, lock } = useWallet();
  const { balance, loading, refresh: refreshBalance } = useBalance();

  const handleLock = () => {
    lock();
    router.replace('/');
  };

  if (!publicKey) return null;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-wallet-bg flex"
    >

      <aside className="w-60 shrink-0 border-r border-wallet-border flex flex-col justify-between py-6 px-4 glass-strong sticky top-0 h-screen">

        <div className="flex flex-col gap-8">

          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-wallet-primary/20 border border-wallet-primary/30 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-wallet-primary" />
            </div>
            <span className="text-sm font-semibold text-wallet-text">Kosh</span>
          </div>

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
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { label: 'Dashboard', icon: Wallet,    path: '/dashboard', active: true  },
              { label: 'Send',      icon: ArrowUp,   path: '/send',      active: false },
              { label: 'Receive',   icon: ArrowDown, path: '/receive',   active: false },
              { label: 'Settings',  icon: Settings,  path: '/settings',  active: false },
            ].map((item) => (
              <motion.button
                key={item.label}
                {...buttonTap}
                onClick={() => router.push(item.path)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${item.active
                    ? 'bg-wallet-primary/10 text-wallet-primary border border-wallet-primary/20'
                    : 'text-wallet-muted hover:bg-wallet-surface hover:text-wallet-text border border-transparent'
                  }
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </motion.button>
            ))}
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

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-wallet-text">Dashboard</h1>
              <p className="text-sm text-wallet-muted mt-0.5">
                Manage your Solana assets
              </p>
            </div>
            <motion.button
              {...buttonTap}
              onClick={refreshBalance}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-wallet-dim hover:text-wallet-text transition-colors bg-wallet-surface border border-wallet-border px-3 py-2 rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
          </div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-4"
          >

            <motion.div
              variants={listItemVariants}
              className="col-span-2 bg-wallet-surface border border-wallet-border rounded-2xl p-6 flex flex-col gap-2"
            >
              <span className="text-xs text-wallet-dim uppercase tracking-wider">
                Total balance
              </span>
              
              {loading && balance === null ? (
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex items-baseline gap-2">
                    <div className="h-10 w-32 bg-wallet-border rounded-lg animate-pulse" />
                    <div className="h-5 w-10 bg-wallet-border/50 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-24 bg-wallet-border/40 rounded mt-0.5 animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-semibold text-wallet-text tracking-tight">
                      {balance !== null ? balance.toFixed(4) : '—'}
                    </span>
                    <span className="text-lg text-wallet-muted">SOL</span>
                  </div>
                  {balance !== null && (
                    <span className="text-sm text-wallet-muted">
                      ≈ ${(balance * 148).toFixed(2)} USD
                    </span>
                  )}
                </>
              )}
            </motion.div>

            <motion.div
              variants={listItemVariants}
              className="bg-wallet-surface border border-wallet-border rounded-2xl p-6 flex flex-col gap-2"
            >
              <span className="text-xs text-wallet-dim uppercase tracking-wider">
                Network
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-wallet-success animate-pulse" />
                <span className="text-sm font-medium text-wallet-text">Devnet</span>
              </div>
              <span className="text-xs text-wallet-muted">Connected</span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              variants={listItemVariants}
              {...buttonTap}
              onClick={() => router.push('/send')}
              className="flex items-center justify-center gap-2 bg-wallet-primary hover:bg-wallet-primary/90 text-white rounded-xl py-4 text-sm font-medium transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              Send SOL
            </motion.button>

            <motion.button
              variants={listItemVariants}
              {...buttonTap}
              onClick={() => router.push('/receive')}
              className="flex items-center justify-center gap-2 bg-wallet-surface border border-wallet-border hover:border-wallet-primary text-wallet-lavender rounded-xl py-4 text-sm font-medium transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
              Receive SOL
            </motion.button>
          </motion.div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-wallet-text">
                Recent activity
              </span>
              <span className="text-xs text-wallet-dim">
                Last 30 days
              </span>
            </div>

            <motion.div
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center py-16 bg-wallet-surface border border-wallet-border rounded-2xl gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-wallet-card border border-wallet-border flex items-center justify-center">
                <Wallet className="w-5 h-5 text-wallet-dim" />
              </div>
              <p className="text-sm text-wallet-muted">No transactions yet</p>
              <p className="text-xs text-wallet-dim">
                Send or receive SOL to get started
              </p>
            </motion.div>
          </div>

        </div>
      </main>
    </motion.div>
  );
}