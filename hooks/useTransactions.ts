// src/hooks/useTransactions.ts
'use client';

import * as React from 'react';
import { getTransactionHistory } from '@/lib/solana';
import { useWallet } from '@/hooks/useWallet';

export interface Transaction {
  signature: string;
  timestamp:  number | null;
  status:     'confirmed' | 'failed';
  type:       'sent' | 'received' | 'unknown';
  amount:     number | null;
  from:       string | null;
  to:         string | null;
}

const POLL_INTERVAL = 30_000;

export const useTransactions = () => {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading,      setLoading]      = React.useState(false);
  const [error,        setError]        = React.useState<string | null>(null);

  const parseTransactions = React.useCallback(
    (raw: Awaited<ReturnType<typeof getTransactionHistory>>) => {
      return raw.map(({ sig, tx }): Transaction => {
        const signature = sig.signature;
        const timestamp = sig.blockTime ?? null;
        const status    = sig.err ? 'failed' : 'confirmed';

        if (!tx || !publicKey) {
          return { signature, timestamp, status, type: 'unknown', amount: null, from: null, to: null };
        }

        let amount:  number | null = null;
        let from:    string | null = null;
        let to:      string | null = null;
        let type:    'sent' | 'received' | 'unknown' = 'unknown';

        try {
          const instructions = tx.transaction.message.instructions;

          for (const ix of instructions) {
            if (
              'parsed' in ix &&
              ix.parsed?.type === 'transfer' &&
              ix.program === 'system'
            ) {
              from   = ix.parsed.info.source;
              to     = ix.parsed.info.destination;
              amount = ix.parsed.info.lamports / 1_000_000_000;

              type = from === publicKey ? 'sent' : 'received';
              break;
            }
          }
        } catch {
          // non-transfer tx — leave as unknown
        }

        return { signature, timestamp, status, type, amount, from, to };
      });
    },
    [publicKey]
  );

  const fetchTransactions = React.useCallback(async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      setError(null);
      const raw    = await getTransactionHistory(publicKey);
      const parsed = parseTransactions(raw);
      setTransactions(parsed);
    } catch {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [publicKey, parseTransactions]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  React.useEffect(() => {
    if (!publicKey) return;
    const interval = setInterval(fetchTransactions, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [publicKey, fetchTransactions]);

  return { transactions, loading, error, refresh: fetchTransactions };
};