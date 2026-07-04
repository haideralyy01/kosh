// src/app/(auth)/create/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { MnemonicGrid } from '@/components/MnemonicGrid';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Spinner } from '@/components/ui/Spinner';
import {
  pageVariants,
  cardVariants,
  buttonTap,
  slideUpVariants,
} from '@/lib/animations';

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

type Step = 1 | 2 | 3;

export default function CreatePage() {
  const router   = useRouter();
  const { createWallet } = useWallet();

  const [step,      setStep]      = React.useState<Step>(1);
  const [wordCount, setWordCount] = React.useState<12 | 24>(12);
  const [mnemonic,  setMnemonic]  = React.useState('');
  const [revealed,  setRevealed]  = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const [loading,   setLoading]   = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });


  const handleGenerate = async () => {
    try {
      setLoading(true);
      const { generateMnemonic } = await import('@/utils/wallet');
      const phrase = generateMnemonic(wordCount);
      setMnemonic(phrase);
      setRevealed(false);
      setConfirmed(false);
      setStep(2);
    } catch {
      toast.error('Failed to generate wallet');
    } finally {
      setLoading(false);
    }
  };


  const onSubmit = async (data: PasswordForm) => {
    try {
      setLoading(true);
      await createWallet(mnemonic, data.password);
      toast.success('Wallet created successfully');
      router.replace('/dashboard');
    } catch {
      toast.error('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-wallet-bg flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-sm flex flex-col gap-6">

        <motion.button
          {...buttonTap}
          onClick={() => step === 1 ? router.push('/') : setStep((s) => (s - 1) as Step)}
          className="flex items-center gap-1.5 text-sm text-wallet-dim hover:text-wallet-text transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <div className="flex items-center gap-2">
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                s <= step
                  ? 'bg-wallet-primary'
                  : 'bg-wallet-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div
              key="step1"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-wallet-text">
                  Create wallet
                </h1>
                <p className="text-sm text-wallet-muted">
                  Choose your secret recovery phrase length
                </p>
              </div>

              <div className="flex gap-3">
                {([12, 24] as const).map((count) => (
                  <motion.button
                    key={count}
                    {...buttonTap}
                    onClick={() => setWordCount(count)}
                    className={`
                      flex-1 flex flex-col items-center gap-1 py-4 rounded-xl border transition-all duration-200
                      ${wordCount === count
                        ? 'bg-wallet-primary/10 border-wallet-primary text-wallet-primary'
                        : 'bg-wallet-surface border-wallet-border text-wallet-muted hover:border-wallet-muted'
                      }
                    `}
                  >
                    <span className="text-2xl font-semibold">{count}</span>
                    <span className="text-xs">words</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-start gap-3 bg-wallet-surface border border-wallet-border rounded-xl p-4">
                <ShieldCheck className="w-5 h-5 text-wallet-primary shrink-0 mt-0.5" />
                <p className="text-xs text-wallet-muted leading-relaxed">
                  Your secret phrase is the only way to recover your wallet.
                  Write it down and store it somewhere safe. Never share it with anyone.
                </p>
              </div>

              <motion.button
                {...buttonTap}
                onClick={handleGenerate}
                disabled={loading}
                className="wallet-btn flex items-center justify-center gap-2"
              >
                {loading
                  ? <Spinner size="sm" />
                  : <>Generate phrase <ArrowRight className="w-4 h-4" /></>
                }
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-wallet-text">
                  Secret phrase
                </h1>
                <p className="text-sm text-wallet-muted">
                  Write these {wordCount} words down in order
                </p>
              </div>

              <div className="relative">
                <MnemonicGrid mnemonic={mnemonic} hidden={!revealed} />

                {!revealed && (
                  <motion.div
                    variants={slideUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-wallet-bg/80 backdrop-blur-sm"
                  >
                    <p className="text-sm text-wallet-muted text-center px-4">
                      Make sure no one is watching your screen
                    </p>
                    <motion.button
                      {...buttonTap}
                      onClick={() => setRevealed(true)}
                      className="flex items-center gap-2 bg-wallet-surface border border-wallet-border text-wallet-text text-sm px-4 py-2.5 rounded-xl hover:border-wallet-primary transition-colors"
                    >
                      <Eye className="w-4 h-4 text-wallet-primary" />
                      Reveal phrase
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {revealed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  {...buttonTap}
                  onClick={() => setRevealed(false)}
                  className="flex items-center justify-center gap-1.5 text-xs text-wallet-dim hover:text-wallet-muted transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide phrase
                </motion.button>
              )}

              {revealed && (
                <motion.label
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 accent-wallet-primary w-4 h-4 shrink-0"
                  />
                  <span className="text-sm text-wallet-muted leading-relaxed">
                    I have written down my secret phrase and stored it safely
                  </span>
                </motion.label>
              )}

              <motion.button
                {...buttonTap}
                onClick={() => setStep(3)}
                disabled={!confirmed}
                className="wallet-btn flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-wallet-text">
                  Set password
                </h1>
                <p className="text-sm text-wallet-muted">
                  This encrypts your wallet on this device
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <PasswordInput
                  label="Password"
                  placeholder="At least 8 characters"
                  description="Used to unlock your wallet on this device"
                  error={errors.password?.message}
                  {...register('password')}
                />

                <PasswordInput
                  label="Confirm password"
                  placeholder="Repeat your password"
                  error={errors.confirm?.message}
                  {...register('confirm')}
                />

                <motion.button
                  {...buttonTap}
                  type="submit"
                  disabled={loading}
                  className="wallet-btn flex items-center justify-center gap-2 mt-2"
                >
                  {loading
                    ? <Spinner size="sm" />
                    : <>Create wallet <ArrowRight className="w-4 h-4" /></>
                  }
                </motion.button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.main>
  );
}