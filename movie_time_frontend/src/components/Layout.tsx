/**
 * Layout Component
 * Main layout wrapper with navbar and content area
 */

import { ReactNode } from 'react';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 MovieFlix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
