import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Outlet
} from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import './App.css';
import { isAuthenticated, getCurrentUser } from "@/services/authService";

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/Features'));
const PricingPage = lazy(() => import('./pages/Pricing'));
const AboutPage = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectOverview = lazy(() => import('./pages/ProjectOverview'));
const Projects = lazy(() => import('./pages/Projects'));
const Reports = lazy(() => import('./pages/Reports'));
const Schedule = lazy(() => import('./pages/Schedule'));
const TeamCapacity = lazy(() => import('./pages/TeamCapacity'));
const Tasks = lazy(() => import('./pages/Tasks'));
const NotFound = lazy(() => import('./pages/NotFound'));
// const Settings = lazy(() => import('./pages/Settings'));

// Loading components with different styles
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[70vh]">
    <div className="flex flex-col items-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

const GlobalLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-primary/10">
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
      <Loader2 className="w-16 h-16 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading TeamLens...</p>
    </div>
  </div>
);

// Auth wrapper components
const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate checking auth state with a small delay to prevent flash
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated()) {
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
      setIsChecking(false);
    }, 300);

    return () => clearTimeout(checkAuth);
  }, [navigate, location.pathname]);

  if (isChecking) {
    return <PageLoader />;
  }

  return <Outlet />;
};

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    // Simulate checking auth state with a small delay to prevent flash
    const checkAuth = setTimeout(() => {
      if (isAuthenticated()) {
        navigate(from, { replace: true });
      }
      setIsChecking(false);
    }, 300);

    return () => clearTimeout(checkAuth);
  }, [navigate, from]);

  if (isChecking) {
    return <PageLoader />;
  }

  return <Outlet />;
};

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <GlobalLoader />;
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-background">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing/*" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Auth Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectOverview />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/team" element={<TeamCapacity />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* <Route path="/settings/*" element={<Settings />} /> */}
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;