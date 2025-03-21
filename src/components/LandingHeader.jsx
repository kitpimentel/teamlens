import React, { useState, useEffect } from 'react';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from '@/assets/Logo';
import { DesktopNavigation, MobileNavigation } from './landing/NavigationMenu';
import { Link } from 'react-router-dom';

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Add scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header-container')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);
  
  return (
    <header className={`bg-white sticky top-0 z-40 transition-all duration-200 ${
      scrolled ? 'shadow-sm border-b border-gray-100' : ''
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative header-container">
        <Link to="/landing" className="flex items-center group hover:opacity-90 transition-opacity">
          <Logo className="w-8 h-8 text-primary" />
          <span className="ml-2 font-bold text-xl">Team Lens</span>
        </Link>
        
        {/* Desktop Navigation */}
        <DesktopNavigation />
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation isOpen={isMenuOpen} />
      </div>
    </header>
  );
};