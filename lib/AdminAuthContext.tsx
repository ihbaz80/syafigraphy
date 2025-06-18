'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthContextType {
  isLoggedIn: boolean
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Admin credentials (in production, this should be in a secure database)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  }

  useEffect(() => {
    // Check if admin is logged in on component mount
    try {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn')
      const adminUsername = localStorage.getItem('adminUsername')
      
      if (adminLoggedIn === 'true' && adminUsername) {
        setIsLoggedIn(true)
        setUsername(adminUsername)
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      try {
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminUsername', username)
        setIsLoggedIn(true)
        setUsername(username)
        return true
      } catch (error) {
        console.error('Error setting localStorage:', error)
        return false
      }
    }
    return false
  }

  const logout = () => {
    try {
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminUsername')
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
    setIsLoggedIn(false)
    setUsername(null)
    router.push('/admin/login')
  }

  const value = {
    isLoggedIn,
    username,
    login,
    logout,
    loading
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
} 