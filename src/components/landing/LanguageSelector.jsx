import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Language"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 animate-fadeIn">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left ${
                currentLanguage === language.name ? 'bg-gray-50 font-medium' : ''
              }`}
              onClick={() => {
                setCurrentLanguage(language.name);
                setIsOpen(false);
              }}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};