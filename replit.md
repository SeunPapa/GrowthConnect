# Overview

This is a business consulting website for "Growth Accelerators" - a firm that specializes in startup and growth solutions for entrepreneurs. The application provides information about different consulting packages, where each package contains multiple services, and includes a contact form for potential clients to inquire about services. The website presents a professional consulting business with three main packages: Startup Solutions, Launch & Growth Accelerator, and Ongoing Support Solutions, along with optional add-on modules.

## Recent Changes
- Built comprehensive CRM system with prospect management and interaction tracking
- Added workflow to convert consultation submissions to active clients
- Implemented email notification system using Gmail SMTP
- Created separate CRM dashboard accessible from admin panel
- Added prospect pipeline with status tracking and follow-up scheduling
- Built interaction logging system for calls, emails, meetings, and notes

## Structure Clarification
- **Packages**: The main offerings (Startup Solutions, Growth Accelerator, Ongoing Support)
- **Services**: Individual components within each package (Business Plan Creation, Market Research, etc.)
- **Add-on Modules**: Optional services that can enhance any package

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Client-side routing with Wouter for lightweight navigation
- **State Management**: TanStack React Query for server state management and data fetching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod for form validation and type safety
- **Styling**: Tailwind CSS with custom design system variables and responsive design

## Backend Architecture
- **Server Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API endpoints with JSON responses
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handling with structured error responses
- **Development Tools**: Hot module replacement with Vite integration for development

## Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL connection
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing
- **Data Models**: User accounts and contact form submissions with proper type definitions

## Database Schema
- **Users Table**: Basic user authentication with username/password
- **Contact Submissions Table**: Stores client inquiries with name, email, message, package selection, and timestamps
- **Clients Table**: Active clients with package details, pricing, and status tracking
- **Prospects Table**: CRM prospects with status, priority, follow-up dates, and notes
- **Interactions Table**: Detailed logs of all prospect communications and activities
- **Type Safety**: Full TypeScript integration with Drizzle-Zod for runtime validation

## Authentication and Authorization
- **Session Management**: Basic session handling with PostgreSQL session store
- **User Management**: Simple username/password authentication system
- **Storage Interface**: Abstracted storage layer allowing for different implementations (memory vs database)

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack React Query
- **TypeScript**: Full TypeScript support with strict configuration
- **Build Tools**: Vite with React plugin and TypeScript support

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Design System**: Shadcn/ui component system with customizable themes

### Backend and Database
- **Server**: Express.js with TypeScript support
- **Database**: PostgreSQL with Neon Database serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Session Storage**: connect-pg-simple for PostgreSQL session management
- **Validation**: Zod for runtime type validation and schema definition

### Development Tools
- **Development Server**: Vite with hot module replacement
- **Code Quality**: ESBuild for production builds
- **Environment**: Replit-specific plugins for development environment integration
- **Process Management**: TSX for TypeScript execution in development

### Utility Libraries
- **Date Handling**: date-fns for date manipulation
- **Styling Utilities**: clsx and tailwind-merge for conditional styling
- **Class Variants**: class-variance-authority for component variant management
- **Carousel**: Embla Carousel for image/content carousels
- **Command Palette**: cmdk for search and command interfaces