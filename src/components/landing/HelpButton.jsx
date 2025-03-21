import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

export const HelpButton = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Help"
        onClick={() => setIsHelpOpen(!isHelpOpen)}
      >
        <span className="rounded-full w-5 h-5 border border-gray-700 flex items-center justify-center">?</span>
      </Button>
      
      {isHelpOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-3 z-50 border border-gray-100 animate-fadeIn">
          <h3 className="font-medium text-sm mb-1">Need help?</h3>
          <p className="text-xs text-gray-600 mb-2">
            Get support from our team or browse our documentation.
          </p>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              Contact Support
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              Documentation
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              FAQs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};