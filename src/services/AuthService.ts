import { User } from "@/types/user"
import { sleep } from "@/lib/utils"

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
    
    // Mock response - in a real app, this would come from your backend
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      role: "superAdmin", // For demo purposes
      avatar: "",
      createdAt: new Date().toISOString(),
    }
    
    const token = "mock-jwt-token"
    
    return { token, user: mockUser }
  }
  
  /**
   * Register a new user
   */
  static async register(userData: any): Promise<void> {
    // In a real app, this would make an API call
    await sleep(1000) // Simulate API delay
    
    // Mock implementation - in a real app, this would be a real registration
    console.log("User registered:", userData)
  }
  
  /**
   * Get current user data
   */
  static async getCurrentUser(): Promise<User> {
    // In a real app, this would make an API call with the stored token
    await sleep(500) // Simulate API delay
    
    // Mock user - in a real app, this would come from your backend
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "superAdmin", // For demo purposes
      avatar: "",
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
    
    // Mock implementation
    console.log("Password reset email sent to:", email)
  }
  
  /**
   * Reset password with token
   */
  static async resetPassword(token: string, password: string): Promise<void> {
    // In a real app, this would make an API call
    await sleep(1000) // Simulate API delay
    
    // Mock implementation
    console.log("Password reset with token:", token)
  }
}