// Updated Login.jsx with sample accounts popup
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import SampleAccountsPopup from "@/components/SampleAccountsPopup";

export default function Login({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSampleAccounts, setShowSampleAccounts] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset loading state
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Login process
    try {
      const user = await login(formData.email, formData.password);
      
      toast.success(`Welcome back, ${user.name}!`, {
        description: "You have successfully logged in."
      });
      
      // Close modal after successful login
      if (onClose) {
        onClose();
      }
      
      // Redirect to dashboard or intended page
      navigate(from, { replace: true });
      
    } catch (error) {
      toast.error("Login failed", {
        description: "Invalid email or password. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    toast.info("Password Reset", {
      description: "A password reset link will be sent to your email.",
      duration: 3000
    });
  };
  
  const handleSelectSampleAccount = (email, password) => {
    setFormData(prev => ({
      ...prev,
      email,
      password
    }));
    
    toast.success("Sample account selected", {
      description: "You can now sign in with this account."
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4 text-primary" />
              Team Lens
            </CardTitle>
            <CardDescription className="text-xs">
              Sign in to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-8 text-sm h-9 focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-8 pr-10 text-sm h-9 focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="rememberMe" className="text-xs text-muted-foreground">
                  Remember me
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full text-sm h-9" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full text-sm h-9 border-dashed"
              onClick={() => setShowSampleAccounts(true)}
            >
              <UserIcon className="w-3.5 h-3.5 mr-2" />
              Use a sample account
            </Button>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-2">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button 
                onClick={onSwitchToSignup}
                className="font-medium text-primary hover:underline text-xs inline-flex items-center"
              >
                <UserPlus className="mr-1 w-3.5 h-3.5" />
                Sign up
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      
      <SampleAccountsPopup 
        isOpen={showSampleAccounts}
        onClose={() => setShowSampleAccounts(false)}
        onSelectAccount={handleSelectSampleAccount}
      />
    </>
  );
}