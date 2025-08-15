// Database Configuration for Local Development and Production
export interface DatabaseConfig {
  type: 'sqlite' | 'postgres' | 'mysql'
  url?: string
  host?: string
  database?: string
  username?: string
  password?: string
}

// Get database configuration based on environment
export function getDatabaseConfig(): DatabaseConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Check for external database configuration
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL
    }
  }
  
  if (process.env.POSTGRES_URL) {
    return {
      type: 'postgres',
      url: process.env.POSTGRES_URL
    }
  }
  
  if (process.env.MYSQL_URL) {
    return {
      type: 'mysql',
      url: process.env.MYSQL_URL
    }
  }
  
  // Default to SQLite for local development
  return {
    type: 'sqlite'
  }
}

// Check if external database is configured
export function hasExternalDatabase(): boolean {
  const config = getDatabaseConfig()
  return config.type !== 'sqlite'
}

// Check if Supabase is configured
export function hasSupabase(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Get database connection string
export function getConnectionString(): string | null {
  const config = getDatabaseConfig()
  return config.url || null
}

// Environment variables needed for production
export const REQUIRED_ENV_VARS = {
  // For Vercel Postgres
  POSTGRES_URL: 'PostgreSQL connection URL',
  POSTGRES_HOST: 'PostgreSQL host',
  POSTGRES_DATABASE: 'PostgreSQL database name',
  POSTGRES_USERNAME: 'PostgreSQL username',
  POSTGRES_PASSWORD: 'PostgreSQL password',
  
  // For Supabase
  NEXT_PUBLIC_SUPABASE_URL: 'https://zwzmncrpfepskmzyhyev.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3em1uY3JwZmVwc2ttenloeWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTY5ODUsImV4cCI6MjA3MDgzMjk4NX0.gcc3_0c5W1fYY8CzFPgjgE282_wLOI0kKxRhSxSJ5H0',
  
  // For PlanetScale
  DATABASE_URL: 'Database connection URL',
  
  // For any external database
  //DATABASE_URL: 'Database connection URL'
}

