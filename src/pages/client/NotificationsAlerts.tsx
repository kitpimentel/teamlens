import { useState, useEffect } from 'react'
import { 
  Bell, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Filter, 
  Search,
  AlertTriangle,
  X,
  Info,
  RefreshCw,
  CheckCircle2
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

// Define types for notifications
interface Notification {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  read: boolean;
  date: string;
  actionRequired: boolean;
  actionUrl?: string;
  sourceType: 'project' | 'task' | 'meeting' | 'system' | 'report';
}

interface NotificationSettings {
  email: {
    projectUpdates: boolean;
    taskAssignments: boolean;
    meetingReminders: boolean;
    reportAvailability: boolean;
    systemAlerts: boolean;
  };
  inApp: {
    projectUpdates: boolean;
    taskAssignments: boolean;
    meetingReminders: boolean;
    reportAvailability: boolean;
    systemAlerts: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

interface ProjectOption {
  id: string;
  name: string;
}

/**
 * Notifications & Alerts Page Component
 * 
 * Displays all notifications and alerts for the client user.
 * Allows filtering, searching, and managing notification settings.
 */
const NotificationsAlerts = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      projectUpdates: true,
      taskAssignments: true,
      meetingReminders: true,
      reportAvailability: true,
      systemAlerts: true
    },
    inApp: {
      projectUpdates: true,
      taskAssignments: true,
      meetingReminders: true,
      reportAvailability: true,
      systemAlerts: true
    },
    frequency: 'immediate'
  })
  
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false)

  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchNotificationsData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for projects
        const mockProjects: ProjectOption[] = [
          { id: 'proj-1', name: 'Website Redesign' },
          { id: 'proj-2', name: 'Mobile App Development' },
          { id: 'proj-3', name: 'Content Creation' },
        ]
        
        // Mock data for notifications
        const mockNotifications: Notification[] = [
          {
            id: 'notif-1',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Project Milestone Completed',
            content: 'The "Content Migration" milestone has been completed. All content has been successfully migrated to the new site structure.',
            type: 'success',
            read: false,
            date: '2025-03-30T14:30:00Z',
            actionRequired: false,
            sourceType: 'project'
          },
          {
            id: 'notif-2',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Project Status Update',
            content: 'The Mobile App Development project is now at risk of delay. Current progress is at 35% against the expected 45%. A meeting has been scheduled to discuss mitigation strategies.',
            type: 'warning',
            read: false,
            date: '2025-03-29T10:15:00Z',
            actionRequired: true,
            actionUrl: '/client/timeline?project=proj-2',
            sourceType: 'project'
          },
          {
            id: 'notif-3',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'New Report Available',
            content: 'The monthly performance report for Website Redesign is now available for review.',
            type: 'info',
            read: false,
            date: '2025-03-28T09:45:00Z',
            actionRequired: true,
            actionUrl: '/client/reports',
            sourceType: 'report'
          },
          {
            id: 'notif-4',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            title: 'Feedback Response',
            content: 'Your feedback regarding "More video content needed" has been acknowledged. The team is evaluating options and will update you soon.',
            type: 'info',
            read: true,
            date: '2025-03-27T16:20:00Z',
            actionRequired: false,
            sourceType: 'project'
          },
          {
            id: 'notif-5',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Task Deadline Approaching',
            content: 'The "UI components design" task is due in 2 days. Current progress: 90% complete.',
            type: 'warning',
            read: true,
            date: '2025-03-26T11:30:00Z',
            actionRequired: false,
            sourceType: 'task'
          },
          {
            id: 'notif-6',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Meeting Reminder',
            content: 'Reminder: Beta Launch Planning meeting scheduled for tomorrow at 2:00 PM.',
            type: 'info',
            read: true,
            date: '2025-03-24T10:00:00Z',
            actionRequired: false,
            sourceType: 'meeting'
          },
          {
            id: 'notif-7',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            title: 'Project Deadline at Risk',
            content: 'The Content Creation project is behind schedule and at risk of missing the deadline. Current progress: 22%.',
            type: 'danger',
            read: true,
            date: '2025-03-23T14:15:00Z',
            actionRequired: true,
            actionUrl: '/client/timeline?project=proj-3',
            sourceType: 'project'
          },
          {
            id: 'notif-8',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Request Status Update',
            content: 'Your request for "Add social media integration" is now pending review.',
            type: 'info',
            read: true,
            date: '2025-03-22T16:45:00Z',
            actionRequired: false,
            sourceType: 'project'
          },
          {
            id: 'notif-9',
            projectId: '',
            projectName: '',
            title: 'System Maintenance',
            content: 'The system will undergo scheduled maintenance on April 5th from 2:00 AM to 4:00 AM UTC. Brief service interruptions may occur during this period.',
            type: 'info',
            read: true,
            date: '2025-03-21T08:30:00Z',
            actionRequired: false,
            sourceType: 'system'
          },
          {
            id: 'notif-10',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Request Completed',
            content: 'Your request to "Change color scheme" has been completed. The color scheme has been updated to match your new branding guidelines.',
            type: 'success',
            read: true,
            date: '2025-03-18T15:30:00Z',
            actionRequired: false,
            sourceType: 'project'
          },
        ]
        
        setProjects(mockProjects)
        setNotifications(mockNotifications)
      } catch (error) {
        console.error('Error fetching notifications data:', error)
        toast.error('Failed to load notifications data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNotificationsData()
  }, [])
  
  // Filter notifications based on selected options
  const filteredNotifications = notifications.filter(notification => {
    const matchesProject = selectedProject === 'all' || notification.projectId === selectedProject
    const matchesType = selectedType === 'all' || notification.sourceType === selectedType
    const matchesStatus = selectedStatus === 'all' || 
                          (selectedStatus === 'read' && notification.read) || 
                          (selectedStatus === 'unread' && !notification.read)
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notification.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUnreadOnly = !showUnreadOnly || !notification.read
    
    return matchesProject && matchesType && matchesStatus && matchesSearch && matchesUnreadOnly
  })
  
  // Handle marking notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      )
      
      toast.success('Notification marked as read')
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      )
      
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }
  
  // Handle dismissing a notification
  const handleDismissNotification = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Update local state by removing the notification
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      )
      
      toast.success('Notification dismissed')
    } catch (error) {
      console.error('Error dismissing notification:', error)
      toast.error('Failed to dismiss notification')
    }
  }
  
  // Handle saving notification settings
  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Notification settings saved successfully')
    } catch (error) {
      console.error('Error saving notification settings:', error)
      toast.error('Failed to save notification settings. Please try again.')
    } finally {
      setIsSavingSettings(false)
    }
  }
  
  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-slate-500" />
    }
  }
  
  // Helper function to get source type icon
  const getSourceTypeIcon = (sourceType: Notification['sourceType']) => {
    switch (sourceType) {
      case 'project':
        return <FileText className="h-4 w-4" />
      case 'task':
        return <CheckCircle2 className="h-4 w-4" />
      case 'meeting':
        return <Calendar className="h-4 w-4" />
      case 'report':
        return <FileText className="h-4 w-4" />
      case 'system':
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSecs < 60) {
      return 'Just now'
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      // Format as date for older notifications
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return date.toLocaleDateString(undefined, options)
    }
  }
  
  // Function to get badge styling based on notification type
  const getTypeBadge = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Info</Badge>
      case 'warning':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Warning</Badge>
      case 'success':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-500">Success</Badge>
      case 'danger':
        return <Badge variant="outline" className="border-red-500 text-red-500">Alert</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications & Alerts</h1>
          <p className="text-muted-foreground">
            View and manage your notifications and alert preferences
          </p>
        </div>
        <div>
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>
      
      {/* Tabs for Notifications and Settings */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Clock className="h-4 w-4 mr-2" />
            Notification Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Filters Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="filter-project">Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger id="filter-project">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="filter-type">Source Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="filter-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="filter-status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger id="filter-status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="search-notifications">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-notifications"
                      placeholder="Search notifications..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-4 space-x-2">
                <Checkbox
                  id="show-unread"
                  checked={showUnreadOnly}
                  onCheckedChange={(checked) => 
                    setShowUnreadOnly(checked as boolean)
                  }
                />
                <label
                  htmlFor="show-unread"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Show unread notifications only
                </label>
              </div>
            </CardContent>
          </Card>
          
          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start p-4 border rounded-lg transition-colors relative ${
                        !notification.read ? 'bg-accent/10' : ''
                      }`}
                    >
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                          <div className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {getTypeBadge(notification.type)}
                            <Badge variant="secondary" className="font-normal flex items-center gap-1">
                              {getSourceTypeIcon(notification.sourceType)}
                              <span className="capitalize">{notification.sourceType}</span>
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.content}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center text-xs text-muted-foreground gap-3">
                            <span>{formatDate(notification.date)}</span>
                            {notification.projectName && (
                              <span className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {notification.projectName}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                            
                            {notification.actionRequired && (
                              <Button 
                                size="sm"
                                asChild
                              >
                                <a href={notification.actionUrl}>
                                  View Details
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => handleDismissNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No notifications found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || selectedProject !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' ? 
                      'Try adjusting your filters to see more results.' : 
                      'You don\'t have any notifications at the moment.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which notifications you'd like to receive via email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="email-project-updates">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for project status changes and milestones
                    </p>
                  </div>
                  <Switch
                    id="email-project-updates"
                    checked={notificationSettings.email.projectUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        email: {
                          ...notificationSettings.email,
                          projectUpdates: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="email-task-assignments">Task Assignments</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for task assignments and updates
                    </p>
                  </div>
                  <Switch
                    id="email-task-assignments"
                    checked={notificationSettings.email.taskAssignments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        email: {
                          ...notificationSettings.email,
                          taskAssignments: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="email-meeting-reminders">Meeting Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for upcoming meetings and events
                    </p>
                  </div>
                  <Switch
                    id="email-meeting-reminders"
                    checked={notificationSettings.email.meetingReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        email: {
                          ...notificationSettings.email,
                          meetingReminders: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="email-report-availability">Report Availability</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new reports are available
                    </p>
                  </div>
                  <Switch
                    id="email-report-availability"
                    checked={notificationSettings.email.reportAvailability}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        email: {
                          ...notificationSettings.email,
                          reportAvailability: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="email-system-alerts">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important system alerts and announcements
                    </p>
                  </div>
                  <Switch
                    id="email-system-alerts"
                    checked={notificationSettings.email.systemAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        email: {
                          ...notificationSettings.email,
                          systemAlerts: checked
                        }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Configure which notifications you'd like to receive within the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="inapp-project-updates">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for project status changes and milestones
                    </p>
                  </div>
                  <Switch
                    id="inapp-project-updates"
                    checked={notificationSettings.inApp.projectUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        inApp: {
                          ...notificationSettings.inApp,
                          projectUpdates: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="inapp-task-assignments">Task Assignments</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for task assignments and updates
                    </p>
                  </div>
                  <Switch
                    id="inapp-task-assignments"
                    checked={notificationSettings.inApp.taskAssignments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        inApp: {
                          ...notificationSettings.inApp,
                          taskAssignments: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="inapp-meeting-reminders">Meeting Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for upcoming meetings and events
                    </p>
                  </div>
                  <Switch
                    id="inapp-meeting-reminders"
                    checked={notificationSettings.inApp.meetingReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        inApp: {
                          ...notificationSettings.inApp,
                          meetingReminders: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="inapp-report-availability">Report Availability</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new reports are available
                    </p>
                  </div>
                  <Switch
                    id="inapp-report-availability"
                    checked={notificationSettings.inApp.reportAvailability}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        inApp: {
                          ...notificationSettings.inApp,
                          reportAvailability: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="inapp-system-alerts">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important system alerts and announcements
                    </p>
                  </div>
                  <Switch
                    id="inapp-system-alerts"
                    checked={notificationSettings.inApp.systemAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings,
                        inApp: {
                          ...notificationSettings.inApp,
                          systemAlerts: checked
                        }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Frequency</CardTitle>
              <CardDescription>
                Set how often you'd like to receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select 
                  value={notificationSettings.frequency} 
                  onValueChange={(value: 'immediate' | 'hourly' | 'daily' | 'weekly') => 
                    setNotificationSettings({
                      ...notificationSettings,
                      frequency: value
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (as they occur)</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
                
                <p className="text-sm text-muted-foreground">
                  {notificationSettings.frequency === 'immediate' ? 
                    'You will receive email notifications immediately as events occur.' : 
                    notificationSettings.frequency === 'hourly' ? 
                    'You will receive an hourly digest of all notifications.' : 
                    notificationSettings.frequency === 'daily' ? 
                    'You will receive a daily digest of all notifications.' : 
                    'You will receive a weekly digest of all notifications.'}
                </p>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                  >
                    {isSavingSettings ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NotificationsAlerts