/**
 * Navbar Component
 * Main navigation with search, genre dropdown, watchlist, and theme toggle
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Menu, X, Film } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleMobileMenu, closeMobileMenu } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';
import GenreDropdown from './GenreDropdown';
import ThemeToggle from './ThemeToggle';

const USER = { name: "Kevin Daniel" };

const Navbar = () => {
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const watchlistCount = useAppSelector((state) => state.watchlist.movies.length);

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => dispatch(closeMobileMenu())}>
            <Film className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground hidden sm:block">
              MovieTime
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <GenreDropdown />
            <SearchBar />
            <Link to="/watchlist" className="relative">
              <Button variant="ghost" size="icon" aria-label="Watchlist">
                <Bookmark className="w-5 h-5" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {watchlistCount > 9 ? '9+' : watchlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <ThemeToggle />
            <span className="text-sm font-bold text-foreground ml-2">
              Welcome, {USER.name}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col gap-4">
              <SearchBar expanded onSearch={() => dispatch(closeMobileMenu())} />
              <Link
                to="/"
                className="nav-link py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Home
              </Link>
              <GenreDropdown />
              <Link
                to="/watchlist"
                className="nav-link py-2 flex items-center gap-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                <Bookmark className="w-5 h-5" />
                Watchlist
                {watchlistCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                    {watchlistCount}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
