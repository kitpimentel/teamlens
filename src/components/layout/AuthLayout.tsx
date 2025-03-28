import { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Layout component for authentication pages
 * Provides common UI elements and handles redirection for authenticated users
 */
const AuthLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  // Handle initial component mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // If user is already authenticated, redirect to their dashboard
  if (!loading && user) {
    return <Navigate to={getUserHomePage(user.role)} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors closeButton />
      
      <div
        className={cn(
          "transition-opacity duration-500", 
          mounted ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo.svg"
            alt="Team Lens"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            {getPageTitle(location.pathname)}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground max-w">
            {getPageSubtitle(location.pathname)}
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent className="pt-6">
              <Outlet />
            </CardContent>
          </Card>
          
          {/* Footer links */}
          <div className="mt-6 text-center">
            <div className="space-x-4">
              {location.pathname !== '/login' && (
                <a
                  href="/login"
                  className="text-sm font-medium text-primary hover:text-primary/90"
                >
                  Sign in
                </a>
              )}
              
              {location.pathname !== '/signup' && location.pathname.indexOf('/invite/') !== 0 && (
                <a
                  href="/signup"
                  className="text-sm font-medium text-primary hover:text-primary/90"
                >
                  Sign up
                </a>
              )}
              
              {location.pathname !== '/forgot-password' && (
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/90"
                >
                  Forgot password?
                </a>
              )}
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Team Lens. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Gets the appropriate title based on the current path
 */
function getPageTitle(pathname: string): string {
  if (pathname === '/login') return 'Sign in to your account';
  if (pathname === '/signup') return 'Create a new account';
  if (pathname === '/forgot-password') return 'Reset your password';
  if (pathname === '/reset-password') return 'Set new password';
  if (pathname.indexOf('/invite/') === 0) return 'Accept your invitation';
  return 'Team Lens';
}

/**
 * Gets the appropriate subtitle based on the current path
 */
function getPageSubtitle(pathname: string): string {
  if (pathname === '/login') return 'Access your projects and teams';
  if (pathname === '/signup') return 'Start managing your projects with Team Lens';
  if (pathname === '/forgot-password') return 'We\'ll send you a link to reset your password';
  if (pathname === '/reset-password') return 'Enter your new secure password';
  if (pathname.indexOf('/invite/') === 0) return 'Complete your registration to join the team';
  return '';
}

/**
 * Gets the home page for a user based on their role
 */
function getUserHomePage(role?: string): string {
  switch (role) {
    case 'superAdmin':
      return '/super-admin';
    case 'orgAdmin':
      return '/org-admin';
    case 'teamMember':
      return '/team';
    case 'client':
      return '/client';
    default:
      return '/login';
  }
}

export default AuthLayout;