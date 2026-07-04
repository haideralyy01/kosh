'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { ArrowRight } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Spinner, FullScreenSpinner } from '@/components/ui/Spinner';
import { pageVariants, cardVariants, buttonTap } from '@/lib/animations';

const unlockSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type UnlockForm = z.infer<typeof unlockSchema>;

export default function LandingPage() {
  const router = useRouter();
  const { status, initialize, unlock } = useWallet();
  const [loading, setLoading] = React.useState(false);
  const [booting, setBooting] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UnlockForm>({ resolver: zodResolver(unlockSchema) });


  React.useEffect(() => {
    initialize();
    setBooting(false);
  }, [initialize]);

  React.useEffect(() => {
    if (status === 'unlocked') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  const onUnlock = async (data: UnlockForm) => {
    try {
      setLoading(true);
      await unlock(data.password);
      router.replace('/dashboard');
    } catch {
      setError('password', { message: 'Incorrect password' });
      toast.error('Incorrect password');
    } finally {
      setLoading(false);
    }
  };

  if (booting || status === 'unlocked') return <FullScreenSpinner />;

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-wallet-bg flex items-center justify-center px-4"
    >
      <AnimatePresence mode="wait">

        {status === 'uninitialized' && (
          <motion.div
            key="uninitialized"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm flex flex-col items-center gap-8"
          >
            <div className="flex flex-col items-center gap-3">
              <img
                src="/logo.png"
                alt="Kosh"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-semibold text-wallet-text">
                Kosh
              </h1>
              <p className="text-sm text-wallet-muted text-center">
                A secure Solana wallet in your browser
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <motion.button
                {...buttonTap}
                onClick={() => router.push('/create')}
                className="wallet-btn flex items-center justify-center gap-2"
              >
                Create new wallet
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                {...buttonTap}
                onClick={() => router.push('/import')}
                className="wallet-btn-ghost flex items-center justify-center gap-2"
              >
                Import existing wallet
              </motion.button>
            </div>
          </motion.div>
        )}

        {status === 'locked' && (
          <motion.div
            key="locked"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm flex flex-col items-center gap-8"
          >
            <div className="flex flex-col items-center gap-3">
              <img
                src="/logo.png"
                alt="Kosh"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-semibold text-wallet-text">
                Welcome back
              </h1>
              <p className="text-sm text-wallet-muted text-center">
                Enter your password to unlock
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onUnlock)}
              className="flex flex-col gap-4 w-full"
            >
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />

              <motion.button
                {...buttonTap}
                type="submit"
                disabled={loading}
                className="wallet-btn flex items-center justify-center gap-2"
              >
                {loading
                  ? <Spinner size="sm" />
                  : <>Unlock <ArrowRight className="w-4 h-4" /></>
                }
              </motion.button>
            </form>

            <button
              onClick={() => router.push('/create')}
              className="text-xs text-wallet-dim hover:text-wallet-muted transition-colors"
            >
              Forgot password? Create new wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}