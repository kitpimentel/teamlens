import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

/**
 * ResetPassword page component for setting a new password with a token
 */
const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetPassword, loading } = useAuth()
  
  // Form state
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Password strength indicators (same as signup page)
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

  // Parse token from URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tokenParam = queryParams.get("token")
    
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setTokenError(true)
    }
  }, [location])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    try {
      // Validation
      if (!token) {
        setFormError("Reset token is missing")
        return
      }
      
      if (!password || !confirmPassword) {
        setFormError("Please enter and confirm your new password")
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
      
      await resetPassword(token, password)
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      // Error is already handled by auth context
      console.error("Password reset error:", error)
    }
  }

  // Color for password strength
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "text-destructive"
    if (passwordStrength <= 4) return "text-amber-500"
    return "text-emerald-500"
  }
  
  // Password strength indicator component (same as signup)
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

  // Invalid token error component
  const TokenErrorComponent = () => (
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-xl font-bold mb-2">Invalid or Expired Link</h3>
      <p className="text-muted-foreground mb-4">
        The password reset link is invalid or has expired. Please request a new link.
      </p>
      <Link to="/forgot-password">
        <Button>Request New Link</Button>
      </Link>
    </div>
  )

  // Success message component
  const SuccessMessage = () => (
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">Password Reset Successful</h3>
      <p className="text-muted-foreground mb-4">
        Your password has been reset successfully. You will be redirected to the login page.
      </p>
      <Link to="/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  )

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="border shadow-lg">
        {/* Show error if token is missing or invalid */}
        {tokenError ? (
          <TokenErrorComponent />
        ) : success ? (
          <SuccessMessage />
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
              <CardDescription>
                Create a new password for your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoFocus
                  />
                  {password && <PasswordStrengthIndicator />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                      Resetting password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">
                    Back to login
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

export default ResetPassword