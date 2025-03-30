import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CalendarIcon,
  MessageSquareIcon,
  ClockIcon,
  AlertCircleIcon,
  FileTextIcon,
  CheckCircleIcon,
} from 'lucide-react'

// Define types for our data
interface Project {
  id: string
  name: string
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed'
  progress: number
  dueDate: string
  team: string
  tasks: {
    completed: number
    total: number
  }
}

interface Notification {
  id: string
  message: string
  type: 'info' | 'warning' | 'success'
  date: string
  read: boolean
}

interface UpcomingMeeting {
  id: string
  title: string
  date: string
  time: string
  platform: 'Zoom' | 'Microsoft Teams' | 'Google Meet'
}

/**
 * Client Dashboard Page Component
 * 
 * Displays an overview of project status, upcoming meetings, and recent notifications
 * for client users. Serves as the main landing page after client login.
 */
const ClientDashboard = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [meetings, setMeetings] = useState<UpcomingMeeting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for projects
        const mockProjects: Project[] = [
          {
            id: 'proj-1',
            name: 'Website Redesign',
            status: 'On Track',
            progress: 68,
            dueDate: '2025-04-30',
            team: 'Design Team',
            tasks: {
              completed: 17,
              total: 25
            }
          },
          {
            id: 'proj-2',
            name: 'Mobile App Development',
            status: 'At Risk',
            progress: 35,
            dueDate: '2025-05-15',
            team: 'App Development',
            tasks: {
              completed: 7,
              total: 20
            }
          },
          {
            id: 'proj-3',
            name: 'Content Creation',
            status: 'Behind',
            progress: 22,
            dueDate: '2025-04-10',
            team: 'Marketing',
            tasks: {
              completed: 4,
              total: 18
            }
          },
          {
            id: 'proj-4',
            name: 'Analytics Dashboard',
            status: 'Completed',
            progress: 100,
            dueDate: '2025-03-20',
            team: 'Data Team',
            tasks: {
              completed: 12,
              total: 12
            }
          },
        ]
        
        // Mock notifications
        const mockNotifications: Notification[] = [
          {
            id: 'notif-1',
            message: 'New report available for Website Redesign project',
            type: 'info',
            date: '2025-03-30',
            read: false
          },
          {
            id: 'notif-2',
            message: 'Mobile App Development project is at risk of delay',
            type: 'warning',
            date: '2025-03-29',
            read: false
          },
          {
            id: 'notif-3',
            message: 'Content Creation milestone completed',
            type: 'success',
            date: '2025-03-28',
            read: true
          }
        ]
        
        // Mock upcoming meetings
        const mockMeetings: UpcomingMeeting[] = [
          {
            id: 'meet-1',
            title: 'Weekly Progress Review',
            date: '2025-04-02',
            time: '10:00 AM',
            platform: 'Zoom'
          },
          {
            id: 'meet-2',
            title: 'Mobile App Demo',
            date: '2025-04-05',
            time: '2:30 PM',
            platform: 'Microsoft Teams'
          },
          {
            id: 'meet-3',
            title: 'Content Strategy Planning',
            date: '2025-04-08',
            time: '11:00 AM',
            platform: 'Google Meet'
          }
        ]
        
        setProjects(mockProjects)
        setNotifications(mockNotifications)
        setMeetings(mockMeetings)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Here you would handle any errors, perhaps showing a toast notification
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  // Helper function to get status badge color
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'On Track':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'At Risk':
        return 'bg-amber-500 hover:bg-amber-600'
      case 'Behind':
        return 'bg-red-500 hover:bg-red-600'
      case 'Completed':
        return 'bg-blue-500 hover:bg-blue-600'
      default:
        return 'bg-slate-500 hover:bg-slate-600'
    }
  }

  // Helper function to get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <FileTextIcon className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <AlertCircleIcon className="h-5 w-5 text-amber-500" />
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
      default:
        return <FileTextIcon className="h-5 w-5 text-slate-500" />
    }
  }

  // Helper function to format date to readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
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
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your ongoing projects and recent activities
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/client/reports">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/client/chat">
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              Team Chat
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>
            Track the progress of your active projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {projects
                .filter(project => project.status !== 'Completed')
                .map(project => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <Link 
                        to={`/client/timeline?project=${project.id}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>Due: {formatDate(project.dueDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                        <span>
                          {project.tasks.completed}/{project.tasks.total} Tasks
                        </span>
                      </div>
                      <div className="flex items-center ml-auto">
                        <span>{project.team}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>
            
            <TabsContent value="completed">
              {projects
                .filter(project => project.status === 'Completed')
                .map(project => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <Link 
                        to={`/client/timeline?project=${project.id}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>Completed: {formatDate(project.dueDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                        <span>
                          {project.tasks.completed}/{project.tasks.total} Tasks
                        </span>
                      </div>
                      <div className="flex items-center ml-auto">
                        <span>{project.team}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>
            
            <TabsContent value="all">
              {projects.map(project => (
                <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <Link 
                      to={`/client/timeline?project=${project.id}`}
                      className="text-lg font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span>Due: {formatDate(project.dueDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="mr-1 h-4 w-4" />
                      <span>
                        {project.tasks.completed}/{project.tasks.total} Tasks
                      </span>
                    </div>
                    <div className="flex items-center ml-auto">
                      <span>{project.team}</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upcoming Meetings and Notifications Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>
              Your scheduled meetings for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {meetings.length > 0 ? (
              <div className="space-y-4">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="flex flex-col p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <div className="font-medium">{meeting.title}</div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 h-4 w-4" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <Badge variant="outline" className="font-normal">
                        {meeting.platform}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming meetings scheduled
              </div>
            )}
            
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/client/timeline">View Schedule</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircleIcon className="mr-2 h-5 w-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Updates and alerts from your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start p-3 border rounded-md hover:bg-accent/50 transition-colors ${
                      !notification.read ? 'bg-accent/10' : ''
                    }`}
                  >
                    <div className="mr-3 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className={`${!notification.read ? 'font-medium' : ''}`}>
                        {notification.message}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDate(notification.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No new notifications
              </div>
            )}
            
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/client/notifications">View All Notifications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClientDashboard