import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LandingHeader } from '@/components/navigation/LandingHeader';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center">
            <div className="mb-6 inline-block">
              <div className="relative">
                <div className="text-9xl font-bold text-gray-200">404</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <HelpCircle className="h-20 w-20 text-blue-500" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Link to="/">
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-lg font-semibold mb-3">Looking for something specific?</h2>
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search our site..."
                />
              </div>
            </div>
            
            <div className="text-gray-600">
              <h2 className="font-medium mb-3">You might be looking for:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link to="/features" className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  Features
                </Link>
                <Link to="/pricing" className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  Pricing
                </Link>
                <Link to="/about" className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  About Us
                </Link>
                <Link to="/login" className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Team Lens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;