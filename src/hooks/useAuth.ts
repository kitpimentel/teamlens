import { useContext } from "react"
import AuthContext from "../context/AuthContext"

/**
 * Custom hook for accessing authentication functionality
 * 
 * This hook provides a convenient way to access the AuthContext
 * throughout the application without having to import the context directly.
 * 
 * @returns The auth context value containing user data and authentication methods
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
}

export default useAuth