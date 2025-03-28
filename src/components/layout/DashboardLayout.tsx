import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocketNotifications } from '../../hooks/useWebSocketNotifications';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

// Import shadcn components
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Import Lucide icons
import {
  Home,
  Users,
  Folder,
  Calendar,
  BarChart2,
  Settings,
  MessageSquare,
  Bell,
  HelpCircle,
  Link2,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

/**
 * DashboardLayout Component
 * 
 * Main layout for authenticated users providing:
 * - Responsive sidebar navigation
 * - Role-based menu items
 * - Real-time notifications via WebSocket
 * - Dark mode toggle
 * - Profile dropdown
 */
const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Set up WebSocket notifications
  const token = localStorage.getItem('accessToken');
  const { connectionStatus, notificationCount, resetNotificationCount } = useWebSocketNotifications(token, !!user);

  // Check for dark mode preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close sidebar when route changes (mobile view)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Reset notification count when visiting notifications page
  useEffect(() => {
    if (location.pathname === '/notifications') {
      resetNotificationCount();
    }
  }, [location.pathname, resetNotificationCount]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const navigationLinks = getNavigationLinks(user.role);

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:z-50 bg-card border-r">
        <SidebarContent 
          user={user} 
          navigationLinks={navigationLinks}
          handleLogout={handleLogout}
        />
      </aside>
      
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent 
            user={user} 
            navigationLinks={navigationLinks}
            handleLogout={handleLogout}
            mobile
          />
        </SheetContent>
      </Sheet>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card border-b">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Menu button (mobile only) */}
            <div className="lg:hidden">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
            </div>
            
            {/* Page title */}
            <div className="flex items-center flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold">
                {getPageTitle(location.pathname, user.role)}
              </h1>
              
              {/* Connection status indicator */}
              <div className="ml-3 flex items-center">
                <span className={cn(
                  "h-2 w-2 rounded-full mr-1",
                  connectionStatus === 'connected' ? "bg-green-500" : 
                  connectionStatus === 'connecting' ? "bg-amber-500" : "bg-red-500"
                )} />
                <span className="text-xs text-muted-foreground">
                  {connectionStatus === 'connected' ? "Connected" : 
                   connectionStatus === 'connecting' ? "Connecting..." : "Disconnected"}
                </span>
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-1">
              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative"
              >
                <NavLink to="/notifications">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 px-1 h-4 min-w-4 flex items-center justify-center text-xs" 
                      variant="destructive"
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </NavLink>
              </Button>
              
              {/* Chat link */}
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <NavLink to={`/${getRoleUrlPrefix(user.role)}/chat`}>
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Chat</span>
                </NavLink>
              </Button>
              
              {/* User profile dropdown */}
              <UserProfileMenu user={user} handleLogout={handleLogout} />
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="mt-auto border-t py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Team Lens. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

/**
 * Sidebar Content Component
 * 
 * Extracted component for sidebar content to avoid duplication
 * between desktop and mobile versions
 */
interface SidebarContentProps {
  user: any;
  navigationLinks: NavigationLink[];
  handleLogout: () => Promise<void>;
  mobile?: boolean;
}

function SidebarContent({ user, navigationLinks, handleLogout, mobile }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo and header */}
      <div className="h-16 flex items-center px-4 border-b">
        <img className="h-10 w-auto" src="/logo.svg" alt="Team Lens" />
        {mobile && (
          <Button variant="ghost" size="icon" className="ml-auto">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>
      
      {/* User info */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {formatRoleName(user.role)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4 space-y-1">
          {navigationLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{item.name}</span>
              {item.badge && (
                <Badge 
                  variant="outline" 
                  className="ml-auto text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      
      {/* Bottom actions */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

/**
 * User Profile Menu Component
 * 
 * Dropdown menu for user profile actions
 */
interface UserProfileMenuProps {
  user: any;
  handleLogout: () => Promise<void>;
}

function UserProfileMenu({ user, handleLogout }: UserProfileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <NavLink to="/profile" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </NavLink>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <NavLink to="/integrations" className="cursor-pointer">
              <Link2 className="mr-2 h-4 w-4" />
              <span>Integrations</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </NavLink>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <NavLink to="/help" className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help Center</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Types for navigation links
interface NavigationLink {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

/**
 * Get navigation links based on user role
 */
function getNavigationLinks(role: string): NavigationLink[] {
  switch (role) {
    case 'superAdmin':
      return [
        { name: 'Dashboard', href: '/super-admin', icon: Home },
        { name: 'Users', href: '/super-admin/users', icon: Users },
        { name: 'Organizations', href: '/super-admin/organizations', icon: Folder },
        { name: 'Settings', href: '/super-admin/settings', icon: Settings },
        { name: 'Integrations', href: '/super-admin/integrations', icon: Link2 },
        { name: 'Reports', href: '/super-admin/reports', icon: BarChart2 },
      ];
    case 'orgAdmin':
      return [
        { name: 'Dashboard', href: '/org-admin', icon: Home },
        { name: 'Users', href: '/org-admin/users', icon: Users },
        { name: 'Invitations', href: '/org-admin/invitations', icon: Users, badge: 'New' },
        { name: 'Projects', href: '/org-admin/projects', icon: Folder },
        { name: 'Team Capacity', href: '/org-admin/capacity', icon: Users },
        { name: 'Schedule', href: '/org-admin/schedule', icon: Calendar },
        { name: 'Tasks', href: '/org-admin/tasks', icon: Folder },
        { name: 'Reports', href: '/org-admin/reports', icon: BarChart2 },
        { name: 'Meetings', href: '/org-admin/meetings', icon: Users },
        { name: 'Chat', href: '/org-admin/chat', icon: MessageSquare },
        { name: 'Settings', href: '/org-admin/settings', icon: Settings },
      ];
    case 'teamMember':
      return [
        { name: 'My Tasks', href: '/team', icon: Folder },
        { name: 'Collaboration', href: '/team/collaboration', icon: Users },
        { name: 'Reports', href: '/team/reports', icon: BarChart2 },
        { name: 'Chat', href: '/team/chat', icon: MessageSquare },
      ];
    case 'client':
      return [
        { name: 'Dashboard', href: '/client', icon: Home },
        { name: 'Reports', href: '/client/reports', icon: BarChart2 },
        { name: 'Timeline', href: '/client/timeline', icon: Calendar },
        { name: 'Feedback', href: '/client/feedback', icon: MessageSquare },
        { name: 'Notifications', href: '/client/notifications', icon: Bell },
        { name: 'Chat', href: '/client/chat', icon: MessageSquare },
      ];
    default:
      return [];
  }
}

/**
 * Get URL prefix based on user role
 */
function getRoleUrlPrefix(role: string): string {
  switch (role) {
    case 'superAdmin': return 'super-admin';
    case 'orgAdmin': return 'org-admin';
    case 'teamMember': return 'team';
    case 'client': return 'client';
    default: return '';
  }
}

/**
 * Format role name for display
 */
function formatRoleName(role: string): string {
  switch (role) {
    case 'superAdmin': return 'Super Admin';
    case 'orgAdmin': return 'Organization Admin';
    case 'teamMember': return 'Team Member';
    case 'client': return 'Client';
    default: return role;
  }
}

/**
 * Get page title based on current path and user role
 */
function getPageTitle(pathname: string, role: string): string {
  // Base path for role
  const basePath = `/${getRoleUrlPrefix(role)}`;
  
  // Dashboard or My Tasks for team members
  if (pathname === basePath) {
    return role === 'teamMember' ? 'My Tasks' : 'Dashboard';
  }
  
  // Get last segment of path
  const pathSegments = pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  // Common page titles
  const pageTitles: Record<string, string> = {
    'chat': 'Chat',
    'users': 'User Management',
    'organizations': 'Organizations',
    'settings': 'Settings',
    'integrations': 'Integrations',
    'reports': 'Reports',
    'invitations': 'Team Invitations',
    'projects': 'Projects',
    'capacity': 'Team Capacity',
    'schedule': 'Schedule Management',
    'tasks': 'Task Management',
    'meetings': 'Meeting Integrations',
    'collaboration': 'Collaboration Board',
    'timeline': 'Project Timeline',
    'feedback': 'Feedback & Requests',
    'notifications': 'Notifications',
    'profile': 'Profile Settings',
    'help': 'Help Center',
  };
  
  // Return title from mapping if available
  if (lastSegment in pageTitles) {
    return pageTitles[lastSegment];
  }
  
  // Special cases for detail pages
  if (pathSegments.includes('projects') && pathSegments.length > 3) {
    return 'Project Details';
  }
  
  if (pathSegments.includes('tasks') && pathSegments.length > 3) {
    return 'Task Details';
  }
  
  return 'Team Lens';
}

export default DashboardLayout;