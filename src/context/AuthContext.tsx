import { createContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

// Define user type
export interface User {
  id: string
  name: string
  email: string
  role: 'superAdmin' | 'orgAdmin' | 'teamMember' | 'client'
  organizationId?: string
  avatar?: string
}

// Define context type
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  inviteSignup: (token: string, name: string, password: string) => Promise<void>
}

// Create context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider component that wraps the application
 * Manages authentication state and provides auth-related functions
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock API URL - will be replaced with real API when backend is ready
  // const API_URL = 'http://localhost:5000/api'

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored token and user data
        const token = localStorage.getItem('accessToken')
        if (!token) {
          setLoading(false)
          return
        }

        // Get stored user from localStorage (for mock implementation)
        const storedUser = localStorage.getItem('team-lens-user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // If no user data but token exists, clear tokens (invalid state)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('deviceId')
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
        // Clear tokens if auth check fails
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('deviceId')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Login function
   * Authenticates user and stores JWT tokens
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      // Mock different user types for testing
      let mockUser: User | null = null
      let accessToken = 'mock-access-token-' + Math.random().toString(36).substring(2)
      let refreshToken = 'mock-refresh-token-' + Math.random().toString(36).substring(2)
      let deviceId = 'mock-device-id-' + Math.random().toString(36).substring(2)
      
      if (email.startsWith('super@')) {
        mockUser = {
          id: 'sa-1',
          name: 'Super Admin',
          email,
          role: 'superAdmin',
          avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff'
        }
      } else if (email.startsWith('org@')) {
        mockUser = {
          id: 'oa-1',
          name: 'Organization Admin',
          email,
          role: 'orgAdmin', 
          organizationId: 'org-1',
          avatar: 'https://ui-avatars.com/api/?name=Org+Admin&background=f43f5e&color=fff'
        }
      } else if (email.startsWith('team@')) {
        mockUser = {
          id: 'tm-1',
          name: 'Team Member',
          email,
          role: 'teamMember',
          organizationId: 'org-1',
          avatar: 'https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff'
        }
      } else if (email.startsWith('client@')) {
        mockUser = {
          id: 'cl-1',
          name: 'Client User',
          email,
          role: 'client',
          organizationId: 'client-org-1',
          avatar: 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff'
        }
      } else {
        // Default to team member for demo
        mockUser = {
          id: 'u-' + Math.random().toString(36).substring(2, 9),
          name: 'Demo User',
          email,
          role: 'teamMember',
          organizationId: 'org-1',
          avatar: `https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff`
        }
      }
      
      if (mockUser) {
        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('deviceId', deviceId)
        localStorage.setItem('team-lens-user', JSON.stringify(mockUser))
        
        setUser(mockUser)
        toast.success(`Welcome back, ${mockUser.name}!`)
      } else {
        throw new Error('Invalid credentials')
      }
      
      /* REAL IMPLEMENTATION (uncomment when backend is ready)
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      })
      
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('deviceId', data.deviceId)
      
      setUser(data.user)
      */
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Signup function
   * Registers a new user
   */
  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Basic validation
      if (!name || !email || !password) {
        throw new Error('All fields are required')
      }
      
      /* REAL IMPLEMENTATION (uncomment when backend is ready)
      await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      })
      
      // After successful signup, login the user
      await login(email, password)
      */
      
      // For mock, just show success message and don't auto-login
      toast.success('Registration successful! Please log in.')
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout function
   * Removes tokens and user data
   */
  const logout = async () => {
    try {
      setLoading(true)
      
      // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      
      /* REAL IMPLEMENTATION (uncomment when backend is ready)
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        // Invalidate refresh token on server
        await axios.post(
          `${API_URL}/auth/logout`,
          { 
            refreshToken,
            deviceId: localStorage.getItem('deviceId')
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
      }
      */
      
      // Clear local storage and state
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('deviceId')
      localStorage.removeItem('team-lens-user')
      
      setUser(null)
      toast.success('You have been successfully logged out')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Error during logout')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Forgot password function
   * Initiates password reset process
   */
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation
      if (!email) {
        throw new Error('Email is required')
      }
      
      /* REAL IMPLEMENTATION (uncomment when backend is ready)
      await axios.post(`${API_URL}/auth/forgot-password`, { email })
      */
      
      toast.success('If an account exists with that email, a password reset link has been sent')
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reset password function
   * Completes password reset with token from email
   */
  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation
      if (!token || !password) {
        throw new Error('Token and password are required')
      }
      
      /* REAL IMPLEMENTATION (uncomment when backend is ready)
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      })
      */
      
      toast.success('Password has been reset successfully! Please log in with your new password.')
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Invite signup function
   * Handles user registration from invitation link
   */
  const inviteSignup = async (token: string, name: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // MOCK IMPLEMENTATION - Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Basic validation
      if (!token || !name || !password) {
        throw new Error('All fields are required')
      }
      
      /* REAL IMPLEMENTATION (uncomment when backend is ready)
      const { data } = await axios.post(`${API_URL}/auth/invite-signup`, {
        token,
        name,
        password,
      })
      
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('deviceId', data.deviceId)
      
      setUser(data.user)
      */
      
      // For mock, just show success
      toast.success('Account created successfully! Please log in.')
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete invitation signup'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    inviteSignup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext