import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { 
  Home, 
  Search, 
  ArrowLeft, 
  HelpCircle, 
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Not Found Page Component
 * 
 * Displayed when a user navigates to a route that doesn't exist.
 * Provides options to navigate back to relevant sections of the application.
 */
const NotFound = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get the home route based on user role
  const getHomeRoute = () => {
    if (!user) return '/login'
    
    switch (user.role) {
      case 'superAdmin':
        return '/super-admin'
      case 'orgAdmin':
        return '/org-admin'
      case 'teamMember':
        return '/team'
      case 'client':
        return '/client'
      default:
        return '/login'
    }
  }
  
  // Handle search submit (in a real app, this would redirect to search results)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you might redirect to a search page with the query
    // For now, just navigate to the help center
    if (searchQuery.trim()) {
      navigate('/help', { state: { searchQuery } })
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="w-24 h-24 bg-accent/50 rounded-full mx-auto flex items-center justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight">404</h1>
          <h2 className="mt-2 text-2xl font-bold">Page Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for pages, features, or help..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => navigate(getHomeRoute())}
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/help')}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Visit Help Center
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  )
}

export default NotFound