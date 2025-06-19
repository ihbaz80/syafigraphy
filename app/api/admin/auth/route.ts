import { NextRequest, NextResponse } from 'next/server'
import { adminDB } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const user = adminDB.authenticate(username, password)
    
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