import { User } from "@/types/user"
import { sleep } from "@/lib/utils"
import { getMockUserByEmail, mockSuperAdmin } from "@/mocks/mockUsers"

/**
 * Service for handling authentication-related API calls
 */
export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(email: string, password: string): Promise<{ token: string, user: User }> {
    // In a real app, this would make an API call
    await sleep(1000) // Simulate API delay
    
    // Check password (simple validation for mock)
    if (!password || password.length < 6) {
      throw new Error("Invalid credentials")
    }
    
    // Find user by email from mock data
    const user = getMockUserByEmail(email)
    
    if (!user) {
      // Create a demo user based on email pattern
      if (email.includes("super") || email.includes("admin")) {
        return {
          token: "mock-super-admin-token",
          user: mockSuperAdmin
        }
      }
      
      // Default role based on email domain
      let role = "teamMember"
      if (email.includes("client")) role = "client"
      if (email.includes("admin") || email.includes("org@")) role = "orgAdmin"
      
      const defaultUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0].replace(/[.]/g, " ").replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        ),
        email,
        role,
        organizationId: role !== "superAdmin" ? "org-1" : undefined,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          email.split("@")[0].replace(/[.]/g, " ")
        )}&background=6366f1&color=fff`,
        createdAt: new Date().toISOString(),
      }
      
      return {
        token: `mock-${role}-token`,
        user: defaultUser
      }
    }
    
    // Return mock token and user
    return {
      token: `mock-${user.role}-token-${user.id}`,
      user
    }
  }
  
  /**
   * Register a new user
   */
  static async register(userData: {
    name: string,
    email: string,
    password: string
  }): Promise<void> {
    // In a real app, this would make an API call
    await sleep(1000) // Simulate API delay
    
    // Basic validation
    if (!userData.email || !userData.name || !userData.password) {
      throw new Error("All fields are required")
    }
    
    if (userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }
    
    // Check if user already exists
    const existingUser = getMockUserByEmail(userData.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }
    
    // Mock implementation - in a real app, this would be a real registration
    console.log("User registered:", userData.name, userData.email)
  }
  
  /**
   * Get current user data
   */
  static async getCurrentUser(token?: string): Promise<User> {
    // In a real app, this would make an API call with the stored token
    await sleep(500) // Simulate API delay
    
    if (!token) {
      throw new Error("Authentication required")
    }
    
    // Determine user role from token (for mock implementation)
    let role = "teamMember"
    if (token.includes("super")) role = "superAdmin"
    if (token.includes("org")) role = "orgAdmin"
    if (token.includes("client")) role = "client"
    
    // Parse user ID from token if available
    const idMatch = token.match(/token-(.+)$/)
    const userId = idMatch ? idMatch[1] : `user-${Date.now()}`
    
    // Mock user based on token info
    const mockUser: User = {
      id: userId,
      name: role === "superAdmin" ? "Admin User" : `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      email: `${role}@example.com`,
      role,
      organizationId: role !== "superAdmin" ? "org-1" : undefined,
      avatar: `https://ui-avatars.com/api/?name=${role}+User&background=6366f1&color=fff`,
      createdAt: new Date().toISOString(),
    }
    
    return mockUser
  }
  
  /**
   * Send forgot password email
   */
  static async forgotPassword(email: string): Promise<void> {
    // In a real app, this would make an API call
    await sleep(1000) // Simulate API delay
    
    // Basic validation
    if (!email) {
      throw new Error("Email is required")
    }
    
    // Mock implementation
    console.log("Password reset email sent to:", email)
  }
  
  /**
   * Reset password with token
   */
  static async resetPassword(token: string, password: string): Promise<void> {
    // In a real app, this would make an API call
    await sleep(1000) // Simulate API delay
    
    // Basic validation
    if (!token) {
      throw new Error("Invalid reset token")
    }
    
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }
    
    // Mock implementation
    console.log(`Password reset with token: ${token.substring(0, 8)}...`, password.length)
  }
  
  /**
   * Process user invitation
   */
  static async processInvitation(token: string, userData: {
    name: string,
    password: string
  }): Promise<void> {
    // In a real app, this would make an API call
    await sleep(1500) // Simulate API delay
    
    // Basic validation
    if (!token) {
      throw new Error("Invalid invitation token")
    }
    
    if (!userData.name) {
      throw new Error("Name is required")
    }
    
    if (!userData.password || userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }
    
    // Mock implementation
    console.log(`Invitation processed for ${userData.name}`)
  }
}