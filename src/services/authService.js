// src/services/authService.js
// Mock authentication service with sample accounts

// Sample user accounts
const sampleAccounts = [
  {
    id: 1,
    email: "admin@teamlens.com",
    password: "admin123",
    name: "Admin User",
    role: "Administrator",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0096c7&color=fff"
  },
  {
    id: 2,
    email: "john.doe@teamlens.com",
    password: "password123",
    name: "John Doe",
    role: "Project Manager",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=7209b7&color=fff"
  },
  {
    id: 3,
    email: "jane.smith@teamlens.com",
    password: "designer123",
    name: "Jane Smith",
    role: "UX Designer",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=4cc9f0&color=fff"
  }
];

// Store the current user in local storage
export const getCurrentUser = () => {
  const userString = localStorage.getItem('currentUser');
  return userString ? JSON.parse(userString) : null;
};

// Login function
export const login = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user exists
  const user = sampleAccounts.find(
    account => account.email === email && account.password === password
  );
  
  if (user) {
    // Create a user object without the password
    const userToStore = { ...user };
    delete userToStore.password;
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    return userToStore;
  }
  
  throw new Error("Invalid email or password");
};

// Enhanced logout function with promise support for better error handling
export const logout = async (navigate) => {
  try {
    // Simulate network delay (e.g., for API call to invalidate session)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    
    // Clear any other auth-related data from localStorage or sessionStorage
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userSettings');
    
    // If navigate function is provided, redirect to landing
    if (navigate) {
      navigate('/landing');
    }
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, we should still clear localStorage
    localStorage.removeItem('currentUser');
    
    // If navigate function is provided, redirect to landing even on error
    if (navigate) {
      navigate('/landing');
    }
    
    throw error;
  }
};

// Also expose the old non-async version for backward compatibility
export const logoutSync = () => {
  localStorage.removeItem('currentUser');
  return true;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Refresh user data from storage (useful after preferences update)
export const refreshUserData = () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    return currentUser;
  }
  return null;
};

// For the updated Settings component to work correctly
export const logoutUser = logout;