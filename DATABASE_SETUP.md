# Database Setup Guide for Kandid AI

## 🗄️ **Environment Variables**

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/kandid_ai"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 🐘 **PostgreSQL Setup**

### Option 1: Local PostgreSQL Installation

1. **Install PostgreSQL**:
   ```bash
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE kandid_ai;

   # Create user (optional)
   CREATE USER kandid_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE kandid_ai TO kandid_user;

   # Exit
   \q
   ```

3. **Update DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://kandid_user:your_password@localhost:5432/kandid_ai"
   ```

### Option 2: Docker PostgreSQL

1. **Create docker-compose.yml**:
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: kandid_ai
         POSTGRES_USER: kandid_user
         POSTGRES_PASSWORD: your_password
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

2. **Run with Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Update DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://kandid_user:your_password@localhost:5432/kandid_ai"
   ```

### Option 3: Cloud Database (Recommended for Production)

**Neon (Free PostgreSQL)**:
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update DATABASE_URL in `.env.local`

**Supabase**:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update DATABASE_URL in `.env.local`

## 🚀 **Local Development Setup**

### 1. Install Dependencies
```bash
bun install
```

### 2. Generate Drizzle Configuration
The `drizzle.config.ts` file is already created with the correct configuration.

### 3. Generate Migration Files
```bash
bun run db:generate
```

This will create migration files in the `drizzle/` directory.

### 4. Run Migrations
```bash
bun run db:migrate
```

This will apply all migrations to your database.

### 5. Start Development Server
```bash
bun run dev
```

## 📊 **Drizzle Commands Reference**

### Available Scripts
```bash
# Generate migration files from schema changes
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Open Drizzle Studio (Database GUI)
bun run db:studio
```

### Manual Drizzle Commands
```bash
# Generate migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Open Drizzle Studio
npx drizzle-kit studio

# Push schema directly (for development only)
npx drizzle-kit push
```

## 🔧 **Database Schema Management**

### Current Schema Structure
The application includes these main tables:

1. **users** - User accounts (managed by Better Auth)
2. **campaigns** - LinkedIn outreach campaigns
3. **leads** - Individual leads within campaigns
4. **linkedin_accounts** - Connected LinkedIn accounts

### Making Schema Changes

1. **Modify Schema**: Edit `src/lib/db/schema.ts`
2. **Generate Migration**: `bun run db:generate`
3. **Review Migration**: Check the generated SQL in `drizzle/` folder
4. **Apply Migration**: `bun run db:migrate`

### Example Schema Change
```typescript
// Add a new column to campaigns table
export const campaigns = pgTable("campaigns", {
  // ... existing columns
  newColumn: text("new_column"), // Add this line
});
```

Then run:
```bash
bun run db:generate
bun run db:migrate
```

## 🛠️ **Database Operations**

### Using the Database in Your Code

```typescript
import { db } from "@/lib/db";
import { campaigns, leads } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Get all campaigns for a user
const userCampaigns = await db
  .select()
  .from(campaigns)
  .where(eq(campaigns.userId, userId));

// Get leads with pagination
const userLeads = await db
  .select()
  .from(leads)
  .where(eq(leads.userId, userId))
  .orderBy(desc(leads.createdAt))
  .limit(20)
  .offset(0);

// Insert new campaign
const [newCampaign] = await db
  .insert(campaigns)
  .values({
    name: "New Campaign",
    status: "draft",
    userId: userId,
  })
  .returning();
```

## 🔍 **Database Studio (GUI)**

Drizzle Studio provides a web-based GUI for your database:

```bash
bun run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:
- View all tables and data
- Run SQL queries
- Edit data directly
- View table relationships

## 🚨 **Troubleshooting**

### Common Issues

1. **Connection Refused**:
   - Check if PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Migration Errors**:
   - Check if database is accessible
   - Verify schema syntax
   - Check for conflicting migrations

3. **Permission Denied**:
   - Ensure user has proper permissions
   - Check database user credentials

### Reset Database (Development Only)
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS kandid_ai;"
psql -U postgres -c "CREATE DATABASE kandid_ai;"

# Re-run migrations
bun run db:migrate
```

## 📈 **Production Deployment**

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
BETTER_AUTH_SECRET="production-secret-key"
BETTER_AUTH_URL="https://yourdomain.com"
```

### Migration Strategy
1. Always test migrations in staging first
2. Backup production database before migrations
3. Use `bun run db:migrate` in production
4. Monitor migration logs

## 🔐 **Security Best Practices**

1. **Never commit `.env.local`** to version control
2. **Use strong passwords** for database users
3. **Enable SSL** for production database connections
4. **Regular backups** of production data
5. **Limit database user permissions** to minimum required

## 📚 **Additional Resources**

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
