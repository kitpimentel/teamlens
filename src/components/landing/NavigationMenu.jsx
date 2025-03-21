import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { NavItem } from './NavItem';
import { LanguageSelector } from './LanguageSelector';
import { HelpButton } from './HelpButton';

export const NavigationItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export const DesktopNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      {NavigationItems.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
      
      <div className="flex items-center space-x-2 ml-2">
        <LanguageSelector />
        <HelpButton />
      </div>
    </nav>
  );
};

export const MobileNavigation = ({ isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-b border-gray-100 animate-fadeIn z-30">
      <div className="flex flex-col p-4 space-y-2">
        {NavigationItems.map((item) => (
          <NavItem key={item.label} {...item} isMobile />
        ))}
        
        <div className="flex space-x-2 pt-2 border-t mt-2">
          <LanguageSelector />
          <HelpButton />
        </div>
      </div>
    </div>
  );
};