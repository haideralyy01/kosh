'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Wallet, Download } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useBalance } from '@/hooks/useBalance';
import { CopyButton } from '@/components/ui/CopyButton';
import { pageVariants, cardVariants, buttonTap } from '@/lib/animations';

export default function ReceivePage() {
  const router = useRouter();
  const { publicKey, activeAccount } = useWallet();
  const { balance } = useBalance();

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
            <span className="text-xs text-wallet-dim">Account</span>
            <span className="text-sm font-medium text-wallet-text">
              {activeAccount?.name ?? 'Account 1'}
            </span>
            <span className="text-xs text-wallet-dim mt-1">Balance</span>
            <span className="text-sm font-semibold text-wallet-text">
              {balance !== null ? balance.toFixed(4) : '—'}
              <span className="text-xs text-wallet-muted ml-1">SOL</span>
            </span>
          </div>

        </div>

        <motion.button
          {...buttonTap}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-wallet-muted hover:text-wallet-text hover:bg-wallet-surface transition-all border border-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </motion.button>
      </aside>

      <main className="flex-1 p-8 flex items-start justify-center">
        <div className="w-full max-w-lg flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-semibold text-wallet-text">
              Receive SOL
            </h1>
            <p className="text-sm text-wallet-muted mt-0.5">
              Share your address to receive SOL
            </p>
          </div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6 bg-wallet-surface border border-wallet-border rounded-2xl p-8"
          >

            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG
                value={publicKey}
                size={180}
                bgColor="#ffffff"
                fgColor="#13111C"
                level="M"
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-wallet-text">
                {activeAccount?.name ?? 'Account 1'}
              </span>
              <span className="text-xs text-wallet-muted">
                Solana · Devnet
              </span>
            </div>

            <div className="w-full flex flex-col gap-2">
              <span className="text-xs text-wallet-dim">Wallet address</span>
              <div className="w-full bg-wallet-card border border-wallet-border rounded-xl p-3 flex items-center justify-between gap-3">
                <span className="text-sm font-mono text-wallet-lavender break-all leading-relaxed">
                  {publicKey}
                </span>
                <CopyButton
                  text={publicKey}
                  label="Address"
                  className="shrink-0"
                />
              </div>
            </div>

            <div className="w-full flex items-start gap-2 bg-wallet-primary/5 border border-wallet-primary/20 rounded-xl p-3">
              <span className="text-xs text-wallet-muted leading-relaxed">
                Only send <span className="text-wallet-lavender font-medium">SOL</span> and
                Solana tokens to this address. Sending other assets may result in permanent loss.
              </span>
            </div>

          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}