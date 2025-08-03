# Overview

This is a Custom Outdoor Kitchen & Pergola Ordering Platform that allows customers to order outdoor kitchens and pergolas based on live stock availability from manufacturers in China. The platform serves as a B2C frontend with backend automation that routes orders directly to suppliers for fulfillment. The system only displays products and configurations that are currently available in stock from one or more manufacturers.

## Key Features
- Live product catalog based on supplier inventory
- Product customization with pre-approved modules
- Real-time supplier integration and inventory sync
- Automated order fulfillment workflow
- DDP pricing with integrated payments
- Admin dashboard for order and supplier management

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
- **Data Models**: Suppliers, products, inventory, orders, and customer data with comprehensive type definitions

## Database Schema
- **Suppliers Table**: Manufacturer information and contact details
- **Categories Table**: Product categories (outdoor kitchens, pergolas, etc.)
- **Products Table**: Outdoor kitchen and pergola models with specifications
- **Inventory Table**: Real-time stock levels for each product at each supplier
- **Product Options Table**: Customizable add-ons and modules
- **Customers Table**: Customer information and shipping addresses
- **Orders Table**: Customer orders with status tracking
- **Order Items Table**: Individual products within orders
- **Admin Users Table**: Administrative access for order management
- **Type Safety**: Full TypeScript integration with Drizzle-Zod for runtime validation

## Core Business Logic
- **Inventory Management**: Real-time stock tracking and availability
- **Order Processing**: Automated order routing to appropriate suppliers
- **Customer Management**: Account creation and order history
- **Supplier Integration**: API connections for inventory sync and order fulfillment
- **Storage Interface**: Abstracted storage layer for flexible data persistence

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