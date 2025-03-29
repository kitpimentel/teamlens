import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Checkbox,
} from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  Calendar, 
  ArrowUpCircle, 
  CircleEllipsis, 
  CheckSquare, 
  Square, 
  Pencil,
  ListFilter, 
  SlidersHorizontal, 
  User,
  X,
  CalendarClock,
  Link2,
  MessageSquare,
  ClipboardList,
} from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for Task Type
 */
interface Task {
  id: string
  title: string
  description: string
  status: "backlog" | "todo" | "in_progress" | "review" | "done" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  assigneeId?: string
  assigneeName?: string
  assigneeAvatar?: string
  projectId: string
  projectName: string
  dueDate?: string
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
  completedAt?: string
  completedBy?: string
  tags: string[]
  relatedTasks?: string[]
  comments?: {
    id: string
    content: string
    author: string
    authorAvatar?: string
    timestamp: string
  }[]
  attachments?: number
  blocked?: boolean
  blockedReason?: string
  estimatedHours?: number
  loggedHours?: number
  reminderSet?: boolean
}

/**
 * Interface for Project Type
 */
interface Project {
  id: string
  name: string
  color: string
  status: "active" | "completed" | "on_hold"
}

/**
 * Interface for Team Member Type
 */
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  department: string
}

/**
 * Task Management component
 * Allows organization admins to create, assign, and track tasks across all projects
 */
