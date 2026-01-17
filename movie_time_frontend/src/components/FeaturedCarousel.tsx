/**
 * FeaturedCarousel Component
 * Displays featured movies in a carousel/grid format
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedMovies } from '@/store/slices/moviesSlice';
import { toggleWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from './Skeleton';
import EmptyState from './EmptyState';

const FeaturedCarousel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { featuredMovies, loading, error } = useAppSelector((state) => state.movies);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchFeaturedMovies());
  }, [dispatch]);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredMovies.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentIndex];
  const isInWatchlist = useAppSelector(
    currentMovie ? selectIsInWatchlist(currentMovie.id) : () => false
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handleWatchlistToggle = () => {
    if (currentMovie) {
      dispatch(toggleWatchlist(currentMovie));
    }
  };

  if (loading && featuredMovies.length === 0) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-card to-secondary p-8 min-h-[300px]">
        <SkeletonCard variant="featured" className="bg-transparent border-0" />
      </div>
    );
  }

  if (error) {
    return <EmptyState type="error" message={error} />;
  }

  if (featuredMovies.length === 0) {
    return <EmptyState type="movies" message="No featured movies available" />;
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-card to-secondary/50 border border-border">
      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80"
        onClick={handlePrev}
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80"
        onClick={handleNext}
        aria-label="Next movie"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          className="p-8 md:p-12 min-h-[300px] flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Featured
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-2xl">
            {currentMovie.title}
          </h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-muted-foreground">{currentMovie.releaseYear}</span>
            <div className="rating-badge">
              <Star className="w-4 h-4 fill-current" />
              <span>{currentMovie.rating.toFixed(1)}</span>
            </div>
          </div>
          {currentMovie.genres && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentMovie.genres.map((genre) => (
                <span key={genre.id} className="genre-pill">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              onClick={handleWatchlistToggle}
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Watchlist
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-muted-foreground/50 hover:bg-muted-foreground'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
