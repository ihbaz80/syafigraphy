# Database Migration Guide for Vercel Deployment

## Current Setup: SQLite
Your project currently uses SQLite which works locally but not on Vercel.

## Recommended Solution: Vercel Postgres

### Step 1: Add Vercel Postgres to Your Project

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Add Postgres to your project**:
```bash
vercel storage add postgres
```

3. **Follow the prompts** to create your database

### Step 2: Install Required Dependencies

```bash
npm install @vercel/postgres
```

### Step 3: Update Database Configuration

Replace `lib/database.ts` with Postgres configuration:

```typescript
import { sql } from '@vercel/postgres';

export async function getDatabase() {
  return sql;
}

// Update all database queries to use Postgres syntax
// Example: Replace SQLite queries with Postgres queries
```

### Step 4: Update API Routes

Update all API routes to use async/await with Postgres:

```typescript
// Example: app/api/products/route.ts
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `;
    return Response.json({ products: rows });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
```

## Alternative Solutions

### Option B: Use Supabase (Free Tier Available)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Use their PostgreSQL database
4. Update connection strings

### Option C: Use PlanetScale (MySQL)
1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Use their MySQL database
4. Update connection strings

## Migration Steps

1. **Export current data** from SQLite
2. **Create new database** (Postgres/Supabase/PlanetScale)
3. **Import data** to new database
4. **Update code** to use new database
5. **Test locally** with new database
6. **Deploy to Vercel**

## Environment Variables for Production Database

Add these to your Vercel environment variables:

```env
# For Vercel Postgres
POSTGRES_URL=your-postgres-url
POSTGRES_HOST=your-postgres-host
POSTGRES_DATABASE=your-database-name
POSTGRES_USERNAME=your-username
POSTGRES_PASSWORD=your-password

# For Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# For PlanetScale
DATABASE_URL=your-planetscale-url
``` 