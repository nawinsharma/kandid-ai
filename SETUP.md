# Kandid AI Setup Instructions

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)

## Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kandid_ai"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

3. Set up the database:
```bash
# Generate migration files
bun run drizzle-kit generate

# Run migrations
bun run drizzle-kit migrate
```

4. Start the development server:
```bash
bun run dev
```

## Features Implemented

### ✅ Completed
- **Database Schema**: PostgreSQL with Drizzle ORM
- **Authentication System**: Better Auth with email/password and Google OAuth
- **State Management**: Zustand for client state, TanStack Query for server state
- **Leads Management**: Infinite scrolling, search, filtering
- **Campaigns Management**: Enhanced table with statistics and sorting
- **UI Components**: shadcn/ui components with proper styling
- **Protected Routes**: Middleware for authentication
- **Responsive Design**: Mobile-friendly interface

### 🔄 In Progress
- **Error Handling**: Comprehensive error boundaries and validation
- **Performance Optimization**: React.memo, useMemo, database indexing

### 📋 Remaining
- **LinkedIn Integration**: API connections for LinkedIn accounts
- **Message Templates**: Advanced template editor
- **Analytics Dashboard**: Detailed campaign analytics
- **Export Features**: CSV/Excel export functionality

## Database Schema

The application uses the following main tables:
- `users`: User accounts (managed by Better Auth)
- `campaigns`: LinkedIn outreach campaigns
- `leads`: Individual leads within campaigns
- `linkedin_accounts`: Connected LinkedIn accounts

## API Endpoints

- `GET /api/campaigns` - Fetch user campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/leads` - Fetch leads with pagination and filtering
- `POST /api/leads` - Create new lead
- `GET /api/auth/[...all]` - Authentication endpoints

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL, Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: Zustand, TanStack Query
- **Deployment**: Vercel (recommended)

## Development

The application follows modern React patterns with:
- Server-side rendering (SSR)
- Client-side state management
- Optimistic updates
- Infinite scrolling
- Real-time data fetching
- Type-safe database operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.
