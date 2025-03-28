import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * Login page component for user authentication
 */
const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [showDemoHelper, setShowDemoHelper] = useState(false)

  // Check for redirect message from other pages
  const queryParams = new URLSearchParams(location.search)
  const redirectMessage = queryParams.get("message")

  // Function to navigate to signup page
  const goToSignup = () => navigate("/signup")

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    try {
      if (!email || !password) {
        setFormError("Email and password are required")
        return
      }
      
      await login(email, password)
      // After successful login, the user will be redirected by App.tsx
      // But we could also explicitly navigate if needed:
      // navigate("/dashboard")
    } catch (error) {
      // Error is already handled by auth context
      console.error("Login error:", error)
    }
  }

  // Helper text for demo login
  const demoLogins = [
    { email: "super@example.com", description: "Super Admin", color: "bg-indigo-100 dark:bg-indigo-950" },
    { email: "org@example.com", description: "Organization Admin", color: "bg-rose-100 dark:bg-rose-950" },
    { email: "team@example.com", description: "Team Member", color: "bg-emerald-100 dark:bg-emerald-950" },
    { email: "client@example.com", description: "Client", color: "bg-amber-100 dark:bg-amber-950" },
  ]

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        {redirectMessage && (
          <div className="px-6">
            <Alert className="bg-primary/10 border-primary text-foreground">
              <AlertDescription>{redirectMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {formError && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary" 
                onClick={goToSignup}
              >
                Sign up
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Demo helper toggle */}
      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDemoHelper(!showDemoHelper)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {showDemoHelper ? "Hide demo info" : "Show demo login info"}
        </Button>
      </div>
      
      {/* Demo helper section */}
      {showDemoHelper && (
        <div className="mt-2 p-4 rounded-lg border bg-muted/50 shadow-sm transition-all">
          <h3 className="font-medium mb-2">Demo Accounts</h3>
          <p className="text-sm text-muted-foreground mb-3">
            For demo purposes, you can log in with any of these email prefixes (use any password):
          </p>
          <div className="space-y-2">
            {demoLogins.map((demo) => (
              <div 
                key={demo.email} 
                className={`text-sm px-3 py-2 rounded flex justify-between cursor-pointer hover:bg-background ${demo.color}`}
                onClick={() => setEmail(demo.email)}
              >
                <span className="font-medium">{demo.email}</span>
                <span>{demo.description}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Note: This is for demonstration purposes only. In a production environment, real authentication would be implemented.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login