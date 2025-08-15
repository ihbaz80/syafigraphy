import { NextRequest, NextResponse } from 'next/server'
import { adminDB } from '@/lib/database'
import { supabaseDB } from '@/lib/supabaseDatabase'
import { hasSupabase } from '@/lib/databaseConfig'

type AdminUser = {
  id: string
  username: string
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    let user: AdminUser | null = null;

    if (hasSupabase()) {
      // Use Supabase authentication
      const isAuthenticated = await supabaseDB.authenticateAdmin(username, password);
      if (isAuthenticated) {
        // For now, return a mock user object since we're just checking credentials
        user = { id: '1', username, email: 'admin@syafigraphy.com' };
      }
    } else {
      // Use local database authentication
      user = await adminDB.authenticate(username, password) as AdminUser | null;
    }

    if (user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful',
        user: { id: user.id, username: user.username, email: user.email }
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 