/**
 * MovieCard Component
 * Displays a movie as a card with title and rating
 * No poster images - uses typography for visual hierarchy
 */

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Check } from 'lucide-react';
import { Movie } from '@/types/movie';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

const MovieCard = memo(({ movie, variant = 'default', className }: MovieCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isInWatchlist = useAppSelector(selectIsInWatchlist(movie.id));

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWatchlist(movie));
  };

  return (
    <motion.div
      className={cn(
        'movie-card group relative',
        variant === 'featured' && 'p-6 bg-gradient-to-br from-card to-secondary',
        variant === 'compact' && 'p-3',
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Watchlist button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-primary/20"
        onClick={handleWatchlistToggle}
        aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isInWatchlist ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>

      {/* Movie title */}
      <h3 className={cn(
        'font-bold text-card-foreground line-clamp-2 pr-8',
        variant === 'featured' ? 'text-xl mb-3' : 'text-base mb-2',
        variant === 'compact' && 'text-sm'
      )}>
        {movie.title}
      </h3>

      {/* Release year */}
      <p className="text-muted-foreground text-sm mb-2">
        {movie.releaseYear}
      </p>

      {/* Rating */}
      <div className="rating-badge">
        <Star className="h-3 w-3 fill-current" />
        <span>{movie.rating.toFixed(1)}</span>
      </div>

      {/* Genres (for featured variant) */}
      {variant === 'featured' && movie.genres && (
        <div className="flex flex-wrap gap-2 mt-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <span key={genre.id} className="genre-pill">
              {genre.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
