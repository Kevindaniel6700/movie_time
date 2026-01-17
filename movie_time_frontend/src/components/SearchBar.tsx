/**
 * SearchBar Component
 * Handles search input and type selection
 * All search is performed via backend API
 */

import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery, setSearchType, searchMovies, clearSearch } from '@/store/slices/searchSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  expanded?: boolean;
  onSearch?: () => void;
}

const SearchBar = ({ expanded = false, onSearch }: SearchBarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { query, searchType, loading } = useAppSelector((state) => state.search);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [localQuery, setLocalQuery] = useState(query);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery.trim().length >= 2) {
        dispatch(setQuery(localQuery));
        dispatch(searchMovies({ query: localQuery, type: searchType }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, searchType, dispatch]);

  const handleSearch = useCallback(() => {
    if (localQuery.trim()) {
      dispatch(setQuery(localQuery));
      dispatch(searchMovies({ query: localQuery, type: searchType }));
      navigate('/search');
      onSearch?.();
    }
  }, [localQuery, searchType, dispatch, navigate, onSearch]);

  const handleClear = () => {
    setLocalQuery('');
    dispatch(clearSearch());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      handleClear();
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Select
              value={searchType}
              onValueChange={(value) => dispatch(setSearchType(value as 'title' | 'actor' | 'director'))}
            >
              <SelectTrigger className="w-[110px] bg-secondary border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="actor">Actor</SelectItem>
                <SelectItem value="director">Director</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                type="text"
                placeholder="Search movies..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input w-[200px] md:w-[300px] pr-8"
                autoFocus
              />
              {localQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (isExpanded && localQuery) {
            handleSearch();
          } else {
            setIsExpanded(!isExpanded);
          }
        }}
        disabled={loading}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SearchBar;
