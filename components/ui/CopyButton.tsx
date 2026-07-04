'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text:        string;
  label?:      string;
  className?:  string;
}

export const CopyButton = ({ text, label, className }: CopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label ? `${label} copied` : 'Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 text-xs text-wallet-dim',
        'hover:text-wallet-lavender transition-colors duration-150',
        className
      )}
      aria-label={label ? `Copy ${label}` : 'Copy to clipboard'}
    >
      {copied
        ? <Check className="w-3.5 h-3.5 text-wallet-success" />
        : <Copy  className="w-3.5 h-3.5" />
      }
      <span>{copied ? 'Copied!' : (label ?? 'Copy')}</span>
    </button>
  );
};