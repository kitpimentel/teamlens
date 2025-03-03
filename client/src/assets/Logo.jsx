import React from 'react';
import logoSvg from './logo.svg';

const Logo = ({ className, ...props }) => (
  <img 
    src={logoSvg}
    alt="Logo"
    className={`w-12 h-12 transition duration-300 ease-in-out hover:scale-110 ${className}`}
    {...props}
  />
);

export default Logo;