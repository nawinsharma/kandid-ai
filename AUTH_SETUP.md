# Better Auth Integration Setup

This document explains how to set up and use Better Auth with your Kandid AI application.

## Overview

The application now uses Better Auth for authentication with the following features:
- Email/password authentication
- Google OAuth integration
- Session management
- User management through Prisma

## Setup Instructions

### 1. Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kandid_ai"

# Better Auth
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 2. Database Setup

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Run Database Migrations:**
   ```bash
   npm run db:migrate
   ```

3. **Seed the Database (Optional):**
   ```bash
   npm run db:seed
   ```
   Note: This will create sample data with placeholder user IDs.

### 3. User Creation and Data Association

Since Better Auth manages user creation, follow these steps to associate sample data with real users:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Create users through the authentication system:**
   - Go to `http://localhost:3000/auth/register`
   - Register new users through the auth modal
   - Or use the login/register functionality in your app

3. **Update seed file with actual user IDs:**
   ```bash
   npm run db:update-seed-ids
   ```
   This script will:
   - Fetch all users from the database
   - Replace placeholder user IDs in the seed file with actual user IDs
   - Update the seed file automatically

4. **Re-seed the database with real user associations:**
   ```bash
   npm run db:seed
   ```

## Authentication Flow

### Frontend Components

- **AuthProvider**: Manages authentication state using Better Auth client
- **AuthModal**: Handles login, registration, and Google OAuth
- **Auth Store**: Zustand store for managing auth state

### API Routes

- `/api/auth/[...all]`: Main Better Auth handler
- `/api/auth/session`: Session management
- `/api/auth/sign-in/email`: Email login
- `/api/auth/sign-up/email`: Email registration
- `/api/auth/sign-in/google`: Google OAuth

### Usage Examples

#### Sign Up
```typescript
import { authClient } from '@/lib/auth-client';

const result = await authClient.signUp.email({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});
```

#### Sign In
```typescript
const result = await authClient.signIn.email({
  email: "john@example.com",
  password: "password123",
});
```

#### Google OAuth
```typescript
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/",
});
```

#### Get Session
```typescript
const session = await authClient.getSession();
const user = session.data?.user;
```

#### Sign Out
```typescript
await authClient.signOut();
```

## Database Schema

The Prisma schema includes Better Auth tables:
- `User`: User information
- `Session`: User sessions
- `Account`: OAuth accounts
- `Verification`: Email verification tokens

Plus your application tables:
- `Campaign`: LinkedIn campaigns
- `Lead`: Campaign leads
- `LinkedinAccount`: LinkedIn account connections

## Troubleshooting

### Common Issues

1. **"No users found" when running update-seed-ids script:**
   - Make sure you've created users through the authentication system first
   - Check that the database connection is working

2. **Authentication not working:**
   - Verify environment variables are set correctly
   - Check that the database is running and accessible
   - Ensure Prisma client is generated

3. **Google OAuth not working:**
   - Verify Google OAuth credentials are set
   - Check that redirect URIs are configured in Google Console
   - Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### Useful Commands

```bash
# Reset database and re-seed
npm run db:reset

# View database in Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

## Security Notes

- Never commit `.env.local` files
- Use strong passwords for database connections
- Regularly rotate OAuth credentials
- Enable HTTPS in production
- Set secure session cookies in production

## Next Steps

1. Set up email verification if needed
2. Add password reset functionality
3. Implement role-based access control
4. Add user profile management
5. Set up proper error handling and logging
