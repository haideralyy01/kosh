'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

import { useWallet } from '@/hooks/useWallet';
import { CopyButton } from '@/components/ui/CopyButton';
import { pageVariants, cardVariants } from '@/lib/animations';

export default function ReceivePage() {
  const { publicKey, activeAccount } = useWallet();

  if (!publicKey) return null;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8"
    >
      <div className="max-w-lg mx-auto flex flex-col gap-6">

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
    </motion.div>
  );
}