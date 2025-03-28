import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  HelpCircle,
  X,
  Home,
  Users,
  Building2,
  Settings2,
  Grid,
  BarChart,
  Briefcase,
  Calendar,
  MessageSquare,
  FileText,
  Terminal,
  CheckSquare,
  AlertCircle
} from 'lucide-react'

/**
 * DashboardLayout component
 * 
 * Provides the overall layout structure for authenticated pages including:
 * - Top navigation bar
 * - Side navigation
 * - User dropdown
 * - Theme toggle
 * - Responsive mobile sidebar
 */
const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [mobileSidebarView, setMobileSidebarView] = useState<'main' | 'notifications'>('main')
  
  // Mock notifications for the demo
  const mockNotifications = [
    {
      id: 1,
      title: 'New team member added',
      message: 'Sarah Johnson has joined the team.',
      time: '2 minutes ago',
      read: false,
      type: 'user'
    },
    {
      id: 2,
      title: 'Project status updated',
      message: 'Website Redesign project status changed to "In Progress"',
      time: '1 hour ago',
      read: false,
      type: 'project'
    },
    {
      id: 3,
      title: 'Meeting reminder',
      message: 'Weekly team sync starts in 30 minutes',
      time: '2 hours ago',
      read: true,
      type: 'meeting'
    },
    {
      id: 4,
      title: 'Task assigned to you',
      message: 'Create wireframes for mobile app',
      time: '5 hours ago',
      read: true,
      type: 'task'
    },
    {
      id: 5,
      title: 'Integration update',
      message: 'JIRA integration updated to version 3.2.1',
      time: '1 day ago',
      read: true,
      type: 'system'
    }
  ]
  
  // Count unread notifications
  const unreadCount = mockNotifications.filter(n => !n.read).length
  
  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('There was a problem logging out')
    }
  }
  
  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []
    
    switch (user.role) {
      case 'superAdmin':
        return [
          {
            title: 'Dashboard',
            icon: <Home className="h-5 w-5" />,
            href: '/super-admin',
            active: location.pathname === '/super-admin'
          },
          {
            title: 'Users',
            icon: <Users className="h-5 w-5" />,
            href: '/super-admin/users',
            active: location.pathname === '/super-admin/users'
          },
          {
            title: 'Organizations',
            icon: <Building2 className="h-5 w-5" />,
            href: '/super-admin/organizations',
            active: location.pathname === '/super-admin/organizations'
          },
          {
            title: 'Integrations',
            icon: <Grid className="h-5 w-5" />,
            href: '/super-admin/integrations',
            active: location.pathname === '/super-admin/integrations'
          },
          {
            title: 'Reports',
            icon: <BarChart className="h-5 w-5" />,
            href: '/super-admin/reports',
            active: location.pathname === '/super-admin/reports'
          },
          {
            title: 'Settings',
            icon: <Settings2 className="h-5 w-5" />,
            href: '/super-admin/settings',
            active: location.pathname === '/super-admin/settings'
          }
        ]
      case 'orgAdmin':
        return [
          {
            title: 'Dashboard',
            icon: <Home className="h-5 w-5" />,
            href: '/org-admin',
            active: location.pathname === '/org-admin'
          },
          {
            title: 'Projects',
            icon: <Briefcase className="h-5 w-5" />,
            href: '/org-admin/projects',
            active: location.pathname.startsWith('/org-admin/projects')
          },
          {
            title: 'Team',
            icon: <Users className="h-5 w-5" />,
            href: '/org-admin/users',
            active: location.pathname === '/org-admin/users'
          },
          {
            title: 'Invitations',
            icon: <Users className="h-5 w-5" />,
            href: '/org-admin/invitations',
            active: location.pathname === '/org-admin/invitations'
          },
          {
            title: 'Capacity',
            icon: <Terminal className="h-5 w-5" />,
            href: '/org-admin/capacity',
            active: location.pathname === '/org-admin/capacity'
          },
          {
            title: 'Schedule',
            icon: <Calendar className="h-5 w-5" />,
            href: '/org-admin/schedule',
            active: location.pathname === '/org-admin/schedule'
          },
          {
            title: 'Tasks',
            icon: <CheckSquare className="h-5 w-5" />,
            href: '/org-admin/tasks',
            active: location.pathname === '/org-admin/tasks'
          },
          {
            title: 'Meetings',
            icon: <Calendar className="h-5 w-5" />,
            href: '/org-admin/meetings',
            active: location.pathname === '/org-admin/meetings'
          },
          {
            title: 'Reports',
            icon: <FileText className="h-5 w-5" />,
            href: '/org-admin/reports',
            active: location.pathname === '/org-admin/reports'
          },
          {
            title: 'Chat',
            icon: <MessageSquare className="h-5 w-5" />,
            href: '/org-admin/chat',
            active: location.pathname === '/org-admin/chat'
          },
          {
            title: 'Settings',
            icon: <Settings2 className="h-5 w-5" />,
            href: '/org-admin/settings',
            active: location.pathname === '/org-admin/settings'
          }
        ]
      case 'teamMember':
        return [
          {
            title: 'My Tasks',
            icon: <CheckSquare className="h-5 w-5" />,
            href: '/team',
            active: location.pathname === '/team'
          },
          {
            title: 'Collaboration',
            icon: <Users className="h-5 w-5" />,
            href: '/team/collaboration',
            active: location.pathname === '/team/collaboration'
          },
          {
            title: 'Projects',
            icon: <Briefcase className="h-5 w-5" />,
            href: '/team/projects',
            active: location.pathname.startsWith('/team/projects')
          },
          {
            title: 'Reports',
            icon: <FileText className="h-5 w-5" />,
            href: '/team/reports',
            active: location.pathname === '/team/reports'
          },
          {
            title: 'Chat',
            icon: <MessageSquare className="h-5 w-5" />,
            href: '/team/chat',
            active: location.pathname === '/team/chat'
          }
        ]
      case 'client':
        return [
          {
            title: 'Dashboard',
            icon: <Home className="h-5 w-5" />,
            href: '/client',
            active: location.pathname === '/client'
          },
          {
            title: 'Reports',
            icon: <FileText className="h-5 w-5" />,
            href: '/client/reports',
            active: location.pathname === '/client/reports'
          },
          {
            title: 'Timeline',
            icon: <Calendar className="h-5 w-5" />,
            href: '/client/timeline',
            active: location.pathname === '/client/timeline'
          },
          {
            title: 'Feedback',
            icon: <MessageSquare className="h-5 w-5" />,
            href: '/client/feedback',
            active: location.pathname === '/client/feedback'
          },
          {
            title: 'Notifications',
            icon: <Bell className="h-5 w-5" />,
            href: '/client/notifications',
            active: location.pathname === '/client/notifications'
          },
          {
            title: 'Chat',
            icon: <MessageSquare className="h-5 w-5" />,
            href: '/client/chat',
            active: location.pathname === '/client/chat'
          }
        ]
      default:
        return []
    }
  }
  
  // Get notification background color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500'
      case 'project':
        return 'bg-purple-500'
      case 'meeting':
        return 'bg-amber-500'
      case 'task':
        return 'bg-green-500'
      case 'system':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'project':
        return <Briefcase className="h-4 w-4" />
      case 'meeting':
        return <Calendar className="h-4 w-4" />
      case 'task':
        return <CheckSquare className="h-4 w-4" />
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }
  
  // Navigation items
  const navigationItems = getNavigationItems()
  
  // Helper to render the sidebar
  const renderSidebar = () => (
    <aside className="w-64 border-r">
      <div className="py-6 px-4">
        <Link to="/" className="flex items-center mb-6">
          <div className="w-8 h-8 mr-2 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-lg">
            TL
          </div>
          <h1 className="text-xl font-bold">Team Lens</h1>
        </Link>
        
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.active 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
  
  // Helper to render the notifications panel
  const renderNotifications = () => (
    <ScrollArea className="h-full px-4 py-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={cn(
              "p-3 rounded-lg border",
              notification.read ? "opacity-70" : ""
            )}
          >
            <div className="flex">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white",
                getNotificationColor(notification.type)
              )}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  {!notification.read && (
                    <Badge className="ml-2 bg-blue-500">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground block mt-1">
                  {notification.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
  
  // Render the mobile sidebar
  const renderMobileSidebar = () => (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 text-left border-b">
          <SheetTitle className="flex items-center">
            <div className="w-8 h-8 mr-2 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-lg">
              TL
            </div>
            <span>Team Lens</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        {mobileSidebarView === 'main' ? (
          <ScrollArea className="h-[calc(100vh-65px)]">
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar>
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      item.active 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </Link>
                ))}
              </nav>
              
              <Separator className="my-4" />
              
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setMobileSidebarView('notifications')}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                  }}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-3 h-5 w-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-3 h-5 w-5" />
                      Dark Mode
                    </>
                  )}
                </Button>
                <Link to="/help">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <HelpCircle className="mr-3 h-5 w-5" />
                    Help & Support
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <>
            <div className="p-4 border-b">
              <Button 
                variant="ghost" 
                className="flex items-center" 
                onClick={() => setMobileSidebarView('main')}
              >
                <X className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            {renderNotifications()}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
  
  if (!user) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden md:flex">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 mr-2 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-lg">
                TL
              </div>
              <h1 className="text-xl font-bold">Team Lens</h1>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center px-4">
            <div className="relative hidden md:flex items-center w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge variant="outline">{unreadCount} new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className={cn(
                        "flex items-start cursor-pointer py-3",
                        notification.read ? "opacity-70" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white",
                        getNotificationColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <Badge className="ml-2 bg-blue-500">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground block mt-1">
                          {notification.time}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="w-full text-center justify-center">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Settings className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          {renderSidebar()}
        </div>
        
        {/* Mobile Sidebar */}
        {renderMobileSidebar()}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout