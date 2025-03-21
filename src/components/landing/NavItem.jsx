import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export const NavItem = ({ label, href, isMobile = false }) => {
  return (
    <Link to={href}>
      <Button 
        variant="ghost" 
        className={`text-gray-700 hover:text-primary hover:bg-gray-50 ${
          isMobile ? 'justify-start w-full' : ''
        }`}
      >
        {label}
      </Button>
    </Link>
  );
};
