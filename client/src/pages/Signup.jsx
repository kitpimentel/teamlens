import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus, LogIn, Mail, Lock, User, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

export default function Signup({ onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    // Form validation logic...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Signup submission logic...
  };

  const getPasswordStrength = (password) => {
    // Password strength checker logic...
  };

  const passwordStrength = formData.password 
    ? getPasswordStrength(formData.password) 
    : null;

  return (
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
            <UserPlus className="w-4 h-4 text-primary" />  
            Create Account
          </CardTitle>
          <CardDescription className="text-xs">
            Join Team Lens  
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">  
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs">Full Name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  ref={nameRef}
                  id="name"
                  name="name"  
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={formErrors.name ? "true" : "false"}
                  aria-describedby="name-error"
                  className={`pl-8 text-sm h-9 focus:ring-1 focus:ring-primary focus:border-primary ${formErrors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {formErrors.name && (
                <p id="name-error" className="text-red-500 text-xs mt-1">
                  {formErrors.name}
                </p>  
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">  
              <Label htmlFor="email" className="text-xs">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input  
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}  
                  onChange={handleChange}
                  aria-invalid={formErrors.email ? "true" : "false"}
                  aria-describedby="email-error"  
                  className={`pl-8 text-sm h-9 focus:ring-1 focus:ring-primary focus:border-primary ${formErrors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {formErrors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {formErrors.email}
                </p>
              )}  
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>  
                    <TooltipContent>
                      <p>Password requirements</p>  
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>  
              </div>
              
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword.password ? "text" : "password"}  
                  required
                  value={formData.password}
                  onChange={handleChange}  
                  aria-invalid={formErrors.password ? "true" : "false"}
                  aria-describedby="password-error"
                  className={`pl-8 pr-10 text-sm h-9 focus:ring-1 focus:ring-primary focus:border-primary ${formErrors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary w-3.5 h-3.5"
                >
                  {showPassword.password ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}  
                </button>
              </div>
              {formData.password && (
                <div className="flex items-center text-xs mt-1">
                  <CheckCircle2 
                    className={`mr-1 w-3.5 h-3.5 ${
                      passwordStrength === 'strong' 
                        ? 'text-green-500' 
                        : passwordStrength === 'medium'
                        ? 'text-yellow-500'  
                        : 'text-red-500'
                    }`} 
                  />
                  Password strength: {passwordStrength}  
                </div>
              )}
              {formErrors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )} 
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
              <div className="relative">  
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  ref={confirmPasswordRef}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={formErrors.confirmPassword ? "true" : "false"}
                  aria-describedby="confirm-password-error"
                  className={`pl-8 pr-10 text-sm h-9 focus:ring-1 focus:ring-primary focus:border-primary ${formErrors.confirmPassword ? 'border-red-500' : ''}`}  
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary w-3.5 h-3.5"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p id="confirm-password-error" className="text-red-500 text-xs mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">  
              <input
                type="checkbox"
                id="terms"  
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                aria-invalid={formErrors.terms ? "true" : "false"} 
                aria-describedby="terms-error"
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground">
                I accept the{" "} 
                <button 
                  type="button"
                  onClick={() => toast.info("Terms of service details coming soon!")}
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </button>
                &
                <button 
                  type="button"
                  onClick={() => toast.info("Privacy Policy details coming soon!")}
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </button>
              </Label>
            </div>
            {formErrors.terms && (
              <p id="terms-error" className="text-red-500 text-xs">
                {formErrors.terms}
              </p>
            )}  

            {/* Submit Button */}  
            <Button 
              type="submit"
              className="w-full text-sm h-9"
              disabled={isLoading}  
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>  
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2">
          <p className="text-xs text-muted-foreground">  
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-primary hover:underline text-xs inline-flex items-center"
            >
              <LogIn className="mr-1 w-3.5 h-3.5" />
              Sign in  
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );  
}