import { useState, useEffect } from 'react'
import {
  Bell,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Search,
  SlidersHorizontal,
  Trash2,
  AlertTriangle,
  Info,
  FileText,
  Calendar,
  Settings,
  CheckCircle2,
  RefreshCw,
  MoreVertical
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,

} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

// Define types for notifications
interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  category: 'system' | 'project' | 'task' | 'meeting' | 'report'
  read: boolean
  timestamp: string
  actionLink?: string
  projectId?: string
  projectName?: string
  taskId?: string
  taskName?: string
  triggeredBy?: {
    id: string
    name: string
    role: string
  }
}

interface NotificationFilter {
  type: string[]
  category: string[]
  read: string
  date: string
  project?: string
}

interface Project {
  id: string
  name: string
}

/**
 * Notification Center Page Component
 * 
 * Provides a centralized place for users to view and manage all their
 * system notifications.
 */
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Notification filters
  const [filters, setFilters] = useState<NotificationFilter>({
    type: [],
    category: [],
    read: 'all',
    date: 'all'
  })
  
  // Sort options
  const [sortBy, setSortBy] = useState<string>('newest')
  
  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchNotifications = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for notifications
        const mockNotifications: Notification[] = [
          {
            id: 'notification-1',
            title: 'Project status changed',
            message: 'The Mobile App Development project status has been changed to "At Risk".',
            type: 'warning',
            category: 'project',
            read: false,
            timestamp: '2025-03-30T10:15:00Z',
            actionLink: '/client/timeline?project=proj-2',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            triggeredBy: {
              id: 'user-1',
              name: 'Alex Johnson',
              role: 'Project Manager'
            }
          },
          {
            id: 'notification-2',
            title: 'New report available',
            message: 'The monthly performance report for Website Redesign is now available for review.',
            type: 'info',
            category: 'report',
            read: false,
            timestamp: '2025-03-29T14:30:00Z',
            actionLink: '/client/reports',
            projectId: 'proj-1',
            projectName: 'Website Redesign'
          },
          {
            id: 'notification-3',
            title: 'Meeting reminder',
            message: 'Weekly status meeting for Website Redesign scheduled for tomorrow at 10:00 AM.',
            type: 'info',
            category: 'meeting',
            read: false,
            timestamp: '2025-03-29T09:00:00Z',
            actionLink: '/client/timeline',
            projectId: 'proj-1',
            projectName: 'Website Redesign'
          },
          {
            id: 'notification-4',
            title: 'Task completed',
            message: 'The "Frontend implementation" task has been marked as complete by Sam Taylor.',
            type: 'success',
            category: 'task',
            read: true,
            timestamp: '2025-03-28T16:45:00Z',
            actionLink: '/client/timeline?project=proj-1',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            taskId: 'task-1-4',
            taskName: 'Frontend implementation',
            triggeredBy: {
              id: 'user-3',
              name: 'Sam Taylor',
              role: 'Lead Developer'
            }
          },
          {
            id: 'notification-5',
            title: 'Feedback response',
            message: 'Your feedback regarding "More video content needed" has been acknowledged.',
            type: 'success',
            category: 'project',
            read: true,
            timestamp: '2025-03-27T11:20:00Z',
            actionLink: '/client/feedback',
            projectId: 'proj-3',
            projectName: 'Content Creation'
          },
          {
            id: 'notification-6',
            title: 'System maintenance',
            message: 'The system will undergo scheduled maintenance on April 5th from 2:00 AM to 4:00 AM UTC.',
            type: 'info',
            category: 'system',
            read: true,
            timestamp: '2025-03-26T08:30:00Z'
          },
          {
            id: 'notification-7',
            title: 'Integration error',
            message: 'Error syncing with Google Calendar. Please reconnect the integration.',
            type: 'error',
            category: 'system',
            read: true,
            timestamp: '2025-03-25T13:10:00Z',
            actionLink: '/integrations'
          },
          {
            id: 'notification-8',
            title: 'Content Creation deadline approaching',
            message: 'The Content Creation project is due in 15 days.',
            type: 'warning',
            category: 'project',
            read: true,
            timestamp: '2025-03-25T09:45:00Z',
            actionLink: '/client/timeline?project=proj-3',
            projectId: 'proj-3',
            projectName: 'Content Creation'
          },
          {
            id: 'notification-9',
            title: 'New message from Alex Johnson',
            message: 'You have a new message from Alex Johnson regarding the Website Redesign project.',
            type: 'info',
            category: 'project',
            read: true,
            timestamp: '2025-03-24T15:30:00Z',
            actionLink: '/client/chat',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            triggeredBy: {
              id: 'user-1',
              name: 'Alex Johnson',
              role: 'Project Manager'
            }
          },
          {
            id: 'notification-10',
            title: 'New request status',
            message: 'Your request for "Add social media integration" is now pending review.',
            type: 'info',
            category: 'project',
            read: true,
            timestamp: '2025-03-23T10:15:00Z',
            actionLink: '/client/feedback',
            projectId: 'proj-2',
            projectName: 'Mobile App Development'
          },
          {
            id: 'notification-11',
            title: 'Password changed',
            message: 'Your account password was changed successfully.',
            type: 'success',
            category: 'system',
            read: true,
            timestamp: '2025-03-20T09:30:00Z'
          },
          {
            id: 'notification-12',
            title: 'Login from new device',
            message: 'New login detected from Windows PC in New York, USA.',
            type: 'warning',
            category: 'system',
            read: true,
            timestamp: '2025-03-18T14:25:00Z',
            actionLink: '/profile'
          },
        ]
        
        // Mock projects
        const mockProjects: Project[] = [
          { id: 'proj-1', name: 'Website Redesign' },
          { id: 'proj-2', name: 'Mobile App Development' },
          { id: 'proj-3', name: 'Content Creation' }
        ]
        
        setNotifications(mockNotifications)
        setProjects(mockProjects)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        // Handle error appropriately
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNotifications()
  }, [])
  
  // Filter notifications based on search query and filters
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.projectName && notification.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notification.triggeredBy && notification.triggeredBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Type filter
    const matchesType = filters.type.length === 0 || filters.type.includes(notification.type)
    
    // Category filter
    const matchesCategory = filters.category.length === 0 || filters.category.includes(notification.category)
    
    // Read status filter
    const matchesReadStatus = 
      filters.read === 'all' || 
      (filters.read === 'read' && notification.read) || 
      (filters.read === 'unread' && !notification.read)
    
    // Date filter
    const matchesDate = filters.date === 'all' || isWithinDateRange(notification.timestamp, filters.date)
    
    // Project filter
    const matchesProject = !filters.project || notification.projectId === filters.project
    
    return matchesSearch && matchesType && matchesCategory && matchesReadStatus && matchesDate && matchesProject
  })

  // Sort filtered notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      case 'unread':
        return a.read === b.read ? 0 : a.read ? 1 : -1
      default:
        return 0
    }
  })
  
  // Check if a notification's timestamp is within the selected date range
  const isWithinDateRange = (timestamp: string, dateRange: string) => {
    const notificationDate = new Date(timestamp)
    const now = new Date()
    
    switch (dateRange) {
      case 'today':
        return notificationDate.toDateString() === now.toDateString()
      case 'yesterday':
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        return notificationDate.toDateString() === yesterday.toDateString()
      case 'thisWeek': {
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
        return notificationDate >= startOfWeek
      }
      case 'thisMonth': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return notificationDate >= startOfMonth
      }
      default:
        return true
    }
  }
  
  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      // Today
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday'
    } else if (diffDays < 7) {
      // Days of the week
      return date.toLocaleDateString([], { weekday: 'long' })
    } else {
      // Full date
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }
  
  // Format detailed time for display
  const formatDetailedTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Get icon for notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-slate-500" />
    }
  }
  
  // Get icon for notification category
  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'system':
        return <Settings className="h-4 w-4" />
      case 'project':
        return <FileText className="h-4 w-4" />
      case 'task':
        return <CheckCircle2 className="h-4 w-4" />
      case 'meeting':
        return <Calendar className="h-4 w-4" />
      case 'report':
        return <FileText className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }
  
  // Handle notification selection (for bulk actions)
  const handleNotificationSelect = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id) 
        : [...prev, id]
    )
  }
  
  // Handle select all notifications
  const handleSelectAll = () => {
    if (selectedNotifications.length === sortedNotifications.length) {
      // If all are selected, deselect all
      setSelectedNotifications([])
    } else {
      // Otherwise, select all
      setSelectedNotifications(sortedNotifications.map(n => n.id))
    }
  }
  
  // Handle marking notifications as read
  const handleMarkAsRead = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(notification => 
        ids.includes(notification.id) ? { ...notification, read: true } : notification
      )
    )
    
    // Clear selection after action
    if (ids.length === selectedNotifications.length) {
      setSelectedNotifications([])
    }
  }
  
  // Handle marking notifications as unread
  const handleMarkAsUnread = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(notification => 
        ids.includes(notification.id) ? { ...notification, read: false } : notification
      )
    )
    
    // Clear selection after action
    if (ids.length === selectedNotifications.length) {
      setSelectedNotifications([])
    }
  }
  
  // Handle deleting notifications
  const handleDeleteNotifications = (ids: string[]) => {
    setNotifications(prev => 
      prev.filter(notification => !ids.includes(notification.id))
    )
    
    // Clear selection after action
    setSelectedNotifications([])
  }
  
  // Toggle filter for notification types
  const toggleTypeFilter = (type: string) => {
    setFilters(prev => {
      const currentTypes = [...prev.type]
      if (currentTypes.includes(type)) {
        return { ...prev, type: currentTypes.filter(t => t !== type) }
      } else {
        return { ...prev, type: [...currentTypes, type] }
      }
    })
  }
  
  // Toggle filter for notification categories
  const toggleCategoryFilter = (category: string) => {
    setFilters(prev => {
      const currentCategories = [...prev.category]
      if (currentCategories.includes(category)) {
        return { ...prev, category: currentCategories.filter(c => c !== category) }
      } else {
        return { ...prev, category: [...currentCategories, category] }
      }
    })
  }
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      type: [],
      category: [],
      read: 'all',
      date: 'all',
      project: undefined
    })
    setSearchQuery('')
  }
  
  // Get stats for notifications
  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    info: notifications.filter(n => n.type === 'info').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    success: notifications.filter(n => n.type === 'success').length,
    error: notifications.filter(n => n.type === 'error').length
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
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">
            View and manage all your notifications in one place
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort by: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Unread First'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                <Clock className="h-4 w-4 mr-2" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                <Clock className="h-4 w-4 mr-2" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('unread')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Unread First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={() => setIsFiltersOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {(filters.type.length > 0 || 
              filters.category.length > 0 || 
              filters.read !== 'all' || 
              filters.date !== 'all' || 
              filters.project) && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      {/* Notification Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <h3 className="text-3xl font-bold mt-1">{notificationStats.total}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Unread</p>
              <h3 className="text-3xl font-bold mt-1 text-primary">{notificationStats.unread}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-500">Info</p>
              <h3 className="text-3xl font-bold mt-1">{notificationStats.info}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-amber-500">Warning</p>
              <h3 className="text-3xl font-bold mt-1">{notificationStats.warning}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-500">Success</p>
              <h3 className="text-3xl font-bold mt-1">{notificationStats.success}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-red-500">Error</p>
              <h3 className="text-3xl font-bold mt-1">{notificationStats.error}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search notifications..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Notification List */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox 
                id="select-all" 
                checked={selectedNotifications.length > 0 && selectedNotifications.length === sortedNotifications.length}
                onCheckedChange={handleSelectAll}
                className="mr-2"
              />
              <label 
                htmlFor="select-all" 
                className="text-sm font-medium cursor-pointer"
              >
                {selectedNotifications.length > 0 
                  ? `Selected ${selectedNotifications.length} ${selectedNotifications.length === 1 ? 'notification' : 'notifications'}`
                  : 'Select All'
                }
              </label>
            </div>
            
            {selectedNotifications.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMarkAsRead(selectedNotifications)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMarkAsUnread(selectedNotifications)}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Mark as Unread
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Notifications</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedNotifications.length} {selectedNotifications.length === 1 ? 'notification' : 'notifications'}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteNotifications(selectedNotifications)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          
          {sortedNotifications.length > 0 ? (
            <div>
              {sortedNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`border-b p-4 flex gap-3 items-start ${!notification.read ? 'bg-accent/10' : ''}`}
                >
                  <Checkbox 
                    id={`select-${notification.id}`} 
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={() => handleNotificationSelect(notification.id)}
                    className="mt-1"
                  />
                  
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                        {formatDate(notification.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs flex items-center gap-1 capitalize">
                        {getCategoryIcon(notification.category)}
                        {notification.category}
                      </Badge>
                      
                      {notification.projectName && (
                        <Badge variant="secondary" className="text-xs">
                          {notification.projectName}
                        </Badge>
                      )}
                      
                      {notification.triggeredBy && (
                        <span className="text-xs text-muted-foreground">
                          by {notification.triggeredBy.name}
                        </span>
                      )}
                      
                      <div className="ml-auto flex gap-2">
                        {notification.actionLink && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 text-xs"
                            asChild
                          >
                            <a href={notification.actionLink}>View Details</a>
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMarkAsRead([notification.id])}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkAsUnread([notification.id])}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Mark as Unread
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Info className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{notification.title}</DialogTitle>
                                  <DialogDescription>
                                    Notification details
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="flex items-center gap-2">
                                    {getNotificationIcon(notification.type)}
                                    <Badge variant="outline" className="capitalize">
                                      {notification.type}
                                    </Badge>
                                    <Badge variant="outline" className="capitalize flex items-center gap-1">
                                      {getCategoryIcon(notification.category)}
                                      {notification.category}
                                    </Badge>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium">Message</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium">Timestamp</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {formatDetailedTime(notification.timestamp)}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium">Status</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {notification.read ? 'Read' : 'Unread'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {notification.projectName && (
                                    <div>
                                      <h4 className="text-sm font-medium">Project</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {notification.projectName}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {notification.taskName && (
                                    <div>
                                      <h4 className="text-sm font-medium">Task</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {notification.taskName}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {notification.triggeredBy && (
                                    <div>
                                      <h4 className="text-sm font-medium">Triggered By</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {notification.triggeredBy.name} ({notification.triggeredBy.role})
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  {notification.actionLink && (
                                    <Button asChild>
                                      <a href={notification.actionLink}>View Details</a>
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this notification? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteNotifications([notification.id])}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">No notifications found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || 
                filters.type.length > 0 || 
                filters.category.length > 0 || 
                filters.read !== 'all' || 
                filters.date !== 'all' || 
                filters.project ? (
                  <Button variant="link" onClick={resetFilters}>
                    Clear filters and try again
                  </Button>
                ) : (
                  'You don\'t have any notifications yet'
                )}
              </p>
            </div>
          )}
        </CardContent>
        
        {sortedNotifications.length > 0 && (
          <CardFooter className="flex justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {sortedNotifications.length} of {notifications.length} notifications
            </div>
            
            {/* In a real app, you would implement pagination here */}
            <Button variant="outline" disabled={sortedNotifications.length === notifications.length}>
              Load More
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Filters Dialog */}
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Notifications</DialogTitle>
            <DialogDescription>
              Customize which notifications to display
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">By Type</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-type-info"
                    checked={filters.type.includes('info')}
                    onCheckedChange={() => toggleTypeFilter('info')}
                  />
                  <label
                    htmlFor="filter-type-info"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Info
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-type-warning"
                    checked={filters.type.includes('warning')}
                    onCheckedChange={() => toggleTypeFilter('warning')}
                  />
                  <label
                    htmlFor="filter-type-warning"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Warning
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-type-success"
                    checked={filters.type.includes('success')}
                    onCheckedChange={() => toggleTypeFilter('success')}
                  />
                  <label
                    htmlFor="filter-type-success"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                    Success
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-type-error"
                    checked={filters.type.includes('error')}
                    onCheckedChange={() => toggleTypeFilter('error')}
                  />
                  <label
                    htmlFor="filter-type-error"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Error
                  </label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">By Category</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-category-system"
                    checked={filters.category.includes('system')}
                    onCheckedChange={() => toggleCategoryFilter('system')}
                  />
                  <label
                    htmlFor="filter-category-system"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    System
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-category-project"
                    checked={filters.category.includes('project')}
                    onCheckedChange={() => toggleCategoryFilter('project')}
                  />
                  <label
                    htmlFor="filter-category-project"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Project
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-category-task"
                    checked={filters.category.includes('task')}
                    onCheckedChange={() => toggleCategoryFilter('task')}
                  />
                  <label
                    htmlFor="filter-category-task"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Task
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-category-meeting"
                    checked={filters.category.includes('meeting')}
                    onCheckedChange={() => toggleCategoryFilter('meeting')}
                  />
                  <label
                    htmlFor="filter-category-meeting"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Meeting
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-category-report"
                    checked={filters.category.includes('report')}
                    onCheckedChange={() => toggleCategoryFilter('report')}
                  />
                  <label
                    htmlFor="filter-category-report"
                    className="text-sm font-medium flex items-center leading-none cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Report
                  </label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">By Status</h3>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="read-status"
                    checked={filters.read === 'all'}
                    onChange={() => setFilters(prev => ({ ...prev, read: 'all' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">All</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="read-status"
                    checked={filters.read === 'read'}
                    onChange={() => setFilters(prev => ({ ...prev, read: 'read' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">Read only</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="read-status"
                    checked={filters.read === 'unread'}
                    onChange={() => setFilters(prev => ({ ...prev, read: 'unread' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">Unread only</span>
                </label>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">By Date</h3>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="date-range"
                    checked={filters.date === 'all'}
                    onChange={() => setFilters(prev => ({ ...prev, date: 'all' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">All time</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="date-range"
                    checked={filters.date === 'today'}
                    onChange={() => setFilters(prev => ({ ...prev, date: 'today' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">Today</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="date-range"
                    checked={filters.date === 'yesterday'}
                    onChange={() => setFilters(prev => ({ ...prev, date: 'yesterday' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">Yesterday</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="date-range"
                    checked={filters.date === 'thisWeek'}
                    onChange={() => setFilters(prev => ({ ...prev, date: 'thisWeek' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">This week</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="date-range"
                    checked={filters.date === 'thisMonth'}
                    onChange={() => setFilters(prev => ({ ...prev, date: 'thisMonth' }))}
                    className="radio radio-primary"
                  />
                  <span className="text-sm">This month</span>
                </label>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">By Project</h3>
              <Select 
                value={filters.project || ''} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, project: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => setIsFiltersOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NotificationCenter