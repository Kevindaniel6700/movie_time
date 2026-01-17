/**
 * Home Page
 * Displays featured movies and genre sections
 * All data fetched from backend APIs
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGenres } from '@/store/slices/moviesSlice';
import Layout from '@/components/Layout';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import GenreSection from '@/components/GenreSection';
import { SkeletonRow } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { genres, loading, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Featured Movies Section */}
        <section className="mb-12">
          <FeaturedCarousel />
        </section>

        {/* Genre Sections */}
        {error ? (
          <EmptyState 
            type="error" 
            title="Failed to load genres" 
            message={error} 
          />
        ) : loading && genres.length === 0 ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 w-32 shimmer mb-4 rounded" />
                <SkeletonRow />
              </div>
            ))}
          </div>
        ) : genres.length > 0 ? (
          genres.map((genre) => (
            <GenreSection key={genre.id} genre={genre} />
          ))
        ) : (
          <EmptyState 
            type="movies" 
            message="No genres available" 
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default HomePage;
