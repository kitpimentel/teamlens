import React, { Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import './App.css';

// Correctly import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Global loading component
const GlobalLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
  </div>
);

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-background">
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/landing" replace />} 
            />
            <Route 
              path="/landing/*" 
              element={<LandingPage />} 
            />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/signup" 
              element={<Signup />} 
            />
          </Routes>
        </Suspense>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;