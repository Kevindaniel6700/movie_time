/**
 * Genre Page
 * Displays all movies for a specific genre
 * Data fetched from backend API
 */

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMoviesByGenre, fetchGenres } from '@/store/slices/moviesSlice';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import { SkeletonCard } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { moviesByGenre, genres, loading, error } = useAppSelector((state) => state.movies);
  
  const movies = id ? moviesByGenre[id] : [];
  const genre = genres.find((g) => g.id === id);

  useEffect(() => {
    if (id) {
      dispatch(fetchMoviesByGenre(id));
    }
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, id, genres.length]);

  if (error) {
    return (
      <Layout>
        <EmptyState type="error" message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Tag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {genre?.name || 'Genre'} Movies
              </h1>
              <p className="text-muted-foreground">
                Browse all {genre?.name || ''} movies
              </p>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies && movies.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-4">
              {movies.length} movie{movies.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            type="movies"
            title={`No ${genre?.name || ''} Movies`}
            message="There are no movies in this genre at the moment."
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default GenrePage;
