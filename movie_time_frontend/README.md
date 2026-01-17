# MovieTime Frontend

The frontend interface for the MovieTime application, built with **React**, **TypeScript**, and **Vite**. It provides a modern, responsive, and interactive user experience for exploring movies.

## Features

- **Responsive Design**: Fully responsive UI built with Tailwind CSS and Shadcn UI.
- **Interactive Search**: Real-time search by title, actor, or director.
- **Dynamic Filtering**: Filter movies by genre, release year, and more.
- **Rich Profiles**: Detailed views for Movies, Actors, and Directors.
- **Watchlist**: Save your favorite movies for later.
- **Dark Mode**: Built-in theme toggle for light and dark modes.

## Technology Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI / Radix UI, Lucide Icons
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Testing**: Vitest, React Testing Library

## Quick Start (Local Development)

To run the frontend locally:

1.  **Install Dependencies**:
    ```bash
    cd cinestream-view
    npm install
    ```

2.  **Environment Setup**:
    Ensure the backend is running (default: `http://localhost:8000`).
    Create a `.env` file if needed (usually auto-configured for localhost).

3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    The app will be accessible at: `http://localhost:8080` (or `http://localhost:5173`)

## Project Structure

- `src/components`: Reusable UI components (Navbar, MovieCard, etc.)
- `src/pages`: Main application pages (Home, Search, Details)
- `src/store`: Redux state definitions (Movies, Filters, Watchlist)
- `src/services`: API integration with the backend
- `src/types`: TypeScript definitions for robust type checking

## Testing

Run the test suite using Vitest:

```bash
npm run test
```
