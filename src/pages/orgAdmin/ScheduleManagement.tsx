import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, isToday, isAfter, isBefore, parseISO } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List, Grid, Calendar, CheckCircle, AlertTriangle, Users, ArrowRight, PlusCircle, MoreHorizontal} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Types for schedule management
 */
interface Project {
  id: string
  name: string
  color: string
  startDate: string
  endDate: string
  progress: number
  teamMembers: TeamMember[]
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  availableHours: number
  assignedHours: number
  color: string
}

interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  assigneeId: string
  startDate: string
  endDate: string
  status: 'planned' | 'in-progress' | 'completed' | 'delayed'
  priority: 'low' | 'medium' | 'high'
}

interface Conflict {
  id: string
  type: 'resource-overallocation' | 'deadline-at-risk' | 'dependency-conflict'
  description: string
  affectedTasks: string[]
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
}

/**
 * ScheduleManagement component for Organization Admin
 */
const ScheduleManagement = () => {
  const [view, setView] = useState<'timeline' | 'calendar' | 'list'>('timeline')
  const [date, setDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showConflictDetails, setShowConflictDetails] = useState<string | null>(null)
  
  // Mock data - using projects state without the setter since we don't modify it in this component
  const [projects] = useState<Project[]>([
    {
      id: "proj-1",
      name: "Website Redesign",
      color: "#3b82f6", // blue
      startDate: "2025-03-15",
      endDate: "2025-05-20",
      progress: 35,
      teamMembers: [
        { id: "tm-1", name: "John Doe", role: "Developer", avatar: "https://ui-avatars.com/api/?name=John+Doe", availableHours: 40, assignedHours: 35, color: "#10b981" },
        { id: "tm-2", name: "Jane Smith", role: "Designer", avatar: "https://ui-avatars.com/api/?name=Jane+Smith", availableHours: 30, assignedHours: 28, color: "#6366f1" }
      ]
    },
    {
      id: "proj-2",
      name: "Mobile App Development",
      color: "#f43f5e", // rose
      startDate: "2025-03-01",
      endDate: "2025-06-15",
      progress: 20,
      teamMembers: [
        { id: "tm-1", name: "John Doe", role: "Developer", avatar: "https://ui-avatars.com/api/?name=John+Doe", availableHours: 40, assignedHours: 35, color: "#10b981" },
        { id: "tm-3", name: "Mark Johnson", role: "QA Engineer", avatar: "https://ui-avatars.com/api/?name=Mark+Johnson", availableHours: 40, assignedHours: 30, color: "#a855f7" }
      ]
    },
    {
      id: "proj-3",
      name: "E-commerce Platform",
      color: "#a855f7", // purple
      startDate: "2025-04-01",
      endDate: "2025-07-30",
      progress: 5,
      teamMembers: [
        { id: "tm-2", name: "Jane Smith", role: "Designer", avatar: "https://ui-avatars.com/api/?name=Jane+Smith", availableHours: 30, assignedHours: 28, color: "#6366f1" },
        { id: "tm-4", name: "Sarah Wilson", role: "Product Manager", avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson", availableHours: 35, assignedHours: 20, color: "#f59e0b" }
      ]
    }
  ])
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Design Homepage Mockups",
      description: "Create wireframes and mockups for the new homepage design",
      projectId: "proj-1",
      assigneeId: "tm-2",
      startDate: "2025-03-20",
      endDate: "2025-03-27",
      status: "in-progress",
      priority: "high"
    },
    {
      id: "task-2",
      title: "Implement User Authentication",
      description: "Set up user registration and login functionality",
      projectId: "proj-1",
      assigneeId: "tm-1",
      startDate: "2025-03-25",
      endDate: "2025-04-05",
      status: "planned",
      priority: "medium"
    },
    {
      id: "task-3",
      title: "Database Schema Design",
      description: "Design database schema for the mobile app",
      projectId: "proj-2",
      assigneeId: "tm-1",
      startDate: "2025-03-10",
      endDate: "2025-03-20",
      status: "completed",
      priority: "high"
    },
    {
      id: "task-4",
      title: "API Development",
      description: "Develop REST APIs for the mobile app",
      projectId: "proj-2",
      assigneeId: "tm-1",
      startDate: "2025-03-22",
      endDate: "2025-04-10",
      status: "in-progress",
      priority: "high"
    },
    {
      id: "task-5",
      title: "UI Component Library",
      description: "Create reusable UI components for the design system",
      projectId: "proj-1",
      assigneeId: "tm-2",
      startDate: "2025-03-28",
      endDate: "2025-04-15",
      status: "planned",
      priority: "medium"
    },
    {
      id: "task-6",
      title: "E-commerce Product Page Design",
      description: "Design the product listing and detail pages",
      projectId: "proj-3",
      assigneeId: "tm-2",
      startDate: "2025-04-05",
      endDate: "2025-04-15",
      status: "planned",
      priority: "medium"
    }
  ])
  
  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: "conflict-1",
      type: "resource-overallocation",
      description: "John Doe is assigned to multiple tasks simultaneously exceeding available hours",
      affectedTasks: ["task-2", "task-4"],
      severity: "high",
      resolved: false
    },
    {
      id: "conflict-2",
      type: "deadline-at-risk",
      description: "UI Component Library task may miss its deadline based on current progress",
      affectedTasks: ["task-5"],
      severity: "medium",
      resolved: false
    },
    {
      id: "conflict-3",
      type: "dependency-conflict",
      description: "Task dependency issue detected: Homepage implementation depends on completed UI components",
      affectedTasks: ["task-1", "task-5"],
      severity: "medium",
      resolved: true
    }
  ])

  // Form schema for adding a new task
  const taskFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Please select a project"),
    assigneeId: z.string().min(1, "Please select an assignee"),
    startDate: z.date({
      required_error: "Please select a start date",
    }),
    endDate: z.date({
      required_error: "Please select an end date",
    }),
    priority: z.enum(["low", "medium", "high"], {
      required_error: "Please select a priority",
    }),
  })
  .refine(data => isBefore(data.startDate, data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

  // Initialize form
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      assigneeId: "",
      priority: "medium",
    }
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!showAddTask) {
      form.reset()
    }
  }, [showAddTask, form])

  /**
   * Handle form submission for adding a new task
   */
  const onSubmit = (data: z.infer<typeof taskFormSchema>) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
        status: "planned",
        priority: data.priority,
      }
      
      setTasks(prev => [...prev, newTask])
      setShowAddTask(false)
      setIsLoading(false)
      toast.success("Task created successfully!")
    }, 1000)
  }

  /**
   * Get all team members across projects
   */
  const getAllTeamMembers = () => {
    const allMembers: Record<string, TeamMember> = {}
    
    projects.forEach(project => {
      project.teamMembers.forEach(member => {
        if (!allMembers[member.id]) {
          allMembers[member.id] = member
        }
      })
    })
    
    return Object.values(allMembers)
  }

  /**
   * Get project by ID
   */
  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id)
  }

  /**
   * Get team member by ID
   */
  const getTeamMemberById = (id: string) => {
    return getAllTeamMembers().find(tm => tm.id === id)
  }

  /**
   * Resolve a conflict
   */
  const resolveConflict = (id: string) => {
    setConflicts(prev => 
      prev.map(conflict => 
        conflict.id === id ? { ...conflict, resolved: true } : conflict
      )
    )
    
    setShowConflictDetails(null)
    toast.success("Conflict marked as resolved")
  }

  /**
   * Get status badge variant based on task status
   */
  const getStatusBadgeVariant = (status: Task['status']) => {
    switch (status) {
      case 'completed': return "default"
      case 'in-progress': return "secondary"
      case 'planned': return "outline"
      case 'delayed': return "destructive"
      default: return "outline"
    }
  }

  /**
   * Get priority badge variant based on task priority
   */
  const getPriorityBadgeVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return "destructive"
      case 'medium': return "default"
      case 'low': return "secondary"
      default: return "outline"
    }
  }

  // Get selected conflict details
  const selectedConflict = showConflictDetails 
    ? conflicts.find(c => c.id === showConflictDetails) 
    : null
    
  // Get affected tasks for selected conflict
  const conflictTasks = selectedConflict
    ? tasks.filter(task => selectedConflict.affectedTasks.includes(task.id))
    : []
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
        <p className="text-muted-foreground">
          Manage project schedules, deadlines, and resource allocation across your organization.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6 w-full">
          {/* View controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'timeline' ? "default" : "outline"}
                size="sm"
                onClick={() => setView('timeline')}
              >
                <List className="mr-2 h-4 w-4" />
                Timeline
              </Button>
              <Button
                variant={view === 'calendar' ? "default" : "outline"}
                size="sm"
                onClick={() => setView('calendar')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={view === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setView('list')}
              >
                <Grid className="mr-2 h-4 w-4" />
                List
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 pl-3 pr-3 gap-1 whitespace-nowrap">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{format(date, "MMM d, yyyy")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button size="sm" onClick={() => setShowAddTask(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Timeline View */}
          {view === 'timeline' && (
            <Card>
              <CardHeader className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Project Timeline</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setDate(addDays(date, -7))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDate(addDays(date, 7))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Visualize project schedules and task timelines
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-8">
                  {projects.map(project => {
                    const projectTasks = tasks.filter(task => task.projectId === project.id)
                    
                    return (
                      <div key={project.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: project.color }}
                            />
                            <h3 className="font-medium">{project.name}</h3>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(project.startDate), "MMM d, yyyy")} - {format(parseISO(project.endDate), "MMM d, yyyy")}
                          </span>
                        </div>
                        
                        {/* Timeline */}
                        <div className="relative">
                          {/* Timeline bar */}
                          <div className="absolute top-0 h-1 bg-muted w-full rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${project.progress}%`,
                                backgroundColor: project.color 
                              }}
                            />
                          </div>
                          
                          {/* Tasks on timeline */}
                          <div className="pt-6 space-y-3">
                            {projectTasks.map(task => {
                              const taskAssignee = getTeamMemberById(task.assigneeId)
                              
                              return (
                                <div key={task.id} className="group">
                                  <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={taskAssignee?.avatar} alt={taskAssignee?.name} />
                                        <AvatarFallback>{taskAssignee?.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{task.title}</div>
                                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                          <span>{format(parseISO(task.startDate), "MMM d")}</span>
                                          <ArrowRight className="h-3 w-3" />
                                          <span>{format(parseISO(task.endDate), "MMM d")}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant={getStatusBadgeVariant(task.status)}>
                                        {task.status.replace('-', ' ')}
                                      </Badge>
                                      <Badge variant={getPriorityBadgeVariant(task.priority)}>
                                        {task.priority}
                                      </Badge>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                          <DropdownMenuItem>View Details</DropdownMenuItem>
                                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                                          <DropdownMenuItem>Reassign</DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem className="text-destructive">
                                            Delete Task
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calendar View */}
          {view === 'calendar' && (
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle>Task Calendar</CardTitle>
                <CardDescription>
                  View tasks by day and week
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-4 text-center font-medium">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div key={day} className="py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const currentDate = addDays(startOfWeek(date), i)
                      const isCurrentDay = isToday(currentDate)
                      const activeTasks = tasks.filter(task => {
                        const taskStartDate = parseISO(task.startDate)
                        const taskEndDate = parseISO(task.endDate)
                        return (
                          format(currentDate, "yyyy-MM-dd") === format(taskStartDate, "yyyy-MM-dd") ||
                          format(currentDate, "yyyy-MM-dd") === format(taskEndDate, "yyyy-MM-dd") ||
                          (isAfter(currentDate, taskStartDate) && isBefore(currentDate, taskEndDate))
                        )
                      })
                      
                      return (
                        <div 
                          key={i}
                          className={`min-h-[180px] p-2 border rounded-md ${
                            isCurrentDay ? "border-primary" : ""
                          }`}
                        >
                          <div className="text-right font-medium">
                            <span className={`inline-block rounded-full w-8 h-8 text-center leading-8 ${
                              isCurrentDay 
                                ? "bg-primary text-primary-foreground" 
                                : ""
                            }`}>
                              {format(currentDate, "d")}
                            </span>
                          </div>
                          <ScrollArea className="h-[130px] pr-3 mt-1">
                            <div className="space-y-2">
                              {activeTasks.map(task => {
                                const project = getProjectById(task.projectId)
                                
                                return (
                                  <div 
                                    key={task.id}
                                    className="p-2 rounded-sm text-xs"
                                    style={{ 
                                      backgroundColor: `${project?.color}30`,
                                      borderLeft: `2px solid ${project?.color}` 
                                    }}
                                  >
                                    <div className="font-medium truncate">{task.title}</div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-[10px] opacity-70">{project?.name}</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </ScrollArea>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List View */}
          {view === 'list' && (
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle>Task List</CardTitle>
                <CardDescription>
                  View and manage all scheduled tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 py-2 px-3 font-medium text-sm">
                    <div className="col-span-5">Task</div>
                    <div className="col-span-2">Project</div>
                    <div className="col-span-1">Priority</div>
                    <div className="col-span-2">Timeline</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {tasks.map(task => {
                    const project = getProjectById(task.projectId)
                    const taskAssignee = getTeamMemberById(task.assigneeId)
                    
                    return (
                      <div key={task.id} className="grid grid-cols-12 gap-4 py-3 px-3 border-b items-center hover:bg-muted/50 rounded-md transition-colors">
                        <div className="col-span-5">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={taskAssignee?.avatar} alt={taskAssignee?.name} />
                              <AvatarFallback>{taskAssignee?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Assigned to {taskAssignee?.name}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: project?.color }}
                            />
                            <span className="text-sm">{project?.name}</span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <Badge variant={getPriorityBadgeVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-sm">
                          <div>{format(parseISO(task.startDate), "MMM d")}</div>
                          <div className="text-muted-foreground">to {format(parseISO(task.endDate), "MMM d")}</div>
                        </div>
                        <div className="col-span-1">
                          <Badge variant={getStatusBadgeVariant(task.status)}>
                            {task.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuItem>Reassign</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-4">
          {/* Resource allocation */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-lg">Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent className="px-5">
              <ScrollArea className="h-[260px]">
                <div className="space-y-4">
                  {getAllTeamMembers().map(member => {
                    const utilization = (member.assignedHours / member.availableHours) * 100
                    
                    return (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                          <Badge variant={utilization > 90 ? "destructive" : utilization > 75 ? "secondary" : "outline"}>
                            {utilization.toFixed(0)}%
                          </Badge>
                        </div>

                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${utilization}%`,
                              backgroundColor: utilization > 90 ? "#f43f5e" : utilization > 75 ? "#f59e0b" : "#10b981"
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Schedule conflicts */}
          <Card className={conflicts.some(c => !c.resolved) ? "border-destructive" : ""}>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Schedule Conflicts</CardTitle>
                <Badge variant="outline">
                  {conflicts.filter(c => !c.resolved).length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-5">
              <ScrollArea className="h-[200px]">
                {conflicts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <p>No conflicts detected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conflicts.map(conflict => (
                      <div 
                        key={conflict.id} 
                        className={`p-3 rounded-md border ${
                          conflict.resolved 
                            ? "border-muted bg-muted/50" 
                            : conflict.severity === "high"
                              ? "border-destructive/50 bg-destructive/10"
                              : "border-orange-500/50 bg-orange-500/10"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                              conflict.resolved 
                                ? "text-muted-foreground" 
                                : conflict.severity === "high"
                                  ? "text-destructive"
                                  : "text-orange-500"
                            }`} />
                            <div>
                              <div className="font-medium text-sm">
                                {conflict.type === "resource-overallocation"
                                  ? "Resource Overallocation"
                                  : conflict.type === "deadline-at-risk"
                                    ? "Deadline at Risk"
                                    : "Dependency Conflict"}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {conflict.description}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={conflict.resolved ? "outline" : "default"}
                            className={`ml-2 ${
                              conflict.resolved 
                                ? "text-muted-foreground" 
                                : conflict.severity === "high"
                                  ? "bg-destructive hover:bg-destructive"
                                  : conflict.severity === "medium"
                                    ? "bg-orange-500 hover:bg-orange-500"
                                    : "bg-yellow-500 hover:bg-yellow-500"
                            }`}
                          >
                            {conflict.resolved ? "Resolved" : conflict.severity}
                          </Badge>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7"
                            onClick={() => setShowConflictDetails(conflict.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Upcoming deadlines */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="px-5">
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.status !== "completed")
                    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
                    .slice(0, 5)
                    .map(task => {
                      const project = getProjectById(task.projectId)
                      const taskAssignee = getTeamMemberById(task.assigneeId)
                      const daysUntilDeadline = Math.ceil(
                        (new Date(task.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      )
                      
                      return (
                        <div key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                          <div 
                            className="w-1 self-stretch rounded-full"
                            style={{ backgroundColor: project?.color }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">{project?.name}</div>
                              <div className="text-xs font-medium">
                                {daysUntilDeadline <= 0 
                                  ? <span className="text-destructive">Overdue</span>
                                  : daysUntilDeadline === 1
                                    ? <span className="text-destructive">Due tomorrow</span>
                                    : daysUntilDeadline <= 3
                                      ? <span className="text-orange-500">Due in {daysUntilDeadline} days</span>
                                      : <span>Due in {daysUntilDeadline} days</span>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your project schedule.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: project.color }}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.watch("projectId") ? (
                            getProjectById(form.watch("projectId"))?.teamMembers.map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {member.name}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              Select a project first
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task description (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Conflict Details Dialog */}
      <Dialog open={!!showConflictDetails} onOpenChange={(open) => !open && setShowConflictDetails(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Conflict Details</DialogTitle>
            <DialogDescription>
              View information about the detected schedule conflict.
            </DialogDescription>
          </DialogHeader>
          
          {selectedConflict && (
            <div className="space-y-4">
              <div className={`p-3 rounded-md border ${
                selectedConflict.resolved 
                  ? "border-muted bg-muted/50" 
                  : selectedConflict.severity === "high"
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-orange-500/50 bg-orange-500/10"
              }`}>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    selectedConflict.resolved 
                      ? "text-muted-foreground" 
                      : selectedConflict.severity === "high"
                        ? "text-destructive"
                        : "text-orange-500"
                  }`} />
                  <div>
                    <div className="font-medium">
                      {selectedConflict.type === "resource-overallocation"
                        ? "Resource Overallocation"
                        : selectedConflict.type === "deadline-at-risk"
                          ? "Deadline at Risk"
                          : "Dependency Conflict"}
                      <Badge 
                        variant={selectedConflict.resolved ? "outline" : "default"}
                        className={`ml-2 ${
                          selectedConflict.resolved 
                            ? "text-muted-foreground" 
                            : selectedConflict.severity === "high"
                              ? "bg-destructive hover:bg-destructive"
                              : selectedConflict.severity === "medium"
                                ? "bg-orange-500 hover:bg-orange-500"
                                : "bg-yellow-500 hover:bg-yellow-500"
                        }`}
                      >
                        {selectedConflict.resolved ? "Resolved" : selectedConflict.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedConflict.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Affected Tasks</h4>
                <div className="space-y-2">
                  {conflictTasks.map(task => {
                    const project = getProjectById(task.projectId)
                    const taskAssignee = getTeamMemberById(task.assigneeId)
                    
                    return (
                      <div key={task.id} className="flex items-center space-x-3 p-2 rounded-md border hover:bg-muted/50">
                        <div 
                          className="w-1 self-stretch rounded-full"
                          style={{ backgroundColor: project?.color }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">{project?.name}</div>
                            <div className="text-xs">
                              {format(parseISO(task.startDate), "MMM d")} - {format(parseISO(task.endDate), "MMM d")}
                            </div>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{taskAssignee?.name}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommended Actions</h4>
                <div className="space-y-2 text-sm">
                  {selectedConflict.type === "resource-overallocation" ? (
                    <>
                      <p>1. Reassign tasks to team members with available capacity</p>
                      <p>2. Adjust task timelines to distribute the workload</p>
                      <p>3. Increase resource capacity or extend deadlines</p>
                    </>
                  ) : selectedConflict.type === "deadline-at-risk" ? (
                    <>
                      <p>1. Review task progress and identify bottlenecks</p>
                      <p>2. Allocate additional resources to critical tasks</p>
                      <p>3. Communicate with stakeholders about potential delays</p>
                    </>
                  ) : (
                    <>
                      <p>1. Review task dependencies and resolve conflicts</p>
                      <p>2. Adjust task order and timing to align dependencies</p>
                      <p>3. Split dependent tasks into smaller, manageable chunks</p>
                    </>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <DialogFooter>
                <Button
                  type="button" 
                  variant="outline"
                  onClick={() => setShowConflictDetails(null)}
                >
                  Close
                </Button>
                {!selectedConflict.resolved && (
                  <Button onClick={() => resolveConflict(selectedConflict.id)}>
                    Mark as Resolved
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScheduleManagement