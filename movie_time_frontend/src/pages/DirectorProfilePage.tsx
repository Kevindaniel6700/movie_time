/**
 * Director Profile Page
 * Displays director info and their movies
 * All data fetched from backend API
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clapperboard, Film } from 'lucide-react';
import { Director, Movie } from '@/types/movie';
import { directorApi } from '@/services/api';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import { SkeletonCard, SkeletonDetails } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const DirectorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [director, setDirector] = useState<Director | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirectorData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const directorData = await directorApi.getDirectorById(id);
        setDirector(directorData);
        setMovies(directorData.movies || []);
      } catch (err) {
        setError((err as Error).message || 'Failed to load director');
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <SkeletonDetails />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <EmptyState type="error" message={error} />
      </Layout>
    );
  }

  if (!director) {
    return (
      <Layout>
        <EmptyState type="error" title="Director Not Found" message="The director you're looking for doesn't exist." />
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
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Director Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clapperboard className="w-12 h-12 text-primary" />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {director.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Film className="w-4 h-4" />
                <span>{movies.length} movie{movies.length !== 1 ? 's' : ''} directed</span>
              </div>
              {director.bio && (
                <p className="text-foreground leading-relaxed max-w-2xl">
                  {director.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Filmography */}
        <section>
          <h2 className="section-title">Directed Movies</h2>
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <EmptyState type="movies" message={`No movies found for ${director.name}`} />
          )}
        </section>
      </motion.div>
    </Layout>
  );
};

export default DirectorProfilePage;
