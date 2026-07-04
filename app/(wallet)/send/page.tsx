'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowUp, Wallet } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useBalance } from '@/hooks/useBalance';
import { sendSOL, isValidPublicKey } from '@/lib/solana';
import { Spinner } from '@/components/ui/Spinner';
import { pageVariants, cardVariants, buttonTap } from '@/lib/animations';


const sendSchema = z.object({
  to: z
    .string()
    .min(1, 'Recipient address is required')
    .refine(isValidPublicKey, { message: 'Invalid Solana address' }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !isNaN(+v) && +v > 0, { message: 'Amount must be greater than 0' }),
});

type SendForm = z.infer<typeof sendSchema>;


export default function SendPage() {
  const router = useRouter();
  const { secretKey, publicKey } = useWallet();
  const { balance, refresh: refreshBalance } = useBalance();
  const [loading, setLoading] = React.useState(false);
  const [txSignature, setTxSignature] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SendForm>({ resolver: zodResolver(sendSchema) });

  const onSubmit = async (data: SendForm) => {
    if (!secretKey) return;
    try {
      setLoading(true);
      const result = await sendSOL(secretKey, data.to, +data.amount);
      setTxSignature(result.signature);
      toast.success('Transaction confirmed');
      refreshBalance();
    } catch {
      toast.error('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-xs text-wallet-dim">Available balance</span>
            <span className="text-lg font-semibold text-wallet-text">
              {balance !== null ? balance.toFixed(4) : '—'}
              <span className="text-sm text-wallet-muted ml-1">SOL</span>
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
            <h1 className="text-2xl font-semibold text-wallet-text">Send SOL</h1>
            <p className="text-sm text-wallet-muted mt-0.5">
              Transfer SOL to any Solana address
            </p>
          </div>

          {txSignature ? (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-4 bg-wallet-surface border border-wallet-border rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-full bg-wallet-success/10 border border-wallet-success/20 flex items-center justify-center">
                <ArrowUp className="w-7 h-7 text-wallet-success" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <h2 className="text-lg font-semibold text-wallet-text">
                  Transaction confirmed
                </h2>
                <p className="text-sm text-wallet-muted">
                  Your SOL has been sent successfully
                </p>
              </div>

              <div className="w-full bg-wallet-card border border-wallet-border rounded-xl p-3 flex flex-col gap-1">
                <span className="text-xs text-wallet-dim">Transaction signature</span>
                <span className="text-xs font-mono text-wallet-lavender break-all">
                  {txSignature}
                </span>
              </div>

              <div className="flex gap-3 w-full">
                <motion.button
                  {...buttonTap}
                  onClick={() => window.open(
                    `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                    '_blank'
                  )}
                  className="flex-1 wallet-btn-ghost text-sm py-2.5"
                >
                  View on Explorer
                </motion.button>
                <motion.button
                  {...buttonTap}
                  onClick={() => {
                    setTxSignature(null);
                    router.push('/dashboard');
                  }}
                  className="flex-1 wallet-btn text-sm py-2.5"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          ) : (

            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 bg-wallet-surface border border-wallet-border rounded-2xl p-6"
            >

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-wallet-text">
                  Recipient address
                </label>
                <input
                  {...register('to')}
                  placeholder="Enter Solana wallet address"
                  spellCheck={false}
                  autoComplete="off"
                  className={`wallet-input font-mono text-sm ${
                    errors.to ? 'border-wallet-danger' : ''
                  }`}
                />
                {errors.to && (
                  <p className="text-xs text-wallet-danger">{errors.to.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-wallet-text">
                    Amount
                  </label>
                  {balance !== null && (
                    <button
                      type="button"
                      onClick={() => setValue('amount', balance.toFixed(4))}
                      className="text-xs text-wallet-primary hover:text-wallet-lavender transition-colors"
                    >
                      Max: {balance.toFixed(4)} SOL
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    {...register('amount')}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    autoComplete="off"
                    onKeyDown={(e) => {
                        if (["-", "+", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    onInput={(e) => {
                        const input = e.currentTarget;
                        let value = input.value.replace(/[^0-9.]/g, "");

                        const parts = value.split(".");
                        if (parts.length > 2) {
                            value = parts[0] + "." + parts.slice(1).join("");
                        }
                        input.value = value;
                    }}
                    className={`wallet-input pr-14 ${
                      errors.amount ? 'border-wallet-danger' : ''
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-wallet-muted">
                    SOL
                  </span>
                </div>
                {errors.amount && (
                  <p className="text-xs text-wallet-danger">{errors.amount.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-wallet-text">From</label>
                <div className="wallet-input text-sm font-mono text-wallet-dim cursor-not-allowed opacity-60">
                  {publicKey}
                </div>
              </div>

              <motion.button
                {...buttonTap}
                type="submit"
                disabled={loading}
                className="wallet-btn flex items-center justify-center gap-2 mt-2"
              >
                {loading
                  ? <Spinner size="sm" />
                  : <><ArrowUp className="w-4 h-4" /> Send SOL</>
                }
              </motion.button>

            </motion.form>
          )}
        </div>
      </main>
    </motion.div>
  );
}