// src/components/BalanceCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { numberPopVariants, buttonTap } from '@/lib/animations';
import { Spinner } from '@/components/ui/Spinner';
import { CopyButton } from '@/components/ui/CopyButton';

const SOL_PRICE_USD = 148;

interface BalanceCardProps {
  balance:   number | null;
  publicKey: string;
  loading:   boolean;
  onRefresh: () => void;
}

export const BalanceCard = ({
  balance,
  publicKey,
  loading,
  onRefresh,
}: BalanceCardProps) => {
  const usd = balance !== null ? (balance * SOL_PRICE_USD).toFixed(2) : null;
  const short = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;

  return (
    <div className="w-full bg-wallet-surface border border-wallet-border rounded-2xl p-6 flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-wallet-success" />
          <span className="text-xs text-wallet-muted font-mono">{short}</span>
          <CopyButton text={publicKey} label="Address" />
        </div>

        <motion.button
          {...buttonTap}
          onClick={onRefresh}
          disabled={loading}
          className="text-wallet-dim hover:text-wallet-muted transition-colors"
          aria-label="Refresh balance"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-1 py-2">
        <AnimatePresence mode="wait">
          {loading && balance === null ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Spinner size="md" />
            </motion.div>
          ) : (
            <motion.div
              key={balance}
              variants={numberPopVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-1"
            >
              <span className="text-4xl font-semibold text-wallet-text tracking-tight">
                {balance !== null ? balance.toFixed(4) : '—'}
                <span className="text-xl text-wallet-muted ml-2">SOL</span>
              </span>
              {usd && (
                <span className="text-sm text-wallet-muted">
                  ≈ ${usd} USD
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};