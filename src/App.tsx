import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import AuthLayout from "./components/layout/AuthLayout"
import DashboardLayout from "./components/layout/DashboardLayout"
import LandingLayout from "./components/layout/LandingLayout"

// Landing Page
import LandingPage from "./pages/landing/LandingPage"

// Auth Pages
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import InviteSignup from "./pages/auth/InviteSignup"

// Super Admin Pages
import SuperAdminDashboard from "./pages/superAdmin/Dashboard"
import UserManagement from "./pages/superAdmin/UserManagement"
import OrganizationManagement from "./pages/superAdmin/OrganizationManagement"
import PlatformSettings from "./pages/superAdmin/PlatformSettings"
import IntegrationsManagement from "./pages/superAdmin/IntegrationsManagement"
import SuperAdminReports from "./pages/superAdmin/Reports"

// Organization Admin Pages
import OrgDashboard from "./pages/orgAdmin/Dashboard"
import OrgUserManagement from "./pages/orgAdmin/UserManagement"
import TeamInvitations from "./pages/orgAdmin/TeamInvitations"
import ProjectManagement from "./pages/orgAdmin/ProjectManagement"
import OrgSettings from "./pages/orgAdmin/Settings"
import TeamCapacity from "./pages/orgAdmin/TeamCapacity"
import ScheduleManagement from "./pages/orgAdmin/ScheduleManagement"
import ProjectDetail from "./pages/orgAdmin/ProjectDetail"
import AutomatedReporting from "./pages/orgAdmin/AutomatedReporting"
import TaskManagement from "./pages/orgAdmin/TaskManagement"
import MeetingIntegration from "./pages/orgAdmin/MeetingIntegration"
import OrgChat from "./pages/orgAdmin/Chat"

// Team Member Pages
import MyTasks from "./pages/teamMember/MyTasks"
import TaskDetails from "./pages/teamMember/TaskDetails"
import CollaborationBoard from "./pages/teamMember/CollaborationBoard"
import ProjectOverview from "./pages/teamMember/ProjectOverview"
import WorkReports from "./pages/teamMember/WorkReports"
import TeamChat from "./pages/teamMember/Chat"

// Client Pages
// import ClientDashboard from "./pages/client/Dashboard"
// import ReportsInsights from "./pages/client/ReportsInsights"
// import ProjectTimeline from "./pages/client/ProjectTimeline"
// import FeedbackRequests from "./pages/client/FeedbackRequests"
// import NotificationsAlerts from "./pages/client/NotificationsAlerts"
// import ClientChat from "./pages/client/Chat"

// Shared Pages
// import ProfileSettings from "./pages/shared/ProfileSettings"
// import NotificationCenter from "./pages/shared/NotificationCenter"
// import HelpCenter from "./pages/shared/HelpCenter"
// import IntegrationsPage from "./pages/shared/IntegrationsPage"
// import NotFound from "./pages/shared/NotFound"

/**
 * Main application component that handles routing
 */
