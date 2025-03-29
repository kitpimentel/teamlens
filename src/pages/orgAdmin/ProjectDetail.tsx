import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Download, 
  Edit2, 
  FilePlus, 
  MessageSquare, 
  MoreHorizontal,
  Plus,
  Shield,
  Users,
  AlertTriangle,
  XCircle,
  PlusCircle,
  UserPlus,
  Link as LinkIcon,
  FileText,
  Activity,
  ListChecks,
  Gauge,
  Flag
} from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for project data
 */
interface Project {
  id: string
  name: string
  description: string
  client: string
  clientId: string
  status: "active" | "completed" | "on_hold" | "cancelled"
  progress: number
  startDate: string
  endDate: string
  teamMembers: TeamMember[]
  teamLead: string
  budget?: number
  tags: string[]
  integrations: string[]
  healthScore?: number
  priority: "low" | "medium" | "high"
  lastUpdated: string
  tasks: Task[]
  milestones: Milestone[]
  recentActivity: ActivityItem[]
}

/**
 * Interface for team member data
 */
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  department: string
  hoursAllocated: number
}

/**
 * Interface for task data
 */
interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "review" | "completed" | "blocked"
  priority: "low" | "medium" | "high"
  assignee?: string
  assigneeId?: string
  assigneeAvatar?: string
  dueDate?: string
  createdAt: string
  tags: string[]
  blockedReason?: string
}

/**
 * Interface for milestone data
 */
interface Milestone {
  id: string
  title: string
  description: string
  status: "upcoming" | "in_progress" | "completed" | "missed"
  dueDate: string
  completedDate?: string
}

/**
 * Interface for activity item
 */
interface ActivityItem {
  id: string
  type: "comment" | "status_change" | "task_added" | "task_completed" | "milestone_reached" | "team_member_added"
  content: string
  user: string
  userAvatar?: string
  timestamp: string
  taskId?: string
  taskTitle?: string
}

/**
 * Project Detail component
 * Displays detailed information about a specific project
 */
const ProjectDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  
  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assigneeId: "",
    dueDate: ""
  })
  
  // Form state for new comment
  const [newComment, setNewComment] = useState("")
  
  // Form state for new team member
  const [newTeamMember, setNewTeamMember] = useState({
    email: "",
    role: ""
  })

  // Mock data for project
  useEffect(() => {
    // Simulate API call to fetch project data
    const fetchProject = async () => {
      setLoading(true)
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data for this project
      const mockProject: Project = {
        id: "proj-1",
        name: "Team Lens Dashboard",
        description: "Internal project management dashboard with advanced analytics and team coordination features. Integrated with various project management tools to provide a centralized view of all projects and team activities.",
        client: "Internal",
        clientId: "int-1",
        status: "active",
        progress: 85,
        startDate: "2025-01-15",
        endDate: "2025-04-15",
        teamMembers: [
          {
            id: "tm-1",
            name: "Sarah Chen",
            email: "sarah.chen@example.com",
            role: "Lead Developer",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
            department: "Development",
            hoursAllocated: 20
          },
          {
            id: "tm-2",
            name: "Jason Patel",
            email: "jason.patel@example.com",
            role: "UX Designer",
            avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
            department: "Design",
            hoursAllocated: 15
          },
          {
            id: "tm-3",
            name: "Michelle Wang",
            email: "michelle.wang@example.com",
            role: "Project Manager",
            avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
            department: "Management",
            hoursAllocated: 10
          },
          {
            id: "tm-5",
            name: "Emily Johnson",
            email: "emily.johnson@example.com",
            role: "Frontend Developer",
            avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
            department: "Development",
            hoursAllocated: 15
          }
        ],
        teamLead: "Michelle Wang",
        budget: 0,
        tags: ["Web App", "React", "TypeScript", "Internal"],
        integrations: ["JIRA", "GitHub"],
        healthScore: 92,
        priority: "high",
        lastUpdated: "2025-03-28T14:30:00Z",
        tasks: [
          {
            id: "task-1",
            title: "Design responsive dashboard layout",
            description: "Create a fully responsive dashboard layout with sidebar navigation, header, and main content area",
            status: "completed",
            priority: "high",
            assignee: "Jason Patel",
            assigneeId: "tm-2",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
            dueDate: "2025-02-15",
            createdAt: "2025-01-20T10:00:00Z",
            tags: ["Design", "UI/UX"]
          },
          {
            id: "task-2",
            title: "Implement authentication flow",
            description: "Create login, signup, forgot password, and user profile pages with JWT auth",
            status: "completed",
            priority: "high",
            assignee: "Sarah Chen",
            assigneeId: "tm-1",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
            dueDate: "2025-02-28",
            createdAt: "2025-01-25T09:30:00Z",
            tags: ["Backend", "Security"]
          },
          {
            id: "task-3",
            title: "Develop dashboard widgets",
            description: "Create reusable dashboard widgets for project status, team activity, and task overview",
            status: "in_progress",
            priority: "medium",
            assignee: "Emily Johnson",
            assigneeId: "tm-5",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
            dueDate: "2025-03-31",
            createdAt: "2025-02-10T11:45:00Z",
            tags: ["Frontend", "Components"]
          },
          {
            id: "task-4",
            title: "Integrate with JIRA API",
            description: "Connect to JIRA API to fetch projects, tasks, and synchronize updates",
            status: "in_progress",
            priority: "high",
            assignee: "Sarah Chen",
            assigneeId: "tm-1",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
            dueDate: "2025-04-05",
            createdAt: "2025-02-15T14:20:00Z",
            tags: ["Backend", "Integration"]
          },
          {
            id: "task-5",
            title: "Create data visualization components",
            description: "Develop charts and graphs for analytics dashboard using appropriate visualization library",
            status: "todo",
            priority: "medium",
            assignee: "Emily Johnson",
            assigneeId: "tm-5",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
            dueDate: "2025-04-10",
            createdAt: "2025-02-20T09:15:00Z",
            tags: ["Frontend", "Analytics"]
          },
          {
            id: "task-6",
            title: "Design onboarding user flow",
            description: "Create an onboarding experience for new users to guide them through the platform",
            status: "review",
            priority: "low",
            assignee: "Jason Patel",
            assigneeId: "tm-2",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
            dueDate: "2025-04-01",
            createdAt: "2025-03-01T10:30:00Z",
            tags: ["Design", "UX"]
          },
          {
            id: "task-7",
            title: "Fix cross-browser compatibility issues",
            description: "Ensure the application works correctly in all modern browsers (Chrome, Firefox, Safari, Edge)",
            status: "blocked",
            priority: "high",
            assignee: "Emily Johnson",
            assigneeId: "tm-5",
            assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
            dueDate: "2025-03-25",
            createdAt: "2025-03-10T11:00:00Z",
            tags: ["Frontend", "Bug Fix"],
            blockedReason: "Waiting for design updates for Safari-specific layout issues"
          }
        ],
        milestones: [
          {
            id: "milestone-1",
            title: "Design Phase Complete",
            description: "All UI/UX designs and mockups approved",
            status: "completed",
            dueDate: "2025-02-15",
            completedDate: "2025-02-14"
          },
          {
            id: "milestone-2",
            title: "Core Functionality Implemented",
            description: "Authentication, dashboard layout, and basic features completed",
            status: "completed",
            dueDate: "2025-03-15",
            completedDate: "2025-03-18"
          },
          {
            id: "milestone-3",
            title: "Integrations Completed",
            description: "All third-party integrations functional",
            status: "in_progress",
            dueDate: "2025-04-01"
          },
          {
            id: "milestone-4",
            title: "Project Launch",
            description: "Final testing, documentation, and deployment to production",
            status: "upcoming",
            dueDate: "2025-04-15"
          }
        ],
        recentActivity: [
          {
            id: "activity-1",
            type: "task_completed",
            content: "Completed task: Implement authentication flow",
            user: "Sarah Chen",
            userAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
            timestamp: "2025-03-28T14:30:00Z",
            taskId: "task-2",
            taskTitle: "Implement authentication flow"
          },
          {
            id: "activity-2",
            type: "comment",
            content: "I've found a better way to implement the dashboard layout for better performance. Let's discuss in the next meeting.",
            user: "Jason Patel",
            userAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
            timestamp: "2025-03-27T11:15:00Z"
          },
          {
            id: "activity-3",
            type: "milestone_reached",
            content: "Milestone reached: Core Functionality Implemented",
            user: "Michelle Wang",
            userAvatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
            timestamp: "2025-03-18T09:45:00Z"
          },
          {
            id: "activity-4",
            type: "status_change",
            content: "Changed task status from 'In Progress' to 'Blocked': Fix cross-browser compatibility issues",
            user: "Emily Johnson",
            userAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
            timestamp: "2025-03-15T16:20:00Z",
            taskId: "task-7",
            taskTitle: "Fix cross-browser compatibility issues"
          },
          {
            id: "activity-5",
            type: "task_added",
            content: "Added new task: Create data visualization components",
            user: "Michelle Wang",
            userAvatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
            timestamp: "2025-02-20T09:15:00Z",
            taskId: "task-5",
            taskTitle: "Create data visualization components"
          }
        ]
      }
      
      setProject(mockProject)
      setLoading(false)
    }
    
    fetchProject()
  }, [id])
  
  // Handle going back to projects list
  const handleBack = () => {
    navigate("/org-admin/projects")
  }
  
  // Handle adding a new task
  const handleAddTask = () => {
    if (!project) return
    
    // Validate form
    if (!newTask.title || !newTask.description || !newTask.priority) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Create new task
    const newTaskObj: Task = {
      id: `task-${project.tasks.length + 1}`,
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority as "low" | "medium" | "high",
      createdAt: new Date().toISOString(),
      tags: [],
      dueDate: newTask.dueDate || undefined
    }
    
    // Add assignee if selected
    if (newTask.assigneeId) {
      const assignee = project.teamMembers.find(member => member.id === newTask.assigneeId)
      if (assignee) {
        newTaskObj.assignee = assignee.name
        newTaskObj.assigneeId = assignee.id
        newTaskObj.assigneeAvatar = assignee.avatar
      }
    }
    
    // Add task to project
    const updatedProject: Project = {
      ...project,
      tasks: [...project.tasks, newTaskObj],
      recentActivity: [
        {
          id: `activity-${project.recentActivity.length + 1}`,
          type: "task_added", // Explicitly typed
          content: `Added new task: ${newTask.title}`,
          user: user?.name || "System",
          userAvatar: user?.avatar,
          timestamp: new Date().toISOString(),
          taskId: newTaskObj.id,
          taskTitle: newTask.title
        } as ActivityItem,
        ...project.recentActivity
      ]
    }
    
    setProject(updatedProject)
    setTaskDialogOpen(false)
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assigneeId: "",
      dueDate: ""
    })
    
    toast.success("Task added successfully")
  }
  
  // Handle adding a team member
  const handleAddTeamMember = () => {
    if (!project) return
    
    // Validate form
    if (!newTeamMember.email || !newTeamMember.role) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Create mock team member
    const randomId = Math.floor(Math.random() * 1000)
    const name = newTeamMember.email.split('@')[0].split('.').map(
      part => part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ')
    
    const newMember: TeamMember = {
      id: `tm-${randomId}`,
      name,
      email: newTeamMember.email,
      role: newTeamMember.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
      department: "New Hire",
      hoursAllocated: 0
    }
    
    // Update project
    const updatedProject: Project = {
      ...project,
      teamMembers: [...project.teamMembers, newMember],
      recentActivity: [
        {
          id: `activity-${project.recentActivity.length + 1}`,
          type: "team_member_added", // Explicitly typed
          content: `Added ${name} as ${newTeamMember.role}`,
          user: user?.name || "System",
          userAvatar: user?.avatar,
          timestamp: new Date().toISOString()
        } as ActivityItem,
        ...project.recentActivity
      ]
    }
    
    setProject(updatedProject)
    setInviteDialogOpen(false)
    
    // Reset form
    setNewTeamMember({
      email: "",
      role: ""
    })
    
    toast.success(`Invitation sent to ${newTeamMember.email}`)
  }
  
  // Handle adding a comment
  const handleAddComment = () => {
    if (!project || !newComment.trim()) return
    
    // Add comment to activity
    const updatedProject: Project = {
      ...project,
      recentActivity: [
        {
          id: `activity-${project.recentActivity.length + 1}`,
          type: "comment", // Explicitly typed
          content: newComment,
          user: user?.name || "System",
          userAvatar: user?.avatar,
          timestamp: new Date().toISOString()
        } as ActivityItem,
        ...project.recentActivity
      ]
    }
    
    setProject(updatedProject)
    setCommentDialogOpen(false)
    setNewComment("")
    
    toast.success("Comment added successfully")
  }
  
  // Handle changing task status
  const handleChangeTaskStatus = (taskId: string, newStatus: "todo" | "in_progress" | "review" | "completed" | "blocked") => {
    if (!project) return
    
    // Find task
    const taskIndex = project.tasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) return
    
    const task = project.tasks[taskIndex]
    const oldStatus = task.status
    
    // Skip if status is the same
    if (oldStatus === newStatus) return
    
    // Update task status
    const updatedTasks = [...project.tasks]
    updatedTasks[taskIndex] = {
      ...task,
      status: newStatus,
      // Clear blocked reason if no longer blocked
      blockedReason: newStatus === "blocked" ? task.blockedReason : undefined
    }
    
    // Add activity
    const activityContent = `Changed task status from '${formatStatus(oldStatus)}' to '${formatStatus(newStatus)}': ${task.title}`
    
    const updatedProject: Project = {
      ...project,
      tasks: updatedTasks,
      recentActivity: [
        {
          id: `activity-${project.recentActivity.length + 1}`,
          type: "status_change", // Explicitly typed
          content: activityContent,
          user: user?.name || "System",
          userAvatar: user?.avatar,
          timestamp: new Date().toISOString(),
          taskId: task.id,
          taskTitle: task.title
        } as ActivityItem,
        ...project.recentActivity
      ]
    }
    
    // Update project progress if needed
    if (newStatus === "completed" && oldStatus !== "completed") {
      // Calculate new progress based on completed tasks
      const totalTasks = updatedTasks.length
      const completedTasks = updatedTasks.filter(t => t.status === "completed").length
      const newProgress = Math.round((completedTasks / totalTasks) * 100)
      
      updatedProject.progress = newProgress
    } else if (newStatus !== "completed" && oldStatus === "completed") {
      // Recalculate if uncompleting a task
      const totalTasks = updatedTasks.length
      const completedTasks = updatedTasks.filter(t => t.status === "completed").length
      const newProgress = Math.round((completedTasks / totalTasks) * 100)
      
      updatedProject.progress = newProgress
    }
    
    setProject(updatedProject)
    toast.success(`Task status updated to ${formatStatus(newStatus)}`)
  }
  
  // Helper function to format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "todo": return "To Do"
      case "in_progress": return "In Progress"
      case "review": return "Review"
      case "completed": return "Completed"
      case "blocked": return "Blocked"
      default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }
  
  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "on_hold": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }
  
  // Helper function to get task status badge color
  const getTaskStatusBadgeColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "review": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "blocked": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }
  
  // Helper function to get milestone status badge color
  const getMilestoneStatusBadgeColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "missed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }
  
  // Helper function to get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }
  
  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "comment": return <MessageSquare className="h-4 w-4" />
      case "status_change": return <Edit2 className="h-4 w-4" />
      case "task_added": return <FilePlus className="h-4 w-4" />
      case "task_completed": return <CheckCircle className="h-4 w-4" />
      case "milestone_reached": return <Flag className="h-4 w-4" />
      case "team_member_added": return <UserPlus className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }
  
  // If loading show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  // If project not found
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-muted-foreground mb-4">The project you are looking for does not exist or has been removed.</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <Badge variant="outline" className={`${getStatusBadgeColor(project.status)} border-none ml-2`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          
          <Badge variant="outline" className={`${getPriorityBadgeColor(project.priority)} border-none`}>
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.client} • Project Lead: {project.teamLead}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Comment</DialogTitle>
                  <DialogDescription>
                    Add a comment to the project activity feed
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddComment}>Add Comment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTaskDialogOpen(true)}>
                  <ListChecks className="mr-2 h-4 w-4" />
                  Add Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Team Member
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Add Milestone
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add Integration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Project Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Project Settings
                </DropdownMenuItem>
                {project.status === "active" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Put on Hold
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Project
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Overall Progress</span>
                <span>{project.progress}% complete</span>
              </div>
              <Progress value={project.progress} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex gap-4 items-center">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Due Date</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({project.tasks.length})</TabsTrigger>
          <TabsTrigger value="team">Team ({project.teamMembers.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Project Details and Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
                
                <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">End Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Team Size</div>
                    <div className="text-sm text-muted-foreground">
                      {project.teamMembers.length} members
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Integrations</div>
                  <div className="flex flex-wrap gap-1">
                    {project.integrations.map((integration, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Gauge className="h-24 w-24 text-muted-foreground" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xl font-bold ${
                        (project.healthScore || 0) > 75 ? "text-green-600 dark:text-green-400" :
                        (project.healthScore || 0) > 50 ? "text-yellow-600 dark:text-yellow-400" :
                        "text-red-600 dark:text-red-400"
                      }`}>
                        {project.healthScore || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Overall Health Score
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Time</span>
                      <span className="text-green-600 dark:text-green-400">On Track</span>
                    </div>
                    <Progress value={85} className="text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Scope</span>
                      <span className="text-green-600 dark:text-green-400">On Track</span>
                    </div>
                    <Progress value={90} className="text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Quality</span>
                      <span className="text-yellow-600 dark:text-yellow-400">Needs Attention</span>
                    </div>
                    <Progress value={70} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Milestones and Tasks Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {milestone.description}
                        </div>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            {milestone.completedDate && ` • Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${getMilestoneStatusBadgeColor(milestone.status)} border-none mt-1`}>
                        {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {project.tasks.filter(task => task.status === "completed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {project.tasks.filter(task => task.status !== "completed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {project.tasks.filter(task => task.priority === "high" && task.status !== "completed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      High Priority
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {project.tasks.filter(task => task.status === "blocked").length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Blocked
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Recent Tasks</div>
                  <div className="space-y-2">
                    {project.tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <div className="text-sm font-medium">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {task.assignee || 'Unassigned'} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getTaskStatusBadgeColor(task.status)} border-none`}>
                          {formatStatus(task.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setTaskDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Tasks</CardTitle>
                <CardDescription>
                  All tasks for this project
                </CardDescription>
              </div>
              <Button onClick={() => setTaskDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks.length === 0 ? (
                  <div className="text-center py-10">
                    <ListChecks className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No tasks yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => setTaskDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Create First Task
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assignee</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Due Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Priority</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.tasks.map((task) => (
                            <tr key={task.id} className="border-t hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="text-sm font-medium">{task.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                              </td>
                              <td className="py-3 px-4">
                                {task.assignee ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
                                      <AvatarFallback>{task.assignee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{task.assignee}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Unassigned</span>
                                )}
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                {task.dueDate ? (
                                  <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">No due date</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className={`${getTaskStatusBadgeColor(task.status)} border-none`}>
                                      {formatStatus(task.status)}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "todo")}>
                                      To Do
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "in_progress")}>
                                      In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "review")}>
                                      Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "completed")}>
                                      Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "blocked")}>
                                      Blocked
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                <Badge variant="outline" className={`${getPriorityBadgeColor(task.priority)} border-none`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit2 className="mr-2 h-4 w-4" />
                                      Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      Add Comment
                                    </DropdownMenuItem>
                                    {task.status === "completed" ? (
                                      <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "todo")}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Mark as Incomplete
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleChangeTaskStatus(task.id, "completed")}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Complete
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>
                  Team members assigned to this project
                </CardDescription>
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No team members assigned yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => setInviteDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite First Team Member
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.teamMembers.map((member) => (
                      <div key={member.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {member.department}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span>Hours allocated</span>
                            <span className="font-medium">{member.hoursAllocated}h</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button variant="ghost" size="sm" className="text-xs">
                              View Tasks
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Activity</CardTitle>
                <CardDescription>
                  Recent activity and updates
                </CardDescription>
              </div>
              <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.recentActivity.length === 0 ? (
                  <div className="text-center py-10">
                    <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {project.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex">
                        <div className="mr-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={activity.userAvatar} alt={activity.user} />
                            <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{activity.user}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getActivityIcon(activity.type)}
                            <span>
                              {activity.type === "comment" ? "Commented" :
                               activity.type === "status_change" ? "Changed Status" :
                               activity.type === "task_added" ? "Added Task" :
                               activity.type === "task_completed" ? "Completed Task" :
                               activity.type === "milestone_reached" ? "Reached Milestone" :
                               activity.type === "team_member_added" ? "Added Team Member" : "Updated"}
                            </span>
                          </div>
                          
                          <div className={`text-sm mt-1 ${activity.type === "comment" ? "bg-muted p-3 rounded-md" : ""}`}>
                            {activity.content}
                          </div>
                          
                          {activity.taskId && activity.taskTitle && (
                            <div className="text-xs mt-1">
                              <Button variant="link" className="h-auto p-0">
                                View task: {activity.taskTitle}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for this project
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title*</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description*</Label>
              <Textarea
                id="task-description"
                placeholder="Enter task description"
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <select
                  id="task-assignee"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {project.teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority*</Label>
                <select
                  id="task-priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite Team Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to this project
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member-email">Email*</Label>
              <Input
                id="member-email"
                type="email"
                placeholder="team@example.com"
                value={newTeamMember.email}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role*</Label>
              <Input
                id="member-role"
                placeholder="Enter role (e.g. Developer, Designer)"
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddTeamMember}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectDetail