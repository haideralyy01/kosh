import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const wrapperSize = {
    sm: 'w-16 h-6 scale-75',
    md: 'w-24 h-8',
    lg: 'w-32 h-10 scale-125',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'relative flex items-center justify-center mt-4',
        wrapperSize[size],
        className
      )}
    >

      <div className="absolute w-3 h-3 rounded-full bg-wallet-primary left-[15%] bottom-2 animate-[bounceBall_0.5s_alternate_infinite_ease]" />
      <div className="absolute w-3 h-3 rounded-full bg-wallet-primary left-[45%] bottom-2 animate-[bounceBall_0.5s_alternate_infinite_ease] [animation-delay:0.2s]" />
      <div className="absolute w-3 h-3 rounded-full bg-wallet-primary right-[15%] bottom-2 animate-[bounceBall_0.5s_alternate_infinite_ease] [animation-delay:0.3s]" />

      <div className="absolute w-3 h-0.5 rounded-full bg-black/40 bottom-0 left-[15%] blur-[1px] animate-[bounceShadow_0.5s_alternate_infinite_ease]" />
      <div className="absolute w-3 h-0.5 rounded-full bg-black/40 bottom-0 left-[45%] blur-[1px] animate-[bounceShadow_0.5s_alternate_infinite_ease] [animation-delay:0.2s]" />
      <div className="absolute w-3 h-0.5 rounded-full bg-black/40 bottom-0 right-[15%] blur-[1px] animate-[bounceShadow_0.5s_alternate_infinite_ease] [animation-delay:0.3s]" />
    </div>
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