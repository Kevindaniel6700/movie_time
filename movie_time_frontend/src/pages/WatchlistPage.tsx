/**
 * Watchlist Page
 * Displays user's saved movies
 * State managed by Redux, persisted in localStorage
 */

import { motion } from 'framer-motion';
import { Trash2, Bookmark } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearWatchlist, removeFromWatchlist } from '@/store/slices/watchlistSlice';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const WatchlistPage = () => {
  const dispatch = useAppDispatch();
  const watchlistMovies = useAppSelector((state) => state.watchlist.movies);

  const handleClearAll = () => {
    dispatch(clearWatchlist());
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                My Watchlist
              </h1>
              <p className="text-muted-foreground">
                {watchlistMovies.length} movie{watchlistMovies.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          
          {watchlistMovies.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Watchlist?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all {watchlistMovies.length} movies from your watchlist. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Watchlist Movies */}
        {watchlistMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watchlistMovies.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="watchlist"
            title="Your Watchlist is Empty"
            message="Start adding movies you want to watch later. They'll appear here for easy access."
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default WatchlistPage;
