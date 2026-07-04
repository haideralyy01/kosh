import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-wallet-border border-t-wallet-primary animate-spin',
        sizeMap[size],
        className
      )}
    />
  );
};

export const FullScreenSpinner = () => {
  return (
    <div className="fixed inset-0 bg-wallet-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-wallet-dim animate-pulse">Loading wallet...</p>
      </div>
    </div>
  );
};