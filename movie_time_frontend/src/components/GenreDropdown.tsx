/**
 * GenreDropdown Component
 * Dropdown for selecting genre filter
 * Triggers backend API filtering
 */

import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGenres } from '@/store/slices/moviesSlice';
import { setGenreFilter } from '@/store/slices/filtersSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const GenreDropdown = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const genres = useAppSelector((state) => state.movies.genres);
  const selectedGenre = useAppSelector((state) => state.filters.selectedGenre);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);

  const handleGenreSelect = (genreId: string | null) => {
    dispatch(setGenreFilter(genreId));
    if (genreId) {
      navigate(`/genre/${genreId}`);
    } else {
      navigate('/');
    }
  };

  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name || 'Genres';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="nav-link gap-1">
          {selectedGenreName}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 max-h-[300px] overflow-y-auto bg-popover border border-border z-50">
        <DropdownMenuItem onClick={() => handleGenreSelect(null)}>
          All Genres
        </DropdownMenuItem>
        {genres.map((genre) => (
          <DropdownMenuItem
            key={genre.id}
            onClick={() => handleGenreSelect(genre.id)}
            className={selectedGenre === genre.id ? 'bg-accent' : ''}
          >
            {genre.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GenreDropdown;
