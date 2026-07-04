'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, LogOut, Settings } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useBalance } from '@/hooks/useBalance';
import { BalanceCard } from '@/components/BalanceCard';
import { pageVariants, buttonTap, listVariants, listItemVariants } from '@/lib/animations';


export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, activeAccount, lock } = useWallet();
  const { balance, loading, refresh } = useBalance();

  const handleLock = () => {
    lock();
    router.replace('/');
  };

  if (!publicKey) return null;

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-wallet-bg px-4 py-6 flex flex-col gap-6 max-w-sm mx-auto"
    >

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-wallet-dim">
            {activeAccount?.name ?? 'Account 1'}
          </span>
          <span className="text-sm font-medium text-wallet-text">
            Kosh
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            {...buttonTap}
            onClick={() => router.push('/settings')}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-wallet-surface border border-wallet-border text-wallet-dim hover:text-wallet-text transition-colors"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          <motion.button
            {...buttonTap}
            onClick={handleLock}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-wallet-surface border border-wallet-border text-wallet-dim hover:text-wallet-danger transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <BalanceCard
        balance={balance}
        publicKey={publicKey}
        loading={loading}
        onRefresh={refresh}
      />

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        <motion.button
          variants={listItemVariants}
          {...buttonTap}
          onClick={() => router.push('/send')}
          className="flex items-center justify-center gap-2 bg-wallet-primary text-white rounded-xl py-3.5 text-sm font-medium"
        >
          <ArrowUp className="w-4 h-4" />
          Send
        </motion.button>

        <motion.button
          variants={listItemVariants}
          {...buttonTap}
          onClick={() => router.push('/receive')}
          className="flex items-center justify-center gap-2 bg-wallet-surface border border-wallet-border text-wallet-lavender rounded-xl py-3.5 text-sm font-medium hover:border-wallet-primary transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
          Receive
        </motion.button>
      </motion.div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-wallet-dim uppercase tracking-wider">
          Recent activity
        </span>

        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          <motion.div
            variants={listItemVariants}
            className="flex items-center justify-center py-12 bg-wallet-surface border border-wallet-border rounded-xl"
          >
            <span className="text-sm text-wallet-dim">
              No transactions yet
            </span>
          </motion.div>
        </motion.div>
      </div>

    </motion.main>
  );
}