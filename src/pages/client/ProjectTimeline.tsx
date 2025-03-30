import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon, 
  ZoomInIcon,
  ZoomOutIcon
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Define types for data
interface Project {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed'
  progress: number
}

interface Milestone {
  id: string
  projectId: string
  title: string
  description: string
  date: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed'
  dependencies?: string[] // IDs of milestones that this one depends on
}

interface Task {
  id: string
  projectId: string
  milestoneId: string
  title: string
  description: string
  assignee: string
  startDate: string
  endDate: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Blocked'
  progress: number
}

interface Meeting {
  id: string
  projectId: string
  title: string
  description: string
  date: string
  time: string
  duration: number // in minutes
  platform: 'Zoom' | 'Microsoft Teams' | 'Google Meet'
  participants: string[]
  recording?: string
}

// Helper function to generate a range of dates
const generateDateRange = (startDate: Date, endDate: Date) => {
  const dates: Date[] = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

// Helper function to get date boundaries for timeline display
const getTimelineBoundaries = (projects: Project[]) => {
  if (!projects.length) return { startDate: new Date(), endDate: new Date() }
  
  // Find the earliest start date and latest end date
  const startDates = projects.map(p => new Date(p.startDate))
  const endDates = projects.map(p => new Date(p.endDate))
  
  const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())))
  const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())))
  
  // Add some padding (14 days before and after)
  earliestStart.setDate(earliestStart.getDate() - 14)
  latestEnd.setDate(latestEnd.getDate() + 14)
  
  return { startDate: earliestStart, endDate: latestEnd }
}

/**
 * Project Timeline Page Component
 * 
 * Displays interactive timeline views of projects, including milestones,
 * tasks, and scheduled meetings.
 */
