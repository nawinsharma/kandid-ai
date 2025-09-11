# Kandid AI Assignment 
assignment problem: https://docs.google.com/document/d/1bkC2GFeyPdP8o2U_JwzvSFmcCZXg53V78KdkAyYf_uQ/edit?tab=t.0
deployed: https://kandid-ai.vercel.app/

video:


https://github.com/user-attachments/assets/9b70eb6d-f7c2-4296-9a82-bb39794ee7be


## Features

- **Authentication**: Email/password and Google OAuth integration
- **Dashboard**: Real-time campaign and lead analytics
- **Lead Management**: Infinite scrolling, search, and filtering
- **Campaign Tracking**: Progress monitoring and success metrics
- **LinkedIn Integration**: Account management and outreach automation
- **Responsive Design**: Mobile-friendly interface
- **Performance**: Optimized with React.memo and database indexing

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL, prisma ORM
- **Authentication**: Better Auth
- **State Management**: Zustand, TanStack Query
- **Deployment**: Vercel (recommended)

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Bun (recommended) or npm/yarn

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd kandid-ai
bun install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/kandid_ai"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 3. Database Setup

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Seed with sample data (optional)
bun run db:seed
```

### 4. Start Development Server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database
bun run db:generate  # Generate migration files
bun run db:migrate   # Apply migrations
bun run db:studio    # Open database GUI
bun run db:push      # Push schema (dev only)
bun run db:seed      # Seed with sample data

# Utilities
bun run type-check   # TypeScript type checking
```

## Database Setup Options

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb kandid_ai
```

### Option 2: Docker
```bash
# Create docker-compose.yml (see DATABASE_SETUP.md)
docker-compose up -d
```

### Option 3: Cloud Database
- **Neon**: [neon.tech](https://neon.tech) (Free PostgreSQL)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

## Documentation

- [Database Setup Guide](./DATABASE_SETUP.md) - Comprehensive database setup
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Component Library](./docs/components.md) - UI components reference

## Project Structure

```
kandid-ai/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── campaigns/      # Campaign pages
│   │   └── leads/          # Lead pages
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── providers/     # Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── db/           # Database schema and connection
│   │   └── auth.ts       # Authentication configuration
│   └── middleware.ts      # Next.js middleware
├── scripts/               # Setup and utility scripts
├── drizzle.config.ts      # Drizzle ORM configuration
└── package.json
```

## Configuration

### Database Schema
The application uses the following main tables:
- `users` - User accounts (managed by Better Auth)
- `campaigns` - LinkedIn outreach campaigns
- `leads` - Individual leads within campaigns
- `linkedin_accounts` - Connected LinkedIn accounts

### Authentication
- Email/password authentication
- Google OAuth integration
- Protected routes with middleware
- Session management

### State Management
- **Zustand**: UI state, search filters, selections
- **TanStack Query**: Server state, caching, optimistic updates

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Railway**: One-click deployment with PostgreSQL
- **Netlify**: Static site deployment
- **Docker**: Containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Check the [Documentation](./DATABASE_SETUP.md)
- Open an [Issue](https://github.com/your-repo/issues)
- Contact the development team

---

Built with Next.js, TypeScript, and modern web technologies.
