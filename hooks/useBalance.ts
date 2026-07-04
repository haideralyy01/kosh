'use client';

import * as React from 'react';
import { getBalance } from '@/lib/solana';
import { useWallet } from '@/hooks/useWallet';

const POLL_INTERVAL = 30_000;

export const useBalance = () => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchBalance = React.useCallback(async () => {
        if (!publicKey) return;
        try {
            setLoading(true);
            setError(null);
            const bal = await getBalance(publicKey);
            setBalance(+bal);
        } catch {
            setError('Failed to fetch balance');
        } finally {
            setLoading(false);
        }
    }, [publicKey]);

    React.useEffect(() => {
        if (publicKey) {
            fetchBalance();
        }
    }, [publicKey, fetchBalance]);

    React.useEffect(() => {
        if (!publicKey) return;
        const interval = setInterval(fetchBalance, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [publicKey, fetchBalance]);

    return { balance, loading, error, refresh: fetchBalance };
};