/**
 * EmptyState Component
 * Displays when no data is available
 */

import { motion } from 'framer-motion';
import { Film, Search, Bookmark, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type EmptyStateType = 'movies' | 'search' | 'watchlist' | 'error';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  message?: string;
  className?: string;
}

const icons = {
  movies: Film,
  search: Search,
  watchlist: Bookmark,
  error: AlertCircle,
};

const defaultContent = {
  movies: {
    title: 'No Movies Found',
    message: 'There are no movies available at the moment.',
  },
  search: {
    title: 'No Results',
    message: 'Try adjusting your search or filters.',
  },
  watchlist: {
    title: 'Your Watchlist is Empty',
    message: 'Start adding movies to keep track of what you want to watch.',
  },
  error: {
    title: 'Something Went Wrong',
    message: 'We encountered an error. Please try again later.',
  },
};

const EmptyState = ({ type, title, message, className }: EmptyStateProps) => {
  const Icon = icons[type];
  const content = defaultContent[type];

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Icon className={cn(
          'w-10 h-10',
          type === 'error' ? 'text-destructive' : 'text-muted-foreground'
        )} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {title || content.title}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {message || content.message}
      </p>
    </motion.div>
  );
};

export default EmptyState;
