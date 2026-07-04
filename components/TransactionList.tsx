// src/components/TransactionList.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, AlertCircle, ExternalLink } from 'lucide-react';
import { listVariants, listItemVariants } from '@/lib/animations';
import type { Transaction } from '@/hooks/useTransactions';

interface TransactionListProps {
  transactions: Transaction[];
  loading:      boolean;
  error:        string | null;
}

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return '—';
  const date = new Date(timestamp * 1000);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return `Today · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (days === 1) return `Yesterday · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatAmount = (amount: number | null) => {
  if (amount === null) return null;
  return amount.toFixed(4);
};

const shortAddress = (addr: string | null) => {
  if (!addr) return '—';
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
};

export const TransactionList = ({
  transactions,
  loading,
  error,
}: TransactionListProps) => {

  if (loading && transactions.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-wallet-surface border border-wallet-border rounded-xl p-4"
          >
            <div className="w-9 h-9 rounded-full bg-wallet-border animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 w-24 bg-wallet-border rounded animate-pulse" />
              <div className="h-3 w-16 bg-wallet-border/60 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-wallet-border rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-wallet-surface border border-wallet-border rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-wallet-danger shrink-0" />
        <p className="text-sm text-wallet-muted">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-wallet-surface border border-wallet-border rounded-2xl gap-3">
        <div className="w-10 h-10 rounded-xl bg-wallet-card border border-wallet-border flex items-center justify-center">
          <ArrowDown className="w-5 h-5 text-wallet-dim" />
        </div>
        <p className="text-sm text-wallet-muted">No transactions yet</p>
        <p className="text-xs text-wallet-dim">
          Send or receive SOL to get started
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2"
    >
      {transactions.map((tx) => {
        const isSent     = tx.type === 'sent';
        const isReceived = tx.type === 'received';
        const isFailed   = tx.status === 'failed';

        return (
          <motion.div
            key={tx.signature}
            variants={listItemVariants}
            className="flex items-center gap-4 bg-wallet-surface border border-wallet-border hover:border-wallet-muted rounded-xl p-4 transition-colors group"
          >
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center shrink-0
              ${isSent     ? 'bg-wallet-danger/10  border border-wallet-danger/20'  : ''}
              ${isReceived ? 'bg-wallet-success/10 border border-wallet-success/20' : ''}
              ${!isSent && !isReceived ? 'bg-wallet-card border border-wallet-border' : ''}
            `}>
              {isSent     && <ArrowUp   className="w-4 h-4 text-wallet-danger"  />}
              {isReceived && <ArrowDown className="w-4 h-4 text-wallet-success" />}
              {!isSent && !isReceived && (
                <ArrowDown className="w-4 h-4 text-wallet-dim" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-wallet-text capitalize">
                  {isFailed ? 'Failed' : tx.type === 'unknown' ? 'Transaction' : tx.type}
                </span>
                {isFailed && (
                  <span className="text-[10px] bg-wallet-danger/10 text-wallet-danger border border-wallet-danger/20 px-1.5 py-0.5 rounded-full">
                    Failed
                  </span>
                )}
              </div>
              <span className="text-xs text-wallet-dim truncate block">
                {isSent
                  ? `To: ${shortAddress(tx.to)}`
                  : isReceived
                  ? `From: ${shortAddress(tx.from)}`
                  : shortAddress(tx.signature)
                }
              </span>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              {tx.amount !== null && (
                <span className={`text-sm font-medium ${
                  isSent     ? 'text-wallet-danger'  :
                  isReceived ? 'text-wallet-success' :
                  'text-wallet-text'
                }`}>
                  {isSent ? '−' : '+'}{formatAmount(tx.amount)} SOL
                </span>
              )}
              <span className="text-[11px] text-wallet-dim">
                {formatDate(tx.timestamp)}
              </span>
            </div>

            <a
              href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-wallet-dim hover:text-wallet-lavender"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        );
      })}
    </motion.div>
  );
};