const TaskManagement = () => {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState<string>("kanban")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterProject, setFilterProject] = useState<string | null>(null)
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState<boolean>(false)
  const [taskDetailsDialogOpen, setTaskDetailsDialogOpen] = useState<boolean>(false)
  
  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    projectId: "",
    assigneeId: "",
    dueDate: "",
    tags: [] as string[],
    estimatedHours: ""
  })
  
  // New comment for an existing task
  const [newComment, setNewComment] = useState("")

  // Mock projects data
  const projects: Project[] = [
    { id: "proj-1", name: "Team Lens Dashboard", color: "bg-blue-500", status: "active" },
    { id: "proj-2", name: "E-commerce Mobile App", color: "bg-green-500", status: "active" },
    { id: "proj-3", name: "Marketing Website Redesign", color: "bg-yellow-500", status: "active" },
    { id: "proj-4", name: "API Integration", color: "bg-purple-500", status: "active" },
    { id: "proj-5", name: "CRM Implementation", color: "bg-red-500", status: "on_hold" }
  ]

  // Mock team members data
  const teamMembers: TeamMember[] = [
    {
      id: "tm-1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "Lead Developer",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      department: "Development"
    },
    {
      id: "tm-2",
      name: "Jason Patel",
      email: "jason.patel@example.com",
      role: "UX Designer",
      avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      department: "Design"
    },
    {
      id: "tm-3",
      name: "Michelle Wang",
      email: "michelle.wang@example.com",
      role: "Project Manager",
      avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
      department: "Management"
    },
    {
      id: "tm-4",
      name: "David Kim",
      email: "david.kim@example.com",
      role: "QA Engineer",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff",
      department: "Quality Assurance"
    },
    {
      id: "tm-5",
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      role: "Frontend Developer",
      avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      department: "Development"
    }
  ]

  // Mock task data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Design responsive dashboard layout",
      description: "Create a fully responsive dashboard layout with sidebar navigation, header, and main content area",
      status: "done",
      priority: "high",
      assigneeId: "tm-2",
      assigneeName: "Jason Patel",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-02-15",
      createdAt: "2025-01-20T10:00:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-02-10T10:00:00Z",
      updatedBy: "Jason Patel",
      completedAt: "2025-02-10T10:00:00Z",
      completedBy: "Jason Patel",
      tags: ["design", "ui", "frontend"],
      comments: [
        {
          id: "comment-1",
          content: "I've started working on the wireframes, will share first draft tomorrow.",
          author: "Jason Patel",
          authorAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
          timestamp: "2025-01-22T14:30:00Z"
        },
        {
          id: "comment-2",
          content: "Wireframes look good! Let's move forward with the implementation.",
          author: "Michelle Wang",
          authorAvatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
          timestamp: "2025-01-25T11:15:00Z"
        }
      ],
      attachments: 2,
      estimatedHours: 16,
      loggedHours: 15
    },
    {
      id: "task-2",
      title: "Implement authentication flow",
      description: "Create login, signup, forgot password, and user profile pages with JWT auth",
      status: "done",
      priority: "high",
      assigneeId: "tm-1",
      assigneeName: "Sarah Chen",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-02-28",
      createdAt: "2025-01-25T09:30:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-02-22T14:30:00Z",
      updatedBy: "Sarah Chen",
      completedAt: "2025-02-22T14:30:00Z",
      completedBy: "Sarah Chen",
      tags: ["backend", "auth", "security"],
      estimatedHours: 24,
      loggedHours: 20
    },
    {
      id: "task-3",
      title: "Develop dashboard widgets",
      description: "Create reusable dashboard widgets for project status, team activity, and task overview",
      status: "in_progress",
      priority: "medium",
      assigneeId: "tm-5",
      assigneeName: "Emily Johnson",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-03-31",
      createdAt: "2025-02-10T11:45:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-03-15T09:20:00Z",
      updatedBy: "Emily Johnson",
      tags: ["frontend", "components", "charts"],
      estimatedHours: 40,
      loggedHours: 25
    },
    {
      id: "task-4",
      title: "Integrate with JIRA API",
      description: "Connect to JIRA API to fetch projects, tasks, and synchronize updates",
      status: "in_progress",
      priority: "high",
      assigneeId: "tm-1",
      assigneeName: "Sarah Chen",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-04-05",
      createdAt: "2025-02-15T14:20:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-03-10T11:30:00Z",
      updatedBy: "Sarah Chen",
      tags: ["backend", "integration", "api"],
      comments: [
        {
          id: "comment-3",
          content: "I've set up the initial connection to the JIRA API, now working on mapping the data structures.",
          author: "Sarah Chen",
          authorAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
          timestamp: "2025-03-10T11:30:00Z"
        }
      ],
      attachments: 1,
      estimatedHours: 32,
      loggedHours: 20
    },
    {
      id: "task-5",
      title: "Create data visualization components",
      description: "Develop charts and graphs for analytics dashboard using appropriate visualization library",
      status: "todo",
      priority: "medium",
      assigneeId: "tm-5",
      assigneeName: "Emily Johnson",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-04-10",
      createdAt: "2025-02-20T09:15:00Z",
      createdBy: "Michelle Wang",
      tags: ["frontend", "charts", "analytics"],
      estimatedHours: 24
    },
    {
      id: "task-6",
      title: "Design onboarding user flow",
      description: "Create an onboarding experience for new users to guide them through the platform",
      status: "review",
      priority: "low",
      assigneeId: "tm-2",
      assigneeName: "Jason Patel",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-04-01",
      createdAt: "2025-03-01T10:30:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-03-25T14:15:00Z",
      updatedBy: "Jason Patel",
      tags: ["design", "ux", "onboarding"],
      estimatedHours: 16,
      loggedHours: 18
    },
    {
      id: "task-7",
      title: "Fix cross-browser compatibility issues",
      description: "Ensure the application works correctly in all modern browsers (Chrome, Firefox, Safari, Edge)",
      status: "backlog",
      priority: "high",
      assigneeId: "tm-5",
      assigneeName: "Emily Johnson",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      dueDate: "2025-03-25",
      createdAt: "2025-03-10T11:00:00Z",
      createdBy: "Michelle Wang",
      tags: ["frontend", "bug", "compatibility"],
      blocked: true,
      blockedReason: "Waiting for design updates for Safari-specific layout issues",
      estimatedHours: 8
    },
    {
      id: "task-8",
      title: "Implement product listing page",
      description: "Create the main product listing page with filters, sorting, and pagination",
      status: "in_progress",
      priority: "high",
      assigneeId: "tm-5",
      assigneeName: "Emily Johnson",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      dueDate: "2025-04-15",
      createdAt: "2025-03-05T09:30:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-03-20T14:45:00Z",
      updatedBy: "Emily Johnson",
      tags: ["frontend", "mobile", "ui"],
      estimatedHours: 24,
      loggedHours: 18
    },
    {
      id: "task-9",
      title: "Implement shopping cart functionality",
      description: "Create shopping cart with add/remove items, quantity adjustment, and price calculation",
      status: "todo",
      priority: "high",
      assigneeId: "tm-1",
      assigneeName: "Sarah Chen",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      dueDate: "2025-04-25",
      createdAt: "2025-03-15T10:15:00Z",
      createdBy: "Michelle Wang",
      tags: ["frontend", "backend", "mobile"],
      estimatedHours: 32
    },
    {
      id: "task-10",
      title: "Redesign homepage hero section",
      description: "Update the homepage hero section with new design, messaging, and call-to-action",
      status: "done",
      priority: "medium",
      assigneeId: "tm-2",
      assigneeName: "Jason Patel",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      projectId: "proj-3",
      projectName: "Marketing Website Redesign",
      dueDate: "2025-03-20",
      createdAt: "2025-03-01T09:00:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-03-18T16:30:00Z",
      updatedBy: "Jason Patel",
      completedAt: "2025-03-18T16:30:00Z",
      completedBy: "Jason Patel",
      tags: ["design", "ui", "frontend"],
      estimatedHours: 16,
      loggedHours: 14
    },
    {
      id: "task-11",
      title: "Implement payment gateway integration",
      description: "Connect to Stripe API for payment processing and handle webhooks",
      status: "review",
      priority: "urgent",
      assigneeId: "tm-1",
      assigneeName: "Sarah Chen",
      assigneeAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      dueDate: "2025-04-10",
      createdAt: "2025-03-10T14:00:00Z",
      createdBy: "Michelle Wang",
      updatedAt: "2025-03-30T11:20:00Z",
      updatedBy: "Sarah Chen",
      tags: ["backend", "payments", "security"],
      comments: [
        {
          id: "comment-4",
          content: "I've finished implementing the Stripe integration. Please review the PR and test the payment flow.",
          author: "Sarah Chen",
          authorAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
          timestamp: "2025-03-30T11:20:00Z"
        }
      ],
      estimatedHours: 24,
      loggedHours: 26
    },
    {
      id: "task-12",
      title: "Optimize database queries for better performance",
      description: "Review and optimize database queries to improve application response time",
      status: "backlog",
      priority: "medium",
      projectId: "proj-5",
      projectName: "CRM Implementation",
      createdAt: "2025-03-25T09:45:00Z",
      createdBy: "Michelle Wang",
      tags: ["backend", "database", "performance"],
      estimatedHours: 16
    }
  ])

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)))

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by project
    const matchesProject = filterProject === null || task.projectId === filterProject
    
    // Filter by assignee
    const matchesAssignee = filterAssignee === null || task.assigneeId === filterAssignee
    
    // Filter by status
    const matchesStatus = filterStatus === null || task.status === filterStatus
    
    // Filter by priority
    const matchesPriority = filterPriority === null || task.priority === filterPriority
    
    // Filter by tag
    const matchesTag = filterTag === null || task.tags.includes(filterTag)
    
    return matchesSearch && matchesProject && matchesAssignee && matchesStatus && matchesPriority && matchesTag
  })

  // Get active task details if one is selected
  const activeTask = activeTaskId ? tasks.find(task => task.id === activeTaskId) : null

  // Group tasks by status for Kanban view
  const tasksByStatus = {
    backlog: filteredTasks.filter(task => task.status === "backlog"),
    todo: filteredTasks.filter(task => task.status === "todo"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    review: filteredTasks.filter(task => task.status === "review"),
    done: filteredTasks.filter(task => task.status === "done"),
    cancelled: filteredTasks.filter(task => task.status === "cancelled")
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "done").length,
    inProgress: tasks.filter(task => task.status === "in_progress").length,
    review: tasks.filter(task => task.status === "review").length,
    todo: tasks.filter(task => task.status === "todo").length,
    backlog: tasks.filter(task => task.status === "backlog").length,
    overdue: tasks.filter(task => {
      if (!task.dueDate || task.status === "done" || task.status === "cancelled") return false
      return new Date(task.dueDate) < new Date()
    }).length,
    blocked: tasks.filter(task => task.blocked).length
  }

  /**
   * Handle creating a new task
   */
  const handleCreateTask = () => {
    // Validate form
    if (!newTask.title || !newTask.projectId || !newTask.status) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Find project
    const project = projects.find(p => p.id === newTask.projectId)
    if (!project) {
      toast.error("Selected project not found")
      return
    }
    
    // Find assignee if assigned
    const assignee = newTask.assigneeId ? teamMembers.find(m => m.id === newTask.assigneeId) : undefined
    
    // Create new task
    const createdTask: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as "backlog" | "todo" | "in_progress" | "review" | "done" | "cancelled",
      priority: newTask.priority as "low" | "medium" | "high" | "urgent",
      assigneeId: assignee?.id,
      assigneeName: assignee?.name,
      assigneeAvatar: assignee?.avatar,
      projectId: project.id,
      projectName: project.name,
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "System",
      tags: newTask.tags,
      estimatedHours: newTask.estimatedHours ? parseInt(newTask.estimatedHours) : undefined
    }
    
    // Add task to list
    setTasks([createdTask, ...tasks])
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      projectId: "",
      assigneeId: "",
      dueDate: "",
      tags: [],
      estimatedHours: ""
    })
    
    // Close dialog
    setCreateTaskDialogOpen(false)
    
    toast.success("Task created successfully")
  }

  /**
   * Handle changing a task's status
   */
  const handleChangeTaskStatus = (taskId: string, newStatus: "backlog" | "todo" | "in_progress" | "review" | "done" | "cancelled") => {
    // Find task
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return
    
    const task = tasks[taskIndex]
    
    // Create updated task
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || "System"
    }
    
    // Add completed info if status is done
    if (newStatus === "done" && task.status !== "done") {
      updatedTask.completedAt = new Date().toISOString()
      updatedTask.completedBy = user?.name || "System"
    } else if (newStatus !== "done" && task.status === "done") {
      // Remove completed info if status is changed from done
      delete updatedTask.completedAt
      delete updatedTask.completedBy
    }
    
    // Update tasks
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = updatedTask
    setTasks(updatedTasks)
    
    toast.success(`Task status updated to ${formatStatus(newStatus)}`)
  }

  /**
   * Handle adding a comment to a task
   */
  const handleAddComment = () => {
    if (!activeTask || !newComment.trim()) return
    
    // Create comment
    const comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: user?.name || "System",
      authorAvatar: user?.avatar,
      timestamp: new Date().toISOString()
    }
    
    // Add comment to task
    const updatedTasks = tasks.map(task => {
      if (task.id === activeTask.id) {
        return {
          ...task,
          comments: [...(task.comments || []), comment],
          updatedAt: new Date().toISOString(),
          updatedBy: user?.name || "System"
        }
      }
      return task
    })
    
    setTasks(updatedTasks)
    setNewComment("")
    
    toast.success("Comment added")
  }

  /**
   * Handle assigning a task to a team member
   */
  const handleAssignTask = (taskId: string, assigneeId: string) => {
    // Find task
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return
    
    // Find assignee
    const assignee = teamMembers.find(m => m.id === assigneeId)
    if (!assignee) return
    
    // Update task
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || "System"
    }
    
    setTasks(updatedTasks)
    
    toast.success(`Task assigned to ${assignee.name}`)
  }

  /**
   * Handle updating task priority
   */
  const handleUpdatePriority = (taskId: string, priority: "low" | "medium" | "high" | "urgent") => {
    // Find task
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return
    
    // Update task
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      priority,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || "System"
    }
    
    setTasks(updatedTasks)
    
    toast.success(`Task priority updated to ${priority}`)
  }

  /**
   * Format status for display
   */
  const formatStatus = (status: string): string => {
    switch (status) {
      case "backlog": return "Backlog"
      case "todo": return "To Do"
      case "in_progress": return "In Progress"
      case "review": return "Review"
      case "done": return "Done"
      case "cancelled": return "Cancelled"
      default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  /**
   * Get status icon
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "backlog":
        return <CircleEllipsis className="h-4 w-4" />
      case "todo":
        return <Square className="h-4 w-4" />
      case "in_progress":
        return <ArrowUpCircle className="h-4 w-4" />
      case "review":
        return <Clock className="h-4 w-4" />
      case "done":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      default:
        return null
    }
  }

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "text-gray-500"
      case "todo":
        return "text-blue-500"
      case "in_progress":
        return "text-yellow-500"
      case "review":
        return "text-purple-500"
      case "done":
        return "text-green-500"
      case "cancelled":
        return "text-red-500"
      default:
        return ""
    }
  }

  /**
   * Get status background color for kanban column
   */
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-50 dark:bg-gray-800/50"
      case "todo":
        return "bg-blue-50 dark:bg-blue-950/30"
      case "in_progress":
        return "bg-yellow-50 dark:bg-yellow-950/30"
      case "review":
        return "bg-purple-50 dark:bg-purple-950/30"
      case "done":
        return "bg-green-50 dark:bg-green-950/30"
      case "cancelled":
        return "bg-red-50 dark:bg-red-950/30"
      default:
        return "bg-gray-50 dark:bg-gray-800/50"
    }
  }

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-blue-500 bg-blue-50 dark:bg-blue-950/30"
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
      case "high":
        return "text-orange-500 bg-orange-50 dark:bg-orange-950/30"
      case "urgent":
        return "text-red-500 bg-red-50 dark:bg-red-950/30"
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-800/50"
    }
  }

  /**
   * Get priority badge
   */
  const getPriorityBadge = (priority: string) => {
    return (
      <Badge variant="outline" className={`${getPriorityColor(priority)} border-none`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  /**
   * Get project color dot
   */
  const getProjectDot = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return null
    return <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
  }

  /**
   * Render task card for kanban view
   */
  const renderTaskCard = (task: Task) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" && task.status !== "cancelled"
    
    return (
      <div 
        key={task.id}
        className="bg-card rounded-md border shadow-sm p-3 cursor-pointer hover:border-primary/50 transition-colors mb-3"
        onClick={() => {
          setActiveTaskId(task.id)
          setTaskDetailsDialogOpen(true)
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {getProjectDot(task.projectId)}
            <span className="text-xs text-muted-foreground">{task.projectName}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                setActiveTaskId(task.id)
                setTaskDetailsDialogOpen(true)
              }}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem 
                disabled={task.status === "backlog"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "backlog")
                }}
              >
                Move to Backlog
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "todo"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "todo")
                }}
              >
                Move to To Do
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "in_progress"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "in_progress")
                }}
              >
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "review"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "review")
                }}
              >
                Move to Review
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "done"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "done")
                }}
              >
                Mark as Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="font-medium mb-2">{task.title}</h3>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              {getPriorityBadge(task.priority)}
            </div>
            
            {task.blocked && (
              <Badge variant="outline" className="bg-red-50 text-red-500 dark:bg-red-950/30 border-none">
                Blocked
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {task.assigneeId ? (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                  <AvatarFallback>{task.assigneeName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{task.assigneeName}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
            
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className={`h-3 w-3 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`} />
                <span className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
            
            {task.attachments && task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                <span>{task.attachments}</span>
              </div>
            )}
            
            {task.estimatedHours && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{task.estimatedHours}h</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render task row for list view
   */
  const renderTaskRow = (task: Task) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" && task.status !== "cancelled"
    
    return (
      <tr 
        key={task.id} 
        className="border-t hover:bg-muted/50 cursor-pointer"
        onClick={() => {
          setActiveTaskId(task.id)
          setTaskDetailsDialogOpen(true)
        }}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={task.status === "done"} className="pointer-events-none" />
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            {getProjectDot(task.projectId)}
            <span>{task.projectName}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-1">
            <div className={`${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
            </div>
            <span>{formatStatus(task.status)}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          {getPriorityBadge(task.priority)}
        </td>
        <td className="py-3 px-4">
          {task.assigneeId ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                <AvatarFallback>{task.assigneeName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>{task.assigneeName}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          )}
        </td>
        <td className="py-3 px-4">
          {task.dueDate ? (
            <div className={`${isOverdue ? "text-red-500 font-medium" : ""}`}>
              {formatDate(task.dueDate)}
            </div>
          ) : (
            <span className="text-muted-foreground">No date</span>
          )}
        </td>
        <td className="py-3 px-4 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                setActiveTaskId(task.id)
                setTaskDetailsDialogOpen(true)
              }}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem 
                disabled={task.status === "todo"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "todo")
                }}
              >
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "in_progress"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "in_progress")
                }}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "review"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "review")
                }}
              >
                Review
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "done"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "done")
                }}
              >
                Done
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={task.status === "cancelled"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeTaskStatus(task.id, "cancelled")
                }}
              >
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Create, assign, and track tasks across all projects
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setCreateTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Total Tasks</span>
              <span className="text-2xl font-bold">{taskStats.total}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Completed</span>
              <span className="text-2xl font-bold text-green-500">{taskStats.completed}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">In Progress</span>
              <span className="text-2xl font-bold text-yellow-500">{taskStats.inProgress}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Review</span>
              <span className="text-2xl font-bold text-purple-500">{taskStats.review}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">To Do</span>
              <span className="text-2xl font-bold text-blue-500">{taskStats.todo}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Backlog</span>
              <span className="text-2xl font-bold text-gray-500">{taskStats.backlog}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Overdue</span>
              <span className="text-2xl font-bold text-red-500">{taskStats.overdue}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Blocked</span>
              <span className="text-2xl font-bold text-red-500">{taskStats.blocked}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filterProject || ""} onValueChange={(value) => setFilterProject(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                      <span>{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterAssignee || ""} onValueChange={(value) => setFilterAssignee(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Assignees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <Label className="text-xs">Status</Label>
                  <Select 
                    value={filterStatus || ""} 
                    onValueChange={(value) => setFilterStatus(value || null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs">Priority</Label>
                  <Select 
                    value={filterPriority || ""} 
                    onValueChange={(value) => setFilterPriority(value || null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs">Tag</Label>
                  <Select 
                    value={filterTag || ""} 
                    onValueChange={(value) => setFilterTag(value || null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tags</SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setFilterStatus(null)
                      setFilterPriority(null)
                      setFilterTag(null)
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* View Selector */}
        <div className="flex justify-between items-center">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm">
            <ListFilter className="mr-2 h-4 w-4" />
            Save View
          </Button>
        </div>
      </div>

      {/* Kanban View */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 overflow-x-auto">
          <div className="flex min-w-[1000px] gap-4">
            {/* Backlog Column */}
            <div className="w-[250px] flex-shrink-0">
              <div className={`rounded-t-md ${getStatusBgColor("backlog")} p-3 border-x border-t`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleEllipsis className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium">Backlog</h3>
                  </div>
                  <Badge variant="outline">{tasksByStatus.backlog.length}</Badge>
                </div>
              </div>
              <div className="p-3 rounded-b-md border bg-card h-[calc(100vh-350px)] overflow-y-auto">
                {tasksByStatus.backlog.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground p-4">
                    No tasks in backlog
                  </div>
                ) : (
                  tasksByStatus.backlog.map(task => renderTaskCard(task))
                )}
              </div>
            </div>
            
            {/* Todo Column */}
            <div className="w-[250px] flex-shrink-0">
              <div className={`rounded-t-md ${getStatusBgColor("todo")} p-3 border-x border-t`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">To Do</h3>
                  </div>
                  <Badge variant="outline">{tasksByStatus.todo.length}</Badge>
                </div>
              </div>
              <div className="p-3 rounded-b-md border bg-card h-[calc(100vh-350px)] overflow-y-auto">
                {tasksByStatus.todo.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground p-4">
                    No tasks to do
                  </div>
                ) : (
                  tasksByStatus.todo.map(task => renderTaskCard(task))
                )}
              </div>
            </div>
            
            {/* In Progress Column */}
            <div className="w-[250px] flex-shrink-0">
              <div className={`rounded-t-md ${getStatusBgColor("in_progress")} p-3 border-x border-t`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-yellow-500" />
                    <h3 className="font-medium">In Progress</h3>
                  </div>
                  <Badge variant="outline">{tasksByStatus.in_progress.length}</Badge>
                </div>
              </div>
              <div className="p-3 rounded-b-md border bg-card h-[calc(100vh-350px)] overflow-y-auto">
                {tasksByStatus.in_progress.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground p-4">
                    No tasks in progress
                  </div>
                ) : (
                  tasksByStatus.in_progress.map(task => renderTaskCard(task))
                )}
              </div>
            </div>
            
            {/* Review Column */}
            <div className="w-[250px] flex-shrink-0">
              <div className={`rounded-t-md ${getStatusBgColor("review")} p-3 border-x border-t`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Review</h3>
                  </div>
                  <Badge variant="outline">{tasksByStatus.review.length}</Badge>
                </div>
              </div>
              <div className="p-3 rounded-b-md border bg-card h-[calc(100vh-350px)] overflow-y-auto">
                {tasksByStatus.review.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground p-4">
                    No tasks in review
                  </div>
                ) : (
                  tasksByStatus.review.map(task => renderTaskCard(task))
                )}
              </div>
            </div>
            
            {/* Done Column */}
            <div className="w-[250px] flex-shrink-0">
              <div className={`rounded-t-md ${getStatusBgColor("done")} p-3 border-x border-t`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Done</h3>
                  </div>
                  <Badge variant="outline">{tasksByStatus.done.length}</Badge>
                </div>
              </div>
              <div className="p-3 rounded-b-md border bg-card h-[calc(100vh-350px)] overflow-y-auto">
                {tasksByStatus.done.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground p-4">
                    No completed tasks
                  </div>
                ) : (
                  tasksByStatus.done.map(task => renderTaskCard(task))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {activeView === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Project</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assignee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-muted-foreground">
                          No tasks found
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map(task => renderTaskRow(task))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Task Dialog */}
      <Dialog open={createTaskDialogOpen} onOpenChange={setCreateTaskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your project
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
              <Label htmlFor="task-description">Description</Label>
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
                <Label htmlFor="task-project">Project*</Label>
                <Select 
                  value={newTask.projectId} 
                  onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}
                >
                  <SelectTrigger id="task-project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status*</Label>
                <Select 
                  value={newTask.status} 
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger id="task-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select 
                  value={newTask.assigneeId} 
                  onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}
                >
                  <SelectTrigger id="task-assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-estimated-hours">Estimated Hours</Label>
                <Input
                  id="task-estimated-hours"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[80px]">
                {newTask.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => setNewTask({
                        ...newTask,
                        tags: newTask.tags.filter((_, i) => i !== index)
                      })}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
                
                <Input
                  placeholder="Add tag and press Enter"
                  className="w-[150px] h-7"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      e.preventDefault()
                      const newTag = e.currentTarget.value.trim()
                      if (!newTask.tags.includes(newTag)) {
                        setNewTask({
                          ...newTask,
                          tags: [...newTask.tags, newTag]
                        })
                      }
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={taskDetailsDialogOpen} onOpenChange={setTaskDetailsDialogOpen}>
        {activeTask && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className={getStatusColor(activeTask.status)}>
                  {getStatusIcon(activeTask.status)}
                </div>
                <span className="text-sm">{formatStatus(activeTask.status)}</span>
                {getPriorityBadge(activeTask.priority)}
                {activeTask.blocked && (
                  <Badge variant="outline" className="bg-red-50 text-red-500 dark:bg-red-950/30 border-none">
                    Blocked
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{activeTask.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {getProjectDot(activeTask.projectId)}
                  <span className="text-sm">{activeTask.projectName}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Created {formatDate(activeTask.createdAt)}</span>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <div className="text-sm">
                    {activeTask.description || <span className="text-muted-foreground">No description provided</span>}
                  </div>
                </div>
                
                {activeTask.blocked && activeTask.blockedReason && (
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-3">
                    <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Blocked</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">{activeTask.blockedReason}</p>
                  </div>
                )}
                
                {activeTask.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {activeTask.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Comments</h3>
                  {activeTask.comments && activeTask.comments.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {activeTask.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                            <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No comments yet</div>
                  )}
                  
                  <div className="mt-4">
                    <Textarea
                      placeholder="Add a comment..."
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" disabled={!newComment.trim()} onClick={handleAddComment}>
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <Select 
                    value={activeTask.status} 
                    onValueChange={(value) => handleChangeTaskStatus(
                      activeTask.id, 
                      value as "backlog" | "todo" | "in_progress" | "review" | "done" | "cancelled"
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Assignee</h3>
                  <Select 
                    value={activeTask.assigneeId || ""} 
                    onValueChange={(value) => handleAssignTask(activeTask.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Priority</h3>
                  <Select 
                    value={activeTask.priority} 
                    onValueChange={(value) => handleUpdatePriority(
                      activeTask.id, 
                      value as "low" | "medium" | "high" | "urgent"
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Due Date</h3>
                  {activeTask.dueDate ? (
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(activeTask.dueDate)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No due date set</span>
                  )}
                </div>
                
                {(activeTask.estimatedHours || activeTask.loggedHours) && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Time Tracking</h3>
                    <div className="space-y-2">
                      {activeTask.estimatedHours && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Estimated:</span>
                          <span>{activeTask.estimatedHours}h</span>
                        </div>
                      )}
                      {activeTask.loggedHours && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Logged:</span>
                          <span>{activeTask.loggedHours}h</span>
                        </div>
                      )}
                      {activeTask.estimatedHours && activeTask.loggedHours && (
                        <>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                              <div
                                style={{ width: `${Math.min((activeTask.loggedHours / activeTask.estimatedHours) * 100, 100)}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                  activeTask.loggedHours > activeTask.estimatedHours ? "bg-red-500" : "bg-primary"
                                }`}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>0h</span>
                            <span>{activeTask.estimatedHours}h</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Activity</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>Created by {activeTask.createdBy} on {formatDate(activeTask.createdAt)}</span>
                    </div>
                    {activeTask.updatedAt && activeTask.updatedBy && (
                      <div className="flex items-center gap-2">
                        <Pencil className="h-3 w-3" />
                        <span>Updated by {activeTask.updatedBy} on {formatDate(activeTask.updatedAt)}</span>
                      </div>
                    )}
                    {activeTask.completedAt && activeTask.completedBy && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed by {activeTask.completedBy} on {formatDate(activeTask.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Edit Task
                </Button>
                
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  
                  {activeTask.status !== "done" && (
                    <Button onClick={() => handleChangeTaskStatus(activeTask.id, "done")}>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Mark as Done
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

export default TaskManagement