function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Landing page */}
      <Route element={<LandingLayout />}>
        <Route 
          path="/" 
          element={
            user ? <Navigate to={getUserHomePage(user.role)} /> : <LandingPage />
          } 
        />
      </Route>

      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to={getUserHomePage(user.role)} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={getUserHomePage(user.role)} /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/invite/:token" element={<InviteSignup />} />
      </Route>

      {/* Protected routes */}
      <Route element={<DashboardLayout />}>
        {/* Root redirect for authenticated users */}
        {/* <Route path="/dashboard" element={<Navigate to={getUserHomePage(user?.role)} />} /> */}

        {/* Super Admin routes */}
        <Route path="/super-admin">
          <Route 
            index 
            element={
              <ProtectedRoute role="superAdmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute role="superAdmin">
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="organizations" 
            element={
              <ProtectedRoute role="superAdmin">
                <OrganizationManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute role="superAdmin">
                <PlatformSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="integrations" 
            element={
              <ProtectedRoute role="superAdmin">
                <IntegrationsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reports" 
            element={
              <ProtectedRoute role="superAdmin">
                <SuperAdminReports />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Organization Admin routes */}
        <Route path="/org-admin">
          <Route 
            index 
            element={
              <ProtectedRoute role="orgAdmin">
                <OrgDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute role="orgAdmin">
                <OrgUserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="invitations" 
            element={
              <ProtectedRoute role="orgAdmin">
                <TeamInvitations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="projects" 
            element={
              <ProtectedRoute role="orgAdmin">
                <ProjectManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="projects/:id" 
            element={
              <ProtectedRoute role="orgAdmin">
                <ProjectDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute role="orgAdmin">
                <OrgSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="capacity" 
            element={
              <ProtectedRoute role="orgAdmin">
                <TeamCapacity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="schedule" 
            element={
              <ProtectedRoute role="orgAdmin">
                <ScheduleManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reports" 
            element={
              <ProtectedRoute role="orgAdmin">
                <AutomatedReporting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="tasks" 
            element={
              <ProtectedRoute role="orgAdmin">
                <TaskManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="meetings" 
            element={
              <ProtectedRoute role="orgAdmin">
                <MeetingIntegration />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="chat" 
            element={
              <ProtectedRoute role="orgAdmin">
                <OrgChat />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Team Member routes */}
        <Route path="/team">
          <Route 
            index 
            element={
              <ProtectedRoute role="teamMember">
                <MyTasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="tasks/:id" 
            element={
              <ProtectedRoute role="teamMember">
                <TaskDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collaboration" 
            element={
              <ProtectedRoute role="teamMember">
                <CollaborationBoard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="projects/:id" 
            element={
              <ProtectedRoute role="teamMember">
                <ProjectOverview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reports" 
            element={
              <ProtectedRoute role="teamMember">
                <WorkReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="chat" 
            element={
              <ProtectedRoute role="teamMember">
                <TeamChat />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Client routes */}
        {/* <Route path="/client">
          <Route 
            index 
            element={
              <ProtectedRoute role="client">
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reports" 
            element={
              <ProtectedRoute role="client">
                <ReportsInsights />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="timeline" 
            element={
              <ProtectedRoute role="client">
                <ProjectTimeline />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="feedback" 
            element={
              <ProtectedRoute role="client">
                <FeedbackRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="notifications" 
            element={
              <ProtectedRoute role="client">
                <NotificationsAlerts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="chat" 
            element={
              <ProtectedRoute role="client">
                <ClientChat />
              </ProtectedRoute>
            } 
          />
        </Route> */}

        {/* Shared routes (available to all authenticated users) */}
        {/* <Route 
          path="/profile" 
          element={
            <ProtectedRoute role="">
              <ProfileSettings />
            </ProtectedRoute>
          } 
        /> */}
        
        {/* <Route 
          path="/notifications" 
          element={
            <ProtectedRoute role="">
              <NotificationCenter />
            </ProtectedRoute>
          } 
        /> */}
        {/* <Route 
          path="/help" 
          element={
            <ProtectedRoute role="">
              <HelpCenter />
            </ProtectedRoute>
          } 
        /> */}
        {/* <Route 
          path="/integrations" 
          element={
            <ProtectedRoute role="">
              <IntegrationsPage />
            </ProtectedRoute>
          } 
        /> */}
        
      </Route>
      {/* 404 Not Found */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}

/**
 * Protected route component that restricts access based on user role
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  role: string
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (role && user.role !== role) {
    return <Navigate to={getUserHomePage(user.role)} />
  }
  
  return <>{children}</>
}

/**
 * Gets the home page for a user based on their role
 */
function getUserHomePage(role?: string): string {
  switch (role) {
    case 'superAdmin':
      return '/super-admin'
    case 'orgAdmin':
      return '/org-admin'
    case 'teamMember':
      return '/team'
    case 'client':
      return '/client'
    default:
      return '/login'
  }
}

export default App