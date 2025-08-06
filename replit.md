# Overview

This is a movie and TV show streaming platform called "Maruya" that provides a Netflix-like experience. The application allows users to browse movies and TV shows, search for content, manage watchlists, and stream content through multiple video servers. It integrates with The Movie Database (TMDB) API for content metadata and provides a modern, responsive interface with dark theme support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. It follows a modern component-based architecture with:

- **Routing**: Uses Wouter for client-side routing with pages for home, player, and 404
- **State Management**: Leverages TanStack Query (React Query) for server state management and data fetching
- **UI Components**: Built with Radix UI primitives and shadcn/ui components for accessibility and consistency
- **Styling**: Utilizes Tailwind CSS with custom CSS variables for theming, configured for dark mode by default
- **Form Handling**: Implements React Hook Form with Zod validation for type-safe form management

## Backend Architecture
The backend uses Express.js with TypeScript in ESM format, structured around:

- **API Design**: RESTful endpoints organized in the routes module with proper error handling middleware
- **Data Storage**: Implements an interface-based storage pattern with in-memory storage for development and database support
- **TMDB Integration**: Transforms external API data to match internal schema structure
- **Development Server**: Integrates Vite middleware for hot module replacement in development

## Data Storage Solutions
The application uses a flexible storage architecture:

- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema Design**: Normalized tables for movies, TV shows, episodes, users, and watchlist items
- **Data Types**: Uses JSONB for complex data like genres and cast information
- **Migration Support**: Configured with Drizzle Kit for database schema management

## Authentication and Authorization
Currently implements a basic user system with:

- **User Management**: User creation and lookup by username and ID
- **Session Handling**: Prepared for session-based authentication
- **Data Protection**: User-scoped watchlist functionality

## Video Streaming Architecture
The platform supports multiple streaming servers:

- **Server Abstraction**: Configurable server endpoints (Vidsrc, Vipstream) with quality options
- **Content Types**: Handles both movies and TV shows with season/episode support
- **Player Interface**: Embedded iframe-based video player with server switching capabilities
- **Error Handling**: Retry mechanisms and fallback server options

# External Dependencies

## Third-Party Services
- **TMDB API**: The Movie Database for content metadata, ratings, and poster images
- **Streaming Servers**: External video hosting services (Vidsrc, Vipstream) for content delivery
- **Neon Database**: Serverless PostgreSQL database for production data storage

## Key Libraries and Frameworks
- **React Ecosystem**: React 18 with TypeScript, Wouter for routing, TanStack Query for data fetching
- **UI Framework**: Radix UI primitives with shadcn/ui components, Tailwind CSS for styling
- **Backend Stack**: Express.js with TypeScript, Drizzle ORM for database operations
- **Development Tools**: Vite for build tooling, ESBuild for server bundling, tsx for development execution
- **Validation**: Zod for schema validation and type safety across the stack

## Development and Build Tools
- **Package Manager**: NPM with lockfile version 3
- **TypeScript Configuration**: Configured for ESNext modules with strict type checking
- **Build Process**: Separate client and server builds with Vite and ESBuild respectively
- **Development Environment**: Replit-specific plugins for error handling and cartographer integration