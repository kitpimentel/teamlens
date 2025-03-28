import React, { createContext, useContext, useEffect, useState } from "react"

/**
 * Available theme options for the application
 */
type Theme = "dark" | "light" | "system"

/**
 * Properties that will be exposed by the ThemeContext
 */
interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: Theme
}

/**
 * Properties for the ThemeProvider component
 */
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

/**
 * Create the Theme context with default values
 */
const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => null,
  systemTheme: "light",
})

/**
 * ThemeProvider component that manages the application theme
 * 
 * @param children - React components that will have access to the theme context
 * @param defaultTheme - The default theme to use if none is stored
 * @param storageKey - The key to use for storing theme preference in localStorage
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "team-lens-theme",
}: ThemeProviderProps) {
  // Get the initial theme from localStorage or use the default
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  
  // Track the system theme preference
  const [systemTheme, setSystemTheme] = useState<Theme>("light")

  // Function to update the theme and sync it with localStorage and DOM
  const updateTheme = (newTheme: Theme) => {
    // Store the theme preference
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)

    // Get the actual theme value (accounting for system preference)
    const resolvedTheme = newTheme === "system" ? systemTheme : newTheme
    
    // Update the document element class for the theme
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme
  }

  // Watch for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    // Set the initial system theme based on media query
    setSystemTheme(mediaQuery.matches ? "dark" : "light")
    
    // Update the theme if the current theme is set to follow system
    if (theme === "system") {
      updateTheme("system")
    }

    // Listen for changes to system preference
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light"
      setSystemTheme(newSystemTheme)
      
      // If the current theme is set to follow system, update the applied theme
      if (theme === "system") {
        updateTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // Initialize theme on component mount
  useEffect(() => {
    updateTheme(theme)
  }, [theme, systemTheme])

  // Provide the theme context to children
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: updateTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to use the theme context
 * 
 * @returns The theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  return context
}