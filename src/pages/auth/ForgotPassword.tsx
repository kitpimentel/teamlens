import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"

/**
 * ForgotPassword page component for requesting password reset
 */
const ForgotPassword: React.FC = () => {
  const { forgotPassword, loading } = useAuth()
  
  // Form state
  const [email, setEmail] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    try {
      if (!email) {
        setFormError("Email is required")
        return
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setFormError("Please enter a valid email address")
        return
      }
      
      await forgotPassword(email)
      setSuccess(true)
    } catch (error) {
      // Error is already handled by auth context
      console.error("Password reset request error:", error)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="border shadow-lg">
        {success ? (
          // Success state
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
            <p className="text-muted-foreground mb-4">
              If an account exists with the email <span className="font-medium">{email}</span>, we've sent
              instructions to reset your password.
            </p>
            <div className="flex flex-col gap-4 w-full">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
              >
                Send to another email
              </Button>
              <Link to="/login" className="w-full">
                <Button className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Request state
          <>
            <CardHeader className="space-y-1">
              <div className="flex items-center">
                <Link to="/login" className="mr-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
              </div>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
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
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
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

export default ForgotPassword