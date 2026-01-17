/**
 * Movie Details Page
 * Displays detailed information about a movie
 * All data fetched from backend APIs
 */

import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Plus, Check, Calendar, User, Clapperboard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMovieDetails, fetchRelatedMovies, clearCurrentMovie } from '@/store/slices/moviesSlice';
import { toggleWatchlist, selectIsInWatchlist } from '@/store/slices/watchlistSlice';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import { SkeletonDetails, SkeletonRow } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentMovie, relatedMovies, loading, error } = useAppSelector((state) => state.movies);
  const isInWatchlist = useAppSelector(id ? selectIsInWatchlist(id) : () => false);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id));
      dispatch(fetchRelatedMovies(id));
    }

    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id]);

  const handleWatchlistToggle = () => {
    if (currentMovie) {
      dispatch(toggleWatchlist(currentMovie));
    }
  };

  if (loading && !currentMovie) {
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

  if (!currentMovie) {
    return (
      <Layout>
        <EmptyState type="movies" title="Movie Not Found" message="The movie you're looking for doesn't exist." />
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
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Movie Details */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {currentMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="rating-badge">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{currentMovie.rating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {currentMovie.releaseYear}
                </span>
              </div>

              {currentMovie.description && (
                <p className="text-foreground mb-6 leading-relaxed">
                  {currentMovie.description}
                </p>
              )}

              {/* Genres */}
              {currentMovie.genres && currentMovie.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMovie.genres.map((genre) => (
                      <Link
                        key={genre.id}
                        to={`/genre/${genre.id}`}
                        className="genre-pill hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Director */}
              {currentMovie.director && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    <Clapperboard className="w-4 h-4 inline-block mr-1" />
                    Director
                  </h3>
                  <Link
                    to={`/director/${currentMovie.director.id}`}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {currentMovie.director.name}
                  </Link>
                </div>
              )}

              {/* Actors */}
              {currentMovie.actors && currentMovie.actors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    <User className="w-4 h-4 inline-block mr-1" />
                    Cast
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMovie.actors.map((actor) => (
                      <Link
                        key={actor.id}
                        to={`/actor/${actor.id}`}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                      >
                        {actor.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Watchlist Button */}
              <Button
                variant={isInWatchlist ? 'outline' : 'default'}
                size="lg"
                onClick={handleWatchlistToggle}
                className="mt-4"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>

            {/* Reviews (Mock Data) */}
            <div className="lg:w-80 bg-secondary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Reviews</h3>
              <div className="space-y-4">
                {currentMovie.reviews && currentMovie.reviews.length > 0 ? (
                  currentMovie.reviews.map((review, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">{review.user}</span>
                        <div className="rating-badge text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          {review.rating}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      {review.date && (
                        <div className="text-xs text-muted-foreground mt-1">{review.date}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        <section>
          <h2 className="section-title">Related Movies</h2>
          {relatedMovies.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {relatedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  className="flex-shrink-0 w-[200px]"
                />
              ))}
            </div>
          ) : (
            <EmptyState type="movies" message="No related movies found" />
          )}
        </section>
      </motion.div>
    </Layout>
  );
};

export default MovieDetailsPage;
