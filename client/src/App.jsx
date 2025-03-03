import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import './App.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectOverview = lazy(() => import('./pages/ProjectOverview'));
const Projects = lazy(() => import('./pages/Projects'));
const Reports = lazy(() => import('./pages/Reports'));
const Schedule = lazy(() => import('./pages/Schedule'));
const TeamCapacity = lazy(() => import('./pages/TeamCapacity'));
const Tasks = lazy(() => import('./pages/Tasks'));

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
            <Route
              path="/dashboard/*"
              element={<Dashboard />}
            />
            <Route
              path="/projects"
              element={<Projects />}
            />
            <Route
              path="/project/:id"
              element={<ProjectOverview />}
            />
            <Route
              path="/reports"
              element={<Reports />}
            />
            <Route
              path="/schedule"
              element={<Schedule />}
            />
            <Route
              path="/team"
              element={<TeamCapacity />}
            />
            <Route
              path="/tasks"
              element={<Tasks />}
            />
          </Routes>
        </Suspense>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;