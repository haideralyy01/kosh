'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  error?:       string;
  description?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, description, className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">

        {label && (
          <label className="text-sm font-medium text-wallet-text">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={show ? 'text' : 'password'}
            className={cn(
              'wallet-input pr-11',
              error && 'border-wallet-danger focus:border-wallet-danger',
              className
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-wallet-dim hover:text-wallet-muted transition-colors"
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show
              ? <EyeOff className="w-4 h-4" />
              : <Eye    className="w-4 h-4" />
            }
          </button>
        </div>

        {description && !error && (
          <p className="text-xs text-wallet-dim">{description}</p>
        )}

        {error && (
          <p className="text-xs text-wallet-danger">{error}</p>
        )}

      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';