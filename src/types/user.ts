/**
 * User interface
 * Represents a user in the system
 */
export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  createdAt: string
  organizationId?: string
}

/**
 * Organization interface
 * Represents an organization in the system
 */
export interface Organization {
  id: string
  name: string
  logo?: string
  industry?: string
  createdAt: string
  usersCount: number
  projectsCount: number
  subscription?: string
  isActive: boolean
}

/**
 * User invitation interface
 */
export interface UserInvitation {
  id: string
  email: string
  role: string
  organizationId: string
  createdAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired'
  invitedBy: string
}

/**
 * Authentication context state
 */
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
}