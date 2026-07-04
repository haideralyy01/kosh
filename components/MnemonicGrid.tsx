'use client';

import { motion } from 'framer-motion';
import { listVariants, listItemVariants } from '@/lib/animations';
import { CopyButton } from '@/components/ui/CopyButton';

interface MnemonicGridProps {
  mnemonic: string;
  hidden?: boolean;
}

export const MnemonicGrid = ({ mnemonic, hidden = false }: MnemonicGridProps) => {
  const words = mnemonic.trim().split(' ');

  return (
    <div className="flex flex-col gap-4 w-full">

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-2"
      >
        {words.map((word, i) => (
          <motion.div
            key={i}
            variants={listItemVariants}
            className="relative flex items-center gap-2 bg-wallet-surface border border-wallet-border rounded-xl px-3 py-2.5"
          >
            <span className="text-[10px] text-wallet-dim w-4 shrink-0 select-none">
              {i + 1}
            </span>

            <span
              className={`
                text-sm font-mono text-wallet-lavender font-medium
                transition-all duration-300
                ${hidden ? 'blur-sm select-none' : 'blur-none'}
              `}
            >
              {word}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {!hidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <CopyButton
            text={mnemonic}
            label="Secret phrase"
            className="text-wallet-dim hover:text-wallet-lavender"
          />
        </motion.div>
      )}

    </div>
  );
};