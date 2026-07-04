'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Spinner } from '@/components/ui/Spinner';
import { validateMnemonic } from '@/utils/wallet';
import { pageVariants, cardVariants, buttonTap } from '@/lib/animations';


const importSchema = z
  .object({
    mnemonic: z
      .string()
      .min(1, 'Secret phrase is required')
      .refine(
        (val) => {
          const words = val.trim().split(/\s+/);
          return words.length === 12 || words.length === 24;
        },
        { message: 'Phrase must be 12 or 24 words' }
      )
      .refine(
        (val) => validateMnemonic(val.trim()),
        { message: 'Invalid secret phrase' }
      ),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm:  z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type ImportForm = z.infer<typeof importSchema>;

export default function ImportPage() {
  const router = useRouter();
  const { importWallet } = useWallet();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportForm>({ resolver: zodResolver(importSchema) });

  const onSubmit = async (data: ImportForm) => {
    try {
      setLoading(true);
      await importWallet(data.mnemonic.trim(), data.password);
      toast.success('Wallet imported successfully');
      router.replace('/dashboard');
    } catch {
      toast.error('Failed to import wallet');
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
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm text-wallet-dim hover:text-wallet-text transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1"
        >
          <h1 className="text-2xl font-semibold text-wallet-text">
            Import wallet
          </h1>
          <p className="text-sm text-wallet-muted">
            Enter your 12 or 24 word secret phrase
          </p>
        </motion.div>

        <motion.form
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-wallet-text">
              Secret phrase
            </label>
            <textarea
              {...register('mnemonic')}
              rows={4}
              placeholder="Enter words separated by spaces..."
              spellCheck={false}
              autoComplete="off"
              className={`
                wallet-input resize-none leading-relaxed
                ${errors.mnemonic ? 'border-wallet-danger' : ''}
              `}
            />
            {errors.mnemonic && (
              <p className="text-xs text-wallet-danger">
                {errors.mnemonic.message}
              </p>
            )}
            <p className="text-xs text-wallet-dim">
              Separate each word with a single space
            </p>
          </div>

          <PasswordInput
            label="New password"
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
              : <>Import wallet <ArrowRight className="w-4 h-4" /></>
            }
          </motion.button>

        </motion.form>
      </div>
    </motion.main>
  );
}