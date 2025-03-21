import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";

export const MobileAuthButtons = ({ onSignup, onLogin }) => {
  return (
    <motion.div 
      className="lg:hidden mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button 
        className="w-full sm:w-auto"
        onClick={onSignup}
        variant="default"
      >
        <UserPlus className="mr-2 h-4 w-4" /> Sign Up
      </Button>
      <Button 
        variant="outline" 
        className="w-full sm:w-auto"
        onClick={onLogin}
      >
        <LogIn className="mr-2 h-4 w-4" /> Log In
      </Button>
    </motion.div>
  );
};