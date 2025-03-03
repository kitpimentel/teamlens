import React from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from "lucide-react";

// Import components
import { LandingHeader } from '../components/LandingHeader';
import { FeatureSection } from '../components/FeatureSection';
import { AuthOverlay } from '../components/AuthOverlay';
import { MobileAuthButtons } from '../components/MobileAuthButtons';

// Import Login and Signup components
import Login from './Login';
import Signup from './Signup';

// Modal Wrapper Component
const AuthModal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md relative"
    >
      <button
        onClick={onClose}
        className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/landing/login');
  };

  const handleSignup = () => {
    navigate('/landing/signup');
  };

  const handleCloseModal = () => {
    navigate('/landing');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <LandingHeader />

        {/* Main Content with Responsive Layout */}
        <main className="flex-1 flex flex-col md:flex-row">
          {/* Left Side - Content */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">
              Welcome to <span className="relative">
                Team Lens
                <span className="absolute bottom-0 left-0 w-full h-1 bg-primary"></span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 text-center md:text-left">
              Visualize your team's potential. Transform your workflow.
            </p>

            {/* Feature Section */}
            <div className="space-y-6 max-w-xl mx-auto md:mx-0">
              <FeatureSection />
            </div>

            {/* Mobile and Tablet Auth Buttons */}
            <div className="mt-8 md:hidden">
              <MobileAuthButtons
                onSignup={handleSignup}
                onLogin={handleLogin}
              />
            </div>
          </div>

          {/* Right Side - Auth Card (Desktop) */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 lg:p-12">
            <AuthOverlay
              onSignup={handleSignup}
              onLogin={handleLogin}
            />
          </div>
        </main>
      </div>

      {/* Nested Routes for Auth Modals */}
      <Routes>
        <Route
          path="login"
          element={
            <AuthModal onClose={handleCloseModal}>
              <Login
                onClose={handleCloseModal}
                onSwitchToSignup={() => navigate('/landing/signup')}
              />
            </AuthModal>
          }
        />
        <Route
          path="signup"
          element={
            <AuthModal onClose={handleCloseModal}>
              <Signup
                onClose={handleCloseModal}
                onSwitchToLogin={() => navigate('/landing/login')}
              />
            </AuthModal>
          }
        />
      </Routes>
    </>
  );
}

export default LandingPage;