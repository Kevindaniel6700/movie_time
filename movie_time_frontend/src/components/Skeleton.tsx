/**
 * Loading skeleton components for various states
 */

import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const SkeletonCard = ({ variant = 'default', className }: SkeletonCardProps) => (
  <div
    className={cn(
      'bg-card border border-border rounded-lg animate-pulse',
      variant === 'featured' ? 'p-6' : 'p-4',
      variant === 'compact' && 'p-3',
      className
    )}
  >
    <div className={cn(
      'shimmer mb-2',
      variant === 'featured' ? 'h-6 w-3/4' : 'h-5 w-2/3'
    )} />
    <div className="shimmer h-4 w-1/4 mb-2" />
    <div className="shimmer h-6 w-16" />
    {variant === 'featured' && (
      <div className="flex gap-2 mt-3">
        <div className="shimmer h-5 w-16 rounded-full" />
        <div className="shimmer h-5 w-14 rounded-full" />
      </div>
    )}
  </div>
);

export const SkeletonRow = ({ count = 6 }: { count?: number }) => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} className="flex-shrink-0 w-[200px]" />
    ))}
  </div>
);

export const SkeletonDetails = () => (
  <div className="animate-pulse space-y-6">
    <div className="shimmer h-10 w-2/3" />
    <div className="shimmer h-6 w-1/4" />
    <div className="shimmer h-24 w-full" />
    <div className="flex gap-4">
      <div className="shimmer h-8 w-24 rounded-full" />
      <div className="shimmer h-8 w-20 rounded-full" />
    </div>
  </div>
);
