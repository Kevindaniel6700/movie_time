/**
 * GenreSection Component
 * Displays a horizontal scrollable row of movies by genre
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Genre } from '@/types/movie';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMoviesByGenre } from '@/store/slices/moviesSlice';
import MovieCard from './MovieCard';
import { SkeletonRow } from './Skeleton';
import EmptyState from './EmptyState';

interface GenreSectionProps {
  genre: Genre;
}

const GenreSection = ({ genre }: GenreSectionProps) => {
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movies.moviesByGenre[genre.id]);
  const loading = useAppSelector((state) => state.movies.loading);

  useEffect(() => {
    if (!movies) {
      dispatch(fetchMoviesByGenre(genre.id));
    }
  }, [dispatch, genre.id, movies]);

  return (
    <motion.section
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title flex items-center gap-2 mb-0">
          {genre.name}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </h2>
        <Link
          to={`/genre/${genre.id}`}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          See All
        </Link>
      </div>

      {loading && !movies ? (
        <SkeletonRow count={6} />
      ) : movies && movies.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              className="flex-shrink-0 w-[200px]"
            />
          ))}
        </div>
      ) : (
        <EmptyState type="movies" message={`No ${genre.name} movies available`} />
      )}
    </motion.section>
  );
};

export default GenreSection;
