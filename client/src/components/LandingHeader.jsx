import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import Logo from '@/assets/Logo';

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        <div className="flex items-center">
          <Logo className="w-8 h-8 text-primary" />
          <span className="ml-2 font-bold text-xl">Team Lens</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">About</Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" aria-label="Language">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Help">
              <span className="rounded-full w-5 h-5 border border-gray-700 flex items-center justify-center">?</span>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
            <div className="flex flex-col p-4 space-y-2">
              <Button variant="ghost" className="justify-start">Features</Button>
              <Button variant="ghost" className="justify-start">Pricing</Button>
              <Button variant="ghost" className="justify-start">About</Button>
              
              <div className="flex space-x-2 pt-2 border-t">
                <Button variant="ghost" size="icon" aria-label="Language">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Help">
                  <span className="rounded-full w-5 h-5 border border-gray-700 flex items-center justify-center">?</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};