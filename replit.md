# Overview

This is a comprehensive business consulting platform for "Growth Accelerators" - a firm specializing in startup and growth solutions. The application features a public-facing website with detailed service packages and a sophisticated integrated CRM system for managing the complete client lifecycle from initial consultation through active client management.

**Key Features:**
- Professional website with three main consulting packages
- Unified admin dashboard with integrated CRM functionality
- Complete prospect pipeline management with interaction tracking
- Smart to-do list aggregating all actionable items
- Email notification system for new inquiries
- Detailed view cards for submissions, prospects, and clients
- Financial tracking and client metrics

## Recent Changes
- **Integrated CRM System**: Unified all CRM functionality directly into admin dashboard with 4 tabs
- **Enhanced User Experience**: Added clickable names throughout that open detailed view cards
- **Comprehensive Detail Views**: 
  - Consultation submissions show complete form details and conversion options
  - Prospect details include original submission, interaction history, and follow-up management
  - Client profiles display financial metrics, account duration, and complete relationship history
- **Smart To-Do List**: Intelligent task aggregation showing overdue follow-ups, today's tasks, pending actions, and new submissions
- **Advanced Interaction Tracking**: Full logging system with outcomes, next actions, and follow-up scheduling
- **Email Integration**: Gmail SMTP notifications for new submissions (growthaccelerator03@gmail.com)
- **Pipeline Management**: Complete workflow from submission → prospect → client with status tracking

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