import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthOverlay = ({ onSignup, onLogin }) => {
  const socialButtons = [
    {
      name: 'Google',
      icon: (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="mr-2 h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      )
    },

  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join thousands of teams already using Team Lens to optimize their resources, plan capacity, and deliver projects on time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full"
            onClick={onSignup}
          >
            <Mail className="mr-2 h-4 w-4" /> Sign Up with Email
          </Button>
          
          {socialButtons.map((button) => (
            <Button 
              key={button.name} 
              variant="outline" 
              className="w-full"
            >
              {button.icon}
              Sign up with {button.name}
            </Button>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-xs text-center text-gray-500">
            By continuing you agree to our 
            <button className="mx-1 text-primary hover:underline">
              Terms & Conditions
            </button>
            and
            <button className="ml-1 text-primary hover:underline">
              Privacy Policy
            </button>
          </p>
          <p className="text-sm text-center">
            Already have an account?
            <button 
              onClick={onLogin}
              className="ml-1 text-primary hover:underline font-medium"
            >
              Log In
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};