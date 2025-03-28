import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2 } from "lucide-react"

/**
 * Signup page component for new user registration
 */
const Signup: React.FC = () => {
  const navigate = useNavigate()
  const { signup, loading } = useAuth()
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  
  const passwordStrength = [
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length

  // Color for password strength
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "text-destructive"
    if (passwordStrength <= 4) return "text-amber-500"
    return "text-emerald-500"
  }
  
  // Function to redirect to login page
  const goToLogin = () => navigate("/login")
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setFormError("All fields are required")
        return
      }
      
      if (password !== confirmPassword) {
        setFormError("Passwords do not match")
        return
      }
      
      if (passwordStrength < 3) {
        setFormError("Please use a stronger password")
        return
      }
      
      await signup(name, email, password)
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(goToLogin, 2000)
    } catch (error) {
      // Error is already handled by auth context
      console.error("Signup error:", error)
    }
  }

  // Password strength indicator component
  const PasswordStrengthIndicator = () => (
    <div className="mt-2">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs">Password strength:</span>
          <span className={`text-xs font-medium ${getStrengthColor()}`}>
            {passwordStrength === 0 ? "Very Weak" : 
             passwordStrength === 1 ? "Weak" : 
             passwordStrength === 2 ? "Fair" : 
             passwordStrength === 3 ? "Good" : 
             passwordStrength === 4 ? "Strong" : "Very Strong"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              passwordStrength <= 2 ? "bg-destructive" : 
              passwordStrength <= 4 ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${(passwordStrength / 5) * 100}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex items-center gap-1">
          <div className={`h-3 w-3 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-muted'}`} />
          <span className="text-xs">Min. 8 characters</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`h-3 w-3 rounded-full ${hasUpperCase ? 'bg-emerald-500' : 'bg-muted'}`} />
          <span className="text-xs">Uppercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`h-3 w-3 rounded-full ${hasLowerCase ? 'bg-emerald-500' : 'bg-muted'}`} />
          <span className="text-xs">Lowercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`h-3 w-3 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-muted'}`} />
          <span className="text-xs">Number</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`h-3 w-3 rounded-full ${hasSpecialChar ? 'bg-emerald-500' : 'bg-muted'}`} />
          <span className="text-xs">Special character</span>
        </div>
      </div>
    </div>
  )

  // Success message component
  const SuccessMessage = () => (
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">Registration Successful</h3>
      <p className="text-muted-foreground mb-4">
        Your account has been created successfully. Redirecting you to the login page...
      </p>
      <Button onClick={goToLogin}>Go to Login</Button>
    </div>
  )

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="border shadow-lg">
        {success ? (
          <SuccessMessage />
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Enter your information to create your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  {password && <PasswordStrengthIndicator />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                {formError && (
                  <div className="text-sm text-destructive">{formError}</div>
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
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}

export default Signup