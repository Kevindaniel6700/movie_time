/**
 * Search Results Page
 * Displays search results from backend API
 */

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearSearch } from '@/store/slices/searchSlice';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';

import EmptyState from '@/components/EmptyState';
import { SkeletonCard } from '@/components/Skeleton';
import { Button } from '@/components/ui/button';

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const { query, searchType, results, loading, hasSearched } = useAppSelector((state) => state.search);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-muted-foreground">
                Showing results for "{query}" in {searchType}
              </p>
            )}
          </div>

        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : hasSearched && results.length === 0 ? (
          <EmptyState
            type="search"
            title="No Results Found"
            message={`We couldn't find any movies matching "${query}". Try a different search term.`}
          />
        ) : results.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-4">
              Found {results.length} movie{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Start Searching
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Search for movies by title, actor, or director using the search bar above.
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default SearchPage;
