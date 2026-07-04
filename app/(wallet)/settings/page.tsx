'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  AlertTriangle,
} from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { decryptMnemonic } from '@/lib/crypto';
import { MnemonicGrid } from '@/components/MnemonicGrid';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Spinner } from '@/components/ui/Spinner';
import { pageVariants, cardVariants, buttonTap } from '@/lib/animations';

const revealSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

const resetSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirm: z.literal('RESET WALLET', {
      message: 'Type RESET WALLET to confirm',
    }),
});

type RevealForm = z.infer<typeof revealSchema>;
type ResetForm  = z.infer<typeof resetSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const {
    vault,
    session,
    accounts,
    activeAccount,
    addAccount,
    switchAccount,
    resetWallet,
  } = useWallet();

  const [mnemonic,       setMnemonic]       = React.useState('');
  const [showMnemonic,   setShowMnemonic]   = React.useState(false);
  const [revealLoading,  setRevealLoading]  = React.useState(false);
  const [addingAccount,  setAddingAccount]  = React.useState(false);
  const [resetOpen,      setResetOpen]      = React.useState(false);
  const [resetLoading,   setResetLoading]   = React.useState(false);

  const revealForm = useForm<RevealForm>({
    resolver: zodResolver(revealSchema),
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onReveal = async (data: RevealForm) => {
    if (!vault) return;
    try {
      setRevealLoading(true);
      const phrase = await decryptMnemonic(vault, data.password);
      setMnemonic(phrase);
      setShowMnemonic(true);
      revealForm.reset();
    } catch {
      revealForm.setError('password', { message: 'Incorrect password' });
      toast.error('Incorrect password');
    } finally {
      setRevealLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      setAddingAccount(true);
      await addAccount();
      toast.success('Account added');
    } catch {
      toast.error('Failed to add account');
    } finally {
      setAddingAccount(false);
    }
  };

  const handleSwitch = async (index: number) => {
    try {
      await switchAccount(index);
      toast.success(`Switched to Account ${index + 1}`);
    } catch {
      toast.error('Failed to switch account');
    }
  };


  const onReset = async (data: ResetForm) => {
    if (!vault) return;
    try {
      setResetLoading(true);
      await decryptMnemonic(vault, data.password);
      resetWallet();
      toast.success('Wallet reset');
      router.replace('/');
    } catch {
      resetForm.setError('password', { message: 'Incorrect password' });
      toast.error('Incorrect password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* header */}
        <div>
          <h1 className="text-2xl font-semibold text-wallet-text">Settings</h1>
          <p className="text-sm text-wallet-muted mt-0.5">
            Manage your wallet preferences
          </p>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 bg-wallet-surface border border-wallet-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-wallet-text">
                Accounts
              </span>
              <span className="text-xs text-wallet-muted">
                Manage your derived accounts
              </span>
            </div>
            <motion.button
              {...buttonTap}
              onClick={handleAddAccount}
              disabled={addingAccount}
              className="flex items-center gap-1.5 text-xs bg-wallet-card border border-wallet-border text-wallet-lavender px-3 py-2 rounded-xl hover:border-wallet-primary transition-colors"
            >
              {addingAccount
                ? <Spinner size="sm" />
                : <><Plus className="w-3.5 h-3.5" /> Add account</>
              }
            </motion.button>
          </div>

          <div className="flex flex-col gap-2">
            {accounts.map((account) => {
              const isActive = activeAccount?.index === account.index;
              return (
                <motion.button
                  key={account.index}
                  {...buttonTap}
                  onClick={() => !isActive && handleSwitch(account.index)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left
                    ${isActive
                      ? 'bg-wallet-primary/10 border-wallet-primary/30'
                      : 'bg-wallet-card border-wallet-border hover:border-wallet-muted cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-wallet-success' : 'bg-wallet-border'}`} />
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-sm font-medium ${isActive ? 'text-wallet-primary' : 'text-wallet-text'}`}>
                        {account.name}
                      </span>
                      <span className="text-xs text-wallet-dim font-mono">
                        {account.publicKey.slice(0, 8)}...{account.publicKey.slice(-8)}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-xs text-wallet-primary bg-wallet-primary/10 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 bg-wallet-surface border border-wallet-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-wallet-primary" />
            <span className="text-sm font-medium text-wallet-text">Security</span>
          </div>

          <div className="flex flex-col gap-3 bg-wallet-card border border-wallet-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-wallet-text">
                  Secret recovery phrase
                </span>
                <span className="text-xs text-wallet-muted">
                  View your 12 or 24 word phrase
                </span>
              </div>
              {showMnemonic && (
                <motion.button
                  {...buttonTap}
                  onClick={() => {
                    setShowMnemonic(false);
                    setMnemonic('');
                  }}
                  className="flex items-center gap-1.5 text-xs text-wallet-dim hover:text-wallet-muted transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide
                </motion.button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {showMnemonic ? (
                <motion.div
                  key="mnemonic"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <MnemonicGrid mnemonic={mnemonic} hidden={false} />
                </motion.div>
              ) : (
                <motion.form
                  key="reveal-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={revealForm.handleSubmit(onReveal)}
                  className="flex flex-col gap-3"
                >
                  <PasswordInput
                    placeholder="Enter password to reveal"
                    error={revealForm.formState.errors.password?.message}
                    {...revealForm.register('password')}
                  />
                  <motion.button
                    {...buttonTap}
                    type="submit"
                    disabled={revealLoading}
                    className="flex items-center justify-center gap-2 wallet-btn-ghost text-sm py-2.5"
                  >
                    {revealLoading
                      ? <Spinner size="sm" />
                      : <><Eye className="w-4 h-4" /> Reveal phrase</>
                    }
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 bg-wallet-surface border border-wallet-danger/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-wallet-danger" />
            <span className="text-sm font-medium text-wallet-danger">
              Danger zone
            </span>
          </div>

          <div className="flex flex-col gap-3 bg-wallet-card border border-wallet-border rounded-xl p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-wallet-text">
                Reset wallet
              </span>
              <span className="text-xs text-wallet-muted">
                Permanently delete your wallet from this device.
                Make sure you have your secret phrase backed up.
              </span>
            </div>

            <AnimatePresence>
              {!resetOpen ? (
                <motion.button
                  {...buttonTap}
                  onClick={() => setResetOpen(true)}
                  className="flex items-center gap-2 text-sm text-wallet-danger bg-wallet-danger/10 border border-wallet-danger/20 px-4 py-2.5 rounded-xl hover:bg-wallet-danger/20 transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset wallet
                </motion.button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onSubmit={resetForm.handleSubmit(onReset)}
                  className="flex flex-col gap-3"
                >
                  <PasswordInput
                    label="Confirm password"
                    placeholder="Enter your password"
                    error={resetForm.formState.errors.password?.message}
                    {...resetForm.register('password')}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-wallet-text">
                      Type RESET WALLET to confirm
                    </label>
                    <input
                      {...resetForm.register('confirm')}
                      placeholder="RESET WALLET"
                      className={`wallet-input font-mono text-sm ${
                        resetForm.formState.errors.confirm
                          ? 'border-wallet-danger'
                          : ''
                      }`}
                    />
                    {resetForm.formState.errors.confirm && (
                      <p className="text-xs text-wallet-danger">
                        {resetForm.formState.errors.confirm.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      {...buttonTap}
                      type="button"
                      onClick={() => {
                        setResetOpen(false);
                        resetForm.reset();
                      }}
                      className="flex-1 wallet-btn-ghost text-sm py-2.5"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      {...buttonTap}
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-wallet-danger/10 border border-wallet-danger/30 text-wallet-danger text-sm py-2.5 rounded-xl hover:bg-wallet-danger/20 transition-colors"
                    >
                      {resetLoading
                        ? <Spinner size="sm" />
                        : <><Trash2 className="w-4 h-4" /> Confirm reset</>
                      }
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}