const ProjectTimeline = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const projectIdParam = searchParams.get('project')
  
  const [projects, setProjects] = useState<Project[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectIdParam || 'all')
  const [viewMode, setViewMode] = useState<'gantt' | 'list' | 'calendar'>('gantt')
  const [timeScale, setTimeScale] = useState<'days' | 'weeks' | 'months'>('weeks')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [visibleDateRange, setVisibleDateRange] = useState<{ start: Date, end: Date }>({ 
    start: new Date(), 
    end: new Date()
  })
  const [zoomLevel, setZoomLevel] = useState<number>(2) // 1-5 scale where 1 is most zoomed out
  
  // Update URL when selected project changes
  useEffect(() => {
    if (selectedProjectId !== 'all') {
      setSearchParams({ project: selectedProjectId })
    } else {
      setSearchParams({})
    }
  }, [selectedProjectId, setSearchParams])
  
  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchTimelineData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for projects
        const mockProjects: Project[] = [
          {
            id: 'proj-1',
            name: 'Website Redesign',
            description: 'Complete redesign of the corporate website with updated branding and improved user experience.',
            startDate: '2025-01-15',
            endDate: '2025-04-30',
            status: 'On Track',
            progress: 68
          },
          {
            id: 'proj-2',
            name: 'Mobile App Development',
            description: 'Development of native mobile applications for iOS and Android platforms.',
            startDate: '2025-02-01',
            endDate: '2025-05-15',
            status: 'At Risk',
            progress: 35
          },
          {
            id: 'proj-3',
            name: 'Content Creation',
            description: 'Creation of marketing content including blog posts, videos, and social media assets.',
            startDate: '2025-02-15',
            endDate: '2025-04-10',
            status: 'Behind',
            progress: 22
          },
        ]
        
        // Mock data for milestones
        const mockMilestones: Milestone[] = [
          // Website Redesign milestones
          {
            id: 'ms-1-1',
            projectId: 'proj-1',
            title: 'Design Approval',
            description: 'Finalize and approve all website design mockups',
            date: '2025-02-01',
            status: 'Completed'
          },
          {
            id: 'ms-1-2',
            projectId: 'proj-1',
            title: 'Content Migration',
            description: 'Migrate existing content to new site structure',
            date: '2025-03-15',
            status: 'Completed',
            dependencies: ['ms-1-1']
          },
          {
            id: 'ms-1-3',
            projectId: 'proj-1',
            title: 'Beta Launch',
            description: 'Launch beta version for internal testing',
            date: '2025-04-01',
            status: 'In Progress',
            dependencies: ['ms-1-2']
          },
          {
            id: 'ms-1-4',
            projectId: 'proj-1',
            title: 'Public Launch',
            description: 'Official launch of the new website',
            date: '2025-04-30',
            status: 'Pending',
            dependencies: ['ms-1-3']
          },
          
          // Mobile App Development milestones
          {
            id: 'ms-2-1',
            projectId: 'proj-2',
            title: 'Requirements Finalization',
            description: 'Finalize app requirements and features',
            date: '2025-02-15',
            status: 'Completed'
          },
          {
            id: 'ms-2-2',
            projectId: 'proj-2',
            title: 'UI/UX Design Approval',
            description: 'Approve app designs and user flows',
            date: '2025-03-10',
            status: 'Delayed',
            dependencies: ['ms-2-1']
          },
          {
            id: 'ms-2-3',
            projectId: 'proj-2',
            title: 'Alpha Version',
            description: 'Complete first testable version',
            date: '2025-04-15',
            status: 'Pending',
            dependencies: ['ms-2-2']
          },
          {
            id: 'ms-2-4',
            projectId: 'proj-2',
            title: 'App Store Submission',
            description: 'Submit apps to respective app stores',
            date: '2025-05-10',
            status: 'Pending',
            dependencies: ['ms-2-3']
          },
          
          // Content Creation milestones
          {
            id: 'ms-3-1',
            projectId: 'proj-3',
            title: 'Content Strategy',
            description: 'Finalize content strategy and calendar',
            date: '2025-02-20',
            status: 'Completed'
          },
          {
            id: 'ms-3-2',
            projectId: 'proj-3',
            title: 'Initial Content Batch',
            description: 'Complete first batch of content assets',
            date: '2025-03-15',
            status: 'Delayed',
            dependencies: ['ms-3-1']
          },
          {
            id: 'ms-3-3',
            projectId: 'proj-3',
            title: 'Content Distribution',
            description: 'Begin distribution across platforms',
            date: '2025-03-30',
            status: 'Pending',
            dependencies: ['ms-3-2']
          },
        ]
        
        // Mock data for tasks (simplified, would be many more in real app)
        const mockTasks: Task[] = [
          // Website Redesign tasks
          {
            id: 'task-1-1',
            projectId: 'proj-1',
            milestoneId: 'ms-1-1',
            title: 'Create wireframes',
            description: 'Create initial wireframes for key pages',
            assignee: 'Jamie Lee',
            startDate: '2025-01-18',
            endDate: '2025-01-25',
            status: 'Completed',
            progress: 100
          },
          {
            id: 'task-1-2',
            projectId: 'proj-1',
            milestoneId: 'ms-1-1',
            title: 'Design mockups',
            description: 'Create high-fidelity mockups based on wireframes',
            assignee: 'Jamie Lee',
            startDate: '2025-01-26',
            endDate: '2025-02-01',
            status: 'Completed',
            progress: 100
          },
          {
            id: 'task-1-3',
            projectId: 'proj-1',
            milestoneId: 'ms-1-2',
            title: 'Content audit',
            description: 'Audit existing content and identify gaps',
            assignee: 'Morgan Smith',
            startDate: '2025-02-05',
            endDate: '2025-02-15',
            status: 'Completed',
            progress: 100
          },
          {
            id: 'task-1-4',
            projectId: 'proj-1',
            milestoneId: 'ms-1-3',
            title: 'Frontend implementation',
            description: 'Implement frontend components based on approved designs',
            assignee: 'Sam Taylor',
            startDate: '2025-03-01',
            endDate: '2025-03-20',
            status: 'In Progress',
            progress: 85
          },
          
          // Mobile App Development tasks
          {
            id: 'task-2-1',
            projectId: 'proj-2',
            milestoneId: 'ms-2-1',
            title: 'Requirements gathering',
            description: 'Gather and document app requirements',
            assignee: 'Alex Johnson',
            startDate: '2025-02-01',
            endDate: '2025-02-15',
            status: 'Completed',
            progress: 100
          },
          {
            id: 'task-2-2',
            projectId: 'proj-2',
            milestoneId: 'ms-2-2',
            title: 'App flow design',
            description: 'Design user flows and navigation structure',
            assignee: 'Jamie Lee',
            startDate: '2025-02-18',
            endDate: '2025-03-01',
            status: 'Completed',
            progress: 100
          },
          {
            id: 'task-2-3',
            projectId: 'proj-2',
            milestoneId: 'ms-2-2',
            title: 'UI components design',
            description: 'Design key UI components and screens',
            assignee: 'Jamie Lee',
            startDate: '2025-03-02',
            endDate: '2025-03-10',
            status: 'In Progress',
            progress: 90
          },
          
          // Content Creation tasks
          {
            id: 'task-3-1',
            projectId: 'proj-3',
            milestoneId: 'ms-3-1',
            title: 'Content strategy document',
            description: 'Create detailed content strategy document',
            assignee: 'Morgan Smith',
            startDate: '2025-02-15',
            endDate: '2025-02-20',
            status: 'Completed',
            progress: 100
          },
          {
            id: 'task-3-2',
            projectId: 'proj-3',
            milestoneId: 'ms-3-2',
            title: 'Blog post writing',
            description: 'Write first batch of blog posts',
            assignee: 'Morgan Smith',
            startDate: '2025-02-22',
            endDate: '2025-03-05',
            status: 'In Progress',
            progress: 70
          },
        ]
        
        // Mock data for meetings
        const mockMeetings: Meeting[] = [
          {
            id: 'meet-1-1',
            projectId: 'proj-1',
            title: 'Weekly Status Meeting',
            description: 'Weekly status update for Website Redesign project',
            date: '2025-04-02',
            time: '10:00 AM',
            duration: 60,
            platform: 'Zoom',
            participants: ['Alex Johnson', 'Jamie Lee', 'Sam Taylor', 'Morgan Smith']
          },
          {
            id: 'meet-1-2',
            projectId: 'proj-1',
            title: 'Beta Launch Planning',
            description: 'Planning meeting for the beta launch',
            date: '2025-03-25',
            time: '2:00 PM',
            duration: 90,
            platform: 'Microsoft Teams',
            participants: ['Alex Johnson', 'Sam Taylor']
          },
          {
            id: 'meet-2-1',
            projectId: 'proj-2',
            title: 'Mobile App Demo',
            description: 'Demo of current app progress',
            date: '2025-04-05',
            time: '2:30 PM',
            duration: 60,
            platform: 'Microsoft Teams',
            participants: ['Alex Johnson', 'Jamie Lee', 'Sam Taylor']
          },
          {
            id: 'meet-3-1',
            projectId: 'proj-3',
            title: 'Content Planning',
            description: 'Content planning and review session',
            date: '2025-04-08',
            time: '11:00 AM',
            duration: 60,
            platform: 'Google Meet',
            participants: ['Alex Johnson', 'Morgan Smith']
          },
        ]
        
        setProjects(mockProjects)
        setMilestones(mockMilestones)
        setTasks(mockTasks)
        setMeetings(mockMeetings)
        
        // Set initial timeline boundaries
        const { startDate, endDate } = getTimelineBoundaries(mockProjects)
        setVisibleDateRange({ start: startDate, end: endDate })
        
      } catch (error) {
        console.error('Error fetching timeline data:', error)
        // Handle error appropriately
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTimelineData()
  }, [])
  
  // Helper function to get status color class
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'in progress':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'on track':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'pending':
        return 'bg-slate-500 hover:bg-slate-600'
      case 'blocked':
        return 'bg-red-500 hover:bg-red-600'
      case 'delayed':
        return 'bg-amber-500 hover:bg-amber-600'
      case 'at risk':
        return 'bg-amber-500 hover:bg-amber-600'
      case 'behind':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-slate-500 hover:bg-slate-600'
    }
  }
  
  // Function to filter items based on selected project
  const filterByProject = <T extends { projectId: string }>(items: T[]): T[] => {
    if (selectedProjectId === 'all') return items
    return items.filter(item => item.projectId === selectedProjectId)
  }

  // Filter projects for display (when selecting "all projects")
  const getFilteredProjects = (): Project[] => {
    if (selectedProjectId === 'all') return projects
    return projects.filter(project => project.id === selectedProjectId)
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Function to adjust the visible date range
  const adjustVisibleDateRange = (direction: 'prev' | 'next') => {
    const { start, end } = visibleDateRange
    
    // Get the total days in current range
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    // Move forward or backward by the number of days in the current range
    if (direction === 'prev') {
      const newStart = new Date(start)
      newStart.setDate(start.getDate() - totalDays)
      const newEnd = new Date(end)
      newEnd.setDate(end.getDate() - totalDays)
      setVisibleDateRange({ start: newStart, end: newEnd })
    } else {
      const newStart = new Date(start)
      newStart.setDate(start.getDate() + totalDays)
      const newEnd = new Date(end)
      newEnd.setDate(end.getDate() + totalDays)
      setVisibleDateRange({ start: newStart, end: newEnd })
    }
  }
  
  // Function to adjust zoom level
  const adjustZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoomLevel < 5) {
      setZoomLevel(zoomLevel + 1)
      
      // When zooming in, reduce the date range by ~25%
      const { start, end } = visibleDateRange
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const daysToReduce = Math.floor(totalDays * 0.25)
      
      const newStart = new Date(start)
      newStart.setDate(start.getDate() + daysToReduce / 2)
      const newEnd = new Date(end)
      newEnd.setDate(end.getDate() - daysToReduce / 2)
      
      setVisibleDateRange({ start: newStart, end: newEnd })
    } else if (direction === 'out' && zoomLevel > 1) {
      setZoomLevel(zoomLevel - 1)
      
      // When zooming out, expand the date range by ~33%
      const { start, end } = visibleDateRange
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const daysToAdd = Math.floor(totalDays * 0.33)
      
      const newStart = new Date(start)
      newStart.setDate(start.getDate() - daysToAdd / 2)
      const newEnd = new Date(end)
      newEnd.setDate(end.getDate() + daysToAdd / 2)
      
      setVisibleDateRange({ start: newStart, end: newEnd })
    }
  }
  
  // Generate dates for the visible range based on current zoom level and time scale
  const getVisibleDates = () => {
    const { start, end } = visibleDateRange
    
    // Basic date range
    const allDates = generateDateRange(start, end)
    
    // Filter dates based on time scale
    if (timeScale === 'days') {
      return allDates
    } else if (timeScale === 'weeks') {
      // Only keep Mondays (or the first day of the range and subsequent Mondays)
      return allDates.filter((date, index) => 
        index === 0 || date.getDay() === 1 || index === allDates.length - 1
      )
    } else { // months
      // Only keep the 1st of each month (or the first day of the range and subsequent 1sts)
      return allDates.filter((date, index) => 
        index === 0 || date.getDate() === 1 || index === allDates.length - 1
      )
    }
  }
  
  // Get visible dates for the timeline
  const visibleDates = getVisibleDates()
  
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
          <h1 className="text-3xl font-bold tracking-tight">Project Timeline</h1>
          <p className="text-muted-foreground">
            View timelines, milestones, and scheduled meetings for your projects
          </p>
        </div>
      </div>
      
      {/* Timeline Controls */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Timeline Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="project-filter">Project</Label>
              <Select 
                value={selectedProjectId} 
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project-filter">
                  <SelectValue placeholder="Select Project" />
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
              <Label htmlFor="view-mode">View Mode</Label>
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger id="view-mode">
                  <SelectValue placeholder="Select View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gantt">Gantt Chart</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="calendar">Calendar View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="time-scale">Time Scale</Label>
              <Select value={timeScale} onValueChange={(value: any) => setTimeScale(value)}>
                <SelectTrigger id="time-scale">
                  <SelectValue placeholder="Select Scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-4 flex items-end space-x-2">
              <Button variant="outline" size="icon" onClick={() => adjustVisibleDateRange('prev')}>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 text-center text-sm font-medium">
                {formatDate(visibleDateRange.start.toISOString())} - {formatDate(visibleDateRange.end.toISOString())}
              </div>
              
              <Button variant="outline" size="icon" onClick={() => adjustVisibleDateRange('next')}>
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => adjustZoom('out')} disabled={zoomLevel === 1}>
                <ZoomOutIcon className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => adjustZoom('in')} disabled={zoomLevel === 5}>
                <ZoomInIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Timeline View */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        <TabsList className="hidden">
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        {/* Gantt Chart View */}
        <TabsContent value="gantt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>
                Gantt chart view of project milestones and tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Timeline Header - Date Scale */}
              <div className="overflow-x-auto pb-6">
                <div className="min-w-max">
                  {/* Time Scale Header */}
                  <div className="flex border-b">
                    <div className="w-48 flex-shrink-0 p-2 font-medium">Milestone / Task</div>
                    <div className="flex-1 flex">
                      {visibleDates.map((date, index) => (
                        <div 
                          key={date.toISOString()} 
                          className={`
                            flex-1 p-2 text-center text-xs font-medium border-l
                            ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-accent/50' : ''}
                          `}
                        >
                          {date.toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric',
                            ...(date.getDate() === 1 || index === 0 ? { year: 'numeric' } : {})
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Projects section */}
                  {getFilteredProjects().map(project => (
                    <div key={project.id} className="border-b">
                      {/* Project row */}
                      <div className="flex bg-accent/80">
                        <div className="w-48 flex-shrink-0 p-2 font-medium">
                          {project.name}
                        </div>
                        
                        <div className="flex-1 flex relative">
                          {/* Project timeline bar */}
                          <div 
                            className="absolute h-6 rounded-full bg-primary/20 top-1/2 transform -translate-y-1/2"
                            style={{
                              left: `${calculatePositionPercentage(new Date(project.startDate), visibleDates)}%`,
                              width: `${calculateWidthPercentage(new Date(project.startDate), new Date(project.endDate), visibleDates)}%`,
                            }}
                          >
                            <div 
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          
                          {/* Date grid columns */}
                          {visibleDates.map(date => (
                            <div 
                              key={date.toISOString()} 
                              className={`
                                flex-1 p-2 border-l
                                ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-accent/50' : ''}
                              `}
                            >
                              &nbsp;
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Milestones for this project */}
                      {milestones
                        .filter(m => m.projectId === project.id)
                        .map(milestone => (
                          <div key={milestone.id} className="flex hover:bg-accent/30 transition-colors">
                            <div className="w-48 flex-shrink-0 p-2 pl-4 border-l-4 border-blue-500">
                              <div className="text-sm font-medium flex items-center">
                                <span>📍</span> {milestone.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(milestone.date)}
                              </div>
                            </div>
                            
                            <div className="flex-1 flex relative">
                              {/* Milestone marker */}
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                                style={{
                                  left: `${calculatePositionPercentage(new Date(milestone.date), visibleDates)}%`,
                                }}
                              >
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={`
                                        w-4 h-4 rounded-full 
                                        ${milestone.status === 'Completed' ? 'bg-emerald-500' : 
                                          milestone.status === 'In Progress' ? 'bg-blue-500' :
                                          milestone.status === 'Delayed' ? 'bg-amber-500' : 'bg-slate-500'}
                                      `}></div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="font-medium">{milestone.title}</p>
                                      <p className="text-xs">{milestone.description}</p>
                                      <p className="text-xs mt-1">Status: {milestone.status}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              
                              {/* Date grid columns */}
                              {visibleDates.map(date => (
                                <div 
                                  key={date.toISOString()} 
                                  className={`
                                    flex-1 p-2 border-l border-t border-dashed
                                    ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-accent/20' : ''}
                                  `}
                                >
                                  &nbsp;
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      
                      {/* Tasks for this project */}
                      {tasks
                        .filter(t => t.projectId === project.id)
                        .map(task => (
                          <div key={task.id} className="flex hover:bg-accent/30 transition-colors">
                            <div className="w-48 flex-shrink-0 p-2 pl-6 border-l-2 border-green-500">
                              <div className="text-sm flex items-center">
                                <span>🔷</span> {task.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(task.startDate)} - {formatDate(task.endDate)}
                              </div>
                            </div>
                            
                            <div className="flex-1 flex relative">
                              {/* Task timeline bar */}
                              <div 
                                className="absolute h-5 rounded-sm bg-blue-200 top-1/2 transform -translate-y-1/2 border border-blue-400"
                                style={{
                                  left: `${calculatePositionPercentage(new Date(task.startDate), visibleDates)}%`,
                                  width: `${calculateWidthPercentage(new Date(task.startDate), new Date(task.endDate), visibleDates)}%`,
                                }}
                              >
                                <div 
                                  className="h-full rounded-sm bg-blue-500"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                                        {task.progress}%
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="font-medium">{task.title}</p>
                                      <p className="text-xs">{task.description}</p>
                                      <p className="text-xs mt-1">Assignee: {task.assignee}</p>
                                      <p className="text-xs">Status: {task.status}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              
                              {/* Date grid columns */}
                              {visibleDates.map(date => (
                                <div 
                                  key={date.toISOString()} 
                                  className={`
                                    flex-1 p-2 border-l border-t border-dashed
                                    ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-accent/20' : ''}
                                  `}
                                >
                                  &nbsp;
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                  
                  {/* Meetings section (shown at the bottom of chart) */}
                  <div className="border-b">
                    <div className="flex bg-accent/80">
                      <div className="w-48 flex-shrink-0 p-2 font-medium">
                        Scheduled Meetings
                      </div>
                      
                      <div className="flex-1 flex">
                        {visibleDates.map(date => (
                          <div 
                            key={date.toISOString()} 
                            className={`
                              flex-1 p-2 border-l
                              ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-accent/50' : ''}
                            `}
                          >
                            &nbsp;
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex relative min-h-16">
                      <div className="w-48 flex-shrink-0"></div>
                      
                      <div className="flex-1 flex relative">
                        {/* Meeting markers */}
                        {filterByProject(meetings).map(meeting => (
                          <div 
                            key={meeting.id}
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                            style={{
                              left: `${calculatePositionPercentage(new Date(meeting.date), visibleDates)}%`,
                            }}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                                    📅
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-medium">{meeting.title}</p>
                                  <p className="text-xs">{meeting.description}</p>
                                  <p className="text-xs mt-1">
                                    {formatDate(meeting.date)} @ {meeting.time} 
                                    ({meeting.duration} min)
                                  </p>
                                  <p className="text-xs">Platform: {meeting.platform}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))}
                        
                        {/* Date grid columns */}
                        {visibleDates.map(date => (
                          <div 
                            key={date.toISOString()} 
                            className={`
                              flex-1 p-2 border-l
                              ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-accent/20' : ''}
                            `}
                          >
                            &nbsp;
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* List View */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>
                List view of project milestones, tasks and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Milestones Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Milestones</h3>
                  <div className="space-y-3">
                    {filterByProject(milestones).map(milestone => (
                      <div key={milestone.id} className="flex flex-col sm:flex-row gap-3 p-3 border rounded-lg hover:bg-accent/30 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div 
                              className={`
                                w-3 h-3 rounded-full mr-2
                                ${milestone.status === 'Completed' ? 'bg-emerald-500' : 
                                  milestone.status === 'In Progress' ? 'bg-blue-500' :
                                  milestone.status === 'Delayed' ? 'bg-amber-500' : 'bg-slate-500'}
                              `}
                            ></div>
                            <div className="font-medium">{milestone.title}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        </div>
                        
                        <div className="sm:w-48 flex flex-row sm:flex-col gap-3 sm:gap-1 items-start sm:items-end sm:text-right">
                          <div className="text-sm">
                            <CalendarIcon className="inline h-3 w-3 mr-1" />
                            {formatDate(milestone.date)}
                          </div>
                          <Badge className={getStatusColorClass(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tasks Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Tasks</h3>
                  <div className="space-y-3">
                    {filterByProject(tasks).map(task => (
                      <div key={task.id} className="p-3 border rounded-lg hover:bg-accent/30 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="text-sm text-muted-foreground mt-2">
                              Assignee: {task.assignee}
                            </div>
                          </div>
                          
                          <div className="sm:w-48 flex flex-row sm:flex-col gap-3 sm:gap-1 items-start sm:items-end sm:text-right">
                            <div className="text-sm">
                              <CalendarIcon className="inline h-3 w-3 mr-1" />
                              {formatDate(task.startDate)} - {formatDate(task.endDate)}
                            </div>
                            <Badge className={getStatusColorClass(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm mb-1 flex justify-between">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-accent/50 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Meetings Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Upcoming Meetings</h3>
                  <div className="space-y-3">
                    {filterByProject(meetings).map(meeting => (
                      <div key={meeting.id} className="p-3 border rounded-lg hover:bg-accent/30 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <div className="font-medium">{meeting.title}</div>
                            <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                            <div className="text-sm text-muted-foreground mt-2">
                              Platform: {meeting.platform}
                            </div>
                          </div>
                          
                          <div className="sm:w-48 flex flex-col gap-1 sm:items-end sm:text-right">
                            <div className="text-sm">
                              <CalendarIcon className="inline h-3 w-3 mr-1" />
                              {formatDate(meeting.date)}
                            </div>
                            <div className="text-sm">
                              {meeting.time} ({meeting.duration} min)
                            </div>
                            <Badge variant="outline" className="mt-1">
                              {meeting.participants.length} Participants
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Calendar view of project events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-lg text-muted-foreground">
                Calendar view is under development
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to calculate the position percentage for an element on the timeline
function calculatePositionPercentage(date: Date, visibleDates: Date[]) {
  if (!visibleDates.length) return 0
  
  const firstDate = visibleDates[0]
  const lastDate = visibleDates[visibleDates.length - 1]
  const totalRange = lastDate.getTime() - firstDate.getTime()
  
  // If somehow the range is 0 (same day), position at 0%
  if (totalRange === 0) return 0
  
  // Calculate where this date falls in the range as a percentage
  const datePosition = date.getTime() - firstDate.getTime()
  return (datePosition / totalRange) * 100
}

// Helper function to calculate the width percentage for an element on the timeline
function calculateWidthPercentage(startDate: Date, endDate: Date, visibleDates: Date[]) {
  if (!visibleDates.length) return 0
  
  const firstVisibleDate = visibleDates[0]
  const lastVisibleDate = visibleDates[visibleDates.length - 1]
  const totalRange = lastVisibleDate.getTime() - firstVisibleDate.getTime()
  
  // If somehow the range is 0 (same day), default to a small width
  if (totalRange === 0) return 5
  
  // Calculate the width based on the duration as a percentage of total visible range
  const duration = endDate.getTime() - startDate.getTime()
  return (duration / totalRange) * 100
}

export default ProjectTimeline