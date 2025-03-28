import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Useful for conditional classes and merging tailwind classes
 * 
 * @param inputs - Class names to be combined
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string into a human-readable format
 * 
 * @param date - Date string or Date object
 * @param includeTime - Whether to include the time
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, includeTime: boolean = false): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

/**
 * Format a number as currency
 * 
 * @param value - Number to format
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value)
}

/**
 * Format a number with commas
 * 
 * @param value - Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

/**
 * Truncate text to a maximum length
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitalize first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get initials from a name
 * 
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return ''
  
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Debounce a function
 * 
 * @param fn - Function to debounce
 * @param ms - Debounce time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

/**
 * Generate a random color based on a string
 * Useful for avatar backgrounds based on user names
 * 
 * @param str - String to generate color from
 * @returns Hex color code
 */
export function stringToColor(str: string): string {
  if (!str) return '#6366f1' // Default color (indigo)
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    '#6366f1', // indigo
    '#f43f5e', // rose
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f59e0b', // amber
    '#ef4444', // red
    '#14b8a6', // teal
    '#f97316', // orange
  ]
  
  // Get a consistent index
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/**
 * Calculate time ago from a date
 * 
 * @param date - Date string or Date object
 * @returns Human-readable time ago string
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  // Define time intervals
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }
  
  // Check each interval
  if (seconds < 5) {
    return 'just now'
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return interval === 1 
        ? `1 ${unit} ago` 
        : `${interval} ${unit}s ago`
    }
  }
  
  return 'just now'
}