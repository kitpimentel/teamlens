import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PencilLine,
  GitBranch,
  MoreHorizontal,
  Plus,
} from "lucide-react"

/**
 * Task status type definition
 */
type TaskStatus = "To Do" | "In Progress" | "In Review" | "Done"

/**
 * Task priority type definition
 */
type TaskPriority = "Low" | "Medium" | "High" | "Critical"

/**
 * Comment interface for task comments
 */
interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  text: string
  timestamp: string
}

/**
 * ActivityLog interface for task activities
 */
interface ActivityLog {
  id: string
  userId: string
  userName: string
  userAvatar: string
  action: string
  details?: string
  timestamp: string
}

/**
 * SubTask interface for subtasks
 */
interface SubTask {
  id: string
  title: string
  completed: boolean
}

/**
 * Task interface with detailed properties
 */
interface DetailedTask {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project: string
  projectId: string
  dueDate: string
  assignedBy: string
  assignedById: string
  assignedByAvatar: string
  assignedDate: string
  tags: string[]
  completedPercent: number
  comments: Comment[]
  activities: ActivityLog[]
  attachments: { id: string; name: string; size: number; type: string; uploadDate: string }[]
  subtasks: SubTask[]
  estimatedHours: number
  actualHours: number
  relatedTasks: string[]
}

/**
 * Get the mock task details based on ID
 * In a real app, this would be an API call
 */
const getMockTaskDetails = (id: string): DetailedTask => {
  // Define a consistent avatar for users
  const userAvatars = {
    john: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
    sarah: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
    mike: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
  }

  // Base task details from our mock task list
  const baseTasks = [
    {
      id: "task-1",
      title: "Implement user authentication flow",
      description: "Create login, signup, and password reset screens according to design specs. The implementation should follow our security guidelines and use JWT for authentication.",
      status: "In Progress" as TaskStatus,
      priority: "High" as TaskPriority,
      project: "E-commerce App",
      projectId: "proj-1",
      dueDate: "2025-04-10",
      assignedBy: "John Smith",
      assignedById: "user-123",
      assignedDate: "2025-03-20",
      tags: ["frontend", "authentication", "security"],
      completedPercent: 60,
    },
    {
      id: "task-2",
      title: "Design database schema",
      description: "Create entity relationship diagrams and define table structures for the entire application. Consider performance optimizations and security aspects.",
      status: "Done" as TaskStatus,
      priority: "High" as TaskPriority,
      project: "E-commerce App",
      projectId: "proj-1",
      dueDate: "2025-03-28",
      assignedBy: "John Smith",
      assignedById: "user-123",
      assignedDate: "2025-03-15",
      tags: ["database", "architecture"],
      completedPercent: 100,
    },
    {
      id: "task-3",
      title: "Set up CI/CD pipeline",
      description: "Configure automated testing and deployment workflows using GitHub Actions. Implement staging and production environments with proper testing procedures.",
      status: "To Do" as TaskStatus,
      priority: "Medium" as TaskPriority,
      project: "CRM System",
      projectId: "proj-2",
      dueDate: "2025-04-15",
      assignedBy: "Sarah Johnson",
      assignedById: "user-456",
      assignedDate: "2025-03-25",
      tags: ["devops", "automation"],
      completedPercent: 0,
    },
    {
      id: "task-4",
      title: "Create product listing page",
      description: "Implement responsive grid layout with filters and sorting options according to the design. Include pagination and lazy loading for performance.",
      status: "In Review" as TaskStatus,
      priority: "Medium" as TaskPriority,
      project: "E-commerce App",
      projectId: "proj-1",
      dueDate: "2025-04-05",
      assignedBy: "John Smith",
      assignedById: "user-123",
      assignedDate: "2025-03-22",
      tags: ["frontend", "ui"],
      completedPercent: 90,
    },
    {
      id: "task-5",
      title: "Optimize API response times",
      description: "Identify and resolve performance bottlenecks in backend services. Implement caching strategies and optimize database queries.",
      status: "To Do" as TaskStatus,
      priority: "Critical" as TaskPriority,
      project: "CRM System",
      projectId: "proj-2",
      dueDate: "2025-04-12",
      assignedBy: "Sarah Johnson",
      assignedById: "user-456",
      assignedDate: "2025-03-26",
      tags: ["backend", "performance"],
      completedPercent: 0,
    },
  ]

  // Find the base task
  const baseTask = baseTasks.find((task) => task.id === id)
  
  if (!baseTask) {
    throw new Error("Task not found")
  }

  // Add additional details to create a detailed task
  return {
    ...baseTask,
    assignedByAvatar: baseTask.assignedBy.includes("John") 
      ? userAvatars.john 
      : userAvatars.sarah,
    comments: [
      {
        id: "comment-1",
        userId: "user-789",
        userName: "Mike Williams",
        userAvatar: userAvatars.mike,
        text: "I've started working on this and have a question about the authentication provider. Should we use the existing one or implement a new one?",
        timestamp: "2025-03-22T14:30:00Z",
      },
      {
        id: "comment-2",
        userId: "user-123",
        userName: "John Smith",
        userAvatar: userAvatars.john,
        text: "Let's use the existing one for now to save time. We can refactor later if needed.",
        timestamp: "2025-03-22T15:45:00Z",
      },
      {
        id: "comment-3",
        userId: "user-789",
        userName: "Mike Williams",
        userAvatar: userAvatars.mike,
        text: "Sounds good. I'll proceed with the implementation using the existing provider.",
        timestamp: "2025-03-22T16:20:00Z",
      },
    ],
    activities: [
      {
        id: "activity-1",
        userId: "user-123",
        userName: "John Smith",
        userAvatar: userAvatars.john,
        action: "created",
        timestamp: baseTask.assignedDate + "T10:00:00Z",
      },
      {
        id: "activity-2",
        userId: "user-789",
        userName: "Mike Williams",
        userAvatar: userAvatars.mike,
        action: "updated",
        details: "Changed status from To Do to In Progress",
        timestamp: "2025-03-21T09:15:00Z",
      },
      {
        id: "activity-3",
        userId: "user-789",
        userName: "Mike Williams",
        userAvatar: userAvatars.mike,
        action: "updated",
        details: "Updated completion percentage to 40%",
        timestamp: "2025-03-23T11:30:00Z",
      },
      {
        id: "activity-4",
        userId: "user-789",
        userName: "Mike Williams",
        userAvatar: userAvatars.mike,
        action: "updated",
        details: "Updated completion percentage to 60%",
        timestamp: "2025-03-25T14:45:00Z",
      },
    ],
    attachments: [
      {
        id: "attachment-1",
        name: "authentication_flow_diagram.pdf",
        size: 1240000,
        type: "application/pdf",
        uploadDate: "2025-03-21T10:30:00Z",
      },
      {
        id: "attachment-2",
        name: "design_specs.fig",
        size: 3500000,
        type: "application/octet-stream",
        uploadDate: "2025-03-20T14:15:00Z",
      },
    ],
    subtasks: [
      {
        id: "subtask-1",
        title: "Design login screen",
        completed: true,
      },
      {
        id: "subtask-2",
        title: "Implement login form validation",
        completed: true,
      },
      {
        id: "subtask-3",
        title: "Integrate with authentication API",
        completed: false,
      },
      {
        id: "subtask-4",
        title: "Create password reset flow",
        completed: false,
      },
      {
        id: "subtask-5",
        title: "Write unit tests",
        completed: false,
      },
    ],
    estimatedHours: 24,
    actualHours: 14,
    relatedTasks: ["task-2"],
  }
}

/**
 * Get CSS class for task priority
 */
const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case "Low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

/**
 * Get CSS class for task status
 */
const getStatusBadgeClass = (status: TaskStatus): string => {
  switch (status) {
    case "To Do":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "In Review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

/**
 * Format file size to human readable format
 */
const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " B"
  } else if (sizeInBytes < 1024 * 1024) {
    return (sizeInBytes / 1024).toFixed(1) + " KB"
  } else {
    return (sizeInBytes / (1024 * 1024)).toFixed(1) + " MB"
  }
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
}

/**
 * TaskDetails component displays detailed information about a specific task
 */
const TaskDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<DetailedTask | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  // Fetch task details on component mount
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true)
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        // In a real app, this would be an API call
        // const response = await fetch(`/api/tasks/${id}`);
        // const data = await response.json();
        
        const mockTask = getMockTaskDetails(id || "")
        setTask(mockTask)
      } catch (error) {
        console.error("Failed to fetch task details:", error)
        toast.error("Failed to load task details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTaskDetails()
    }
  }, [id])

  // Update task status (mock implementation)
  const updateTaskStatus = async (newStatus: TaskStatus) => {
    if (!task) return
    
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // In a real app, this would be an API call
      // await fetch(`/api/tasks/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      setTask({
        ...task,
        status: newStatus,
        activities: [
          {
            id: `activity-${task.activities.length + 1}`,
            userId: "current-user",
            userName: "You",
            userAvatar: "https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff",
            action: "updated",
            details: `Changed status from ${task.status} to ${newStatus}`,
            timestamp: new Date().toISOString(),
          },
          ...task.activities,
        ],
      })
      
      toast.success(`Task status updated to ${newStatus}`)
    } catch (error) {
      console.error("Failed to update task status:", error)
      toast.error("Failed to update task status. Please try again.")
    }
  }

  // Mark subtask as completed or uncompleted (mock implementation)
  const toggleSubtaskCompletion = async (subtaskId: string, completed: boolean) => {
    if (!task) return
    
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Update the subtask completion status
      const updatedSubtasks = task.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      )
      
      // Calculate new completion percentage
      const totalSubtasks = updatedSubtasks.length
      const completedSubtasks = updatedSubtasks.filter((subtask) => subtask.completed).length
      const newCompletedPercent = Math.round((completedSubtasks / totalSubtasks) * 100)
      
      // Update task state
      setTask({
        ...task,
        subtasks: updatedSubtasks,
        completedPercent: newCompletedPercent,
        activities: [
          {
            id: `activity-${task.activities.length + 1}`,
            userId: "current-user",
            userName: "You",
            userAvatar: "https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff",
            action: "updated",
            details: `Marked subtask "${updatedSubtasks.find((st) => st.id === subtaskId)?.title}" as ${completed ? 'completed' : 'incomplete'}`,
            timestamp: new Date().toISOString(),
          },
          ...task.activities,
        ],
      })
      
      toast.success(`Subtask ${completed ? 'completed' : 'marked as incomplete'}`)
    } catch (error) {
      console.error("Failed to update subtask:", error)
      toast.error("Failed to update subtask. Please try again.")
    }
  }

  // Add a new comment (mock implementation)
  const addComment = async () => {
    if (!task || !newComment.trim()) return
    
    try {
      setSubmittingComment(true)
      
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Create a new comment
      const comment: Comment = {
        id: `comment-${task.comments.length + 1}`,
        userId: "current-user",
        userName: "You",
        userAvatar: "https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff",
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      }
      
      // Update task with new comment
      setTask({
        ...task,
        comments: [...task.comments, comment],
        activities: [
          {
            id: `activity-${task.activities.length + 1}`,
            userId: "current-user",
            userName: "You",
            userAvatar: "https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff",
            action: "commented",
            timestamp: new Date().toISOString(),
          },
          ...task.activities,
        ],
      })
      
      // Clear the comment input
      setNewComment("")
      toast.success("Comment added")
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast.error("Failed to add comment. Please try again.")
    } finally {
      setSubmittingComment(false)
    }
  }

  // Handle going back
  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-7xl flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading task details...</p>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-medium mb-2">Task Not Found</h2>
          <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      {/* Back button and task info */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-2" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tasks
        </Button>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={getStatusBadgeClass(task.status)}>
                {task.status}
              </Badge>
              <Badge className={getPriorityBadgeClass(task.priority)}>
                {task.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                <Link to={`/team/projects/${task.projectId}`} className="hover:underline">
                  {task.project}
                </Link>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={task.status} 
              onValueChange={(value) => updateTaskStatus(value as TaskStatus)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <PencilLine className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task details (left column) */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Details tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-4">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{task.completedPercent}% complete</span>
                    <span className="text-sm text-muted-foreground">
                      {task.subtasks.filter((st) => st.completed).length} of {task.subtasks.length} subtasks
                    </span>
                  </div>
                  <Progress value={task.completedPercent} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Estimated Time</h4>
                      <p className="text-lg font-medium">{task.estimatedHours} hours</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Time Spent</h4>
                      <p className="text-lg font-medium">{task.actualHours} hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {task.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {task.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(attachment.size)} • 
                                {new Date(attachment.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {task.relatedTasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {task.relatedTasks.map((relatedTaskId) => (
                        <div key={relatedTaskId} className="p-3 border rounded-md">
                          <Link
                            to={`/team/tasks/${relatedTaskId}`}
                            className="font-medium hover:underline flex items-center"
                          >
                            <GitBranch className="w-4 h-4 mr-2 text-muted-foreground" />
                            Design database schema
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Subtasks tab */}
            <TabsContent value="subtasks">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Subtasks</CardTitle>
                    <CardDescription>
                      Break down and track progress on individual components
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subtask
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task.subtasks.map((subtask) => (
                      <div 
                        key={subtask.id} 
                        className={`flex items-start p-3 border rounded-md ${
                          subtask.completed ? "bg-muted/50" : ""
                        }`}
                      >
                        <div className="flex-grow">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtaskCompletion(subtask.id, !subtask.completed)}
                                className="rounded border-gray-300"
                              />
                            </div>
                            <span className={`font-medium ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                              {subtask.title}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments tab */}
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Discuss this task with your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 overflow-hidden rounded-full bg-primary/10">
                        <img
                          src="https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff"
                          alt="Your avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full p-3 border rounded-md resize-y min-h-20"
                        />
                        <div className="flex justify-end mt-2">
                          <Button 
                            onClick={addComment} 
                            disabled={!newComment.trim() || submittingComment}
                          >
                            {submittingComment && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    {task.comments.length === 0 ? (
                      <div className="text-center py-6">
                        <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <h3 className="text-lg font-medium">No comments yet</h3>
                        <p className="text-muted-foreground mt-1">Be the first to add a comment to this task.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {[...task.comments].reverse().map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
                              <img
                                src={comment.userAvatar}
                                alt={`${comment.userName}'s avatar`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center">
                                <h4 className="font-medium">{comment.userName}</h4>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {formatRelativeTime(comment.timestamp)}
                                </span>
                              </div>
                              <div className="mt-1 text-sm">
                                {comment.text}
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

            {/* Activity tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Track changes and updates to this task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
                          <img
                            src={activity.userAvatar}
                            alt={`${activity.userName}'s avatar`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <h4 className="font-medium">{activity.userName}</h4>
                            <span className="text-sm text-muted-foreground ml-2">
                              {formatRelativeTime(activity.timestamp)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm">
                            <span>
                              {activity.action} this task
                              {activity.details && `: ${activity.details}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Task metadata (right column) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h4>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{new Date(task.dueDate).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned By</h4>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full overflow-hidden mr-2">
                    <img
                      src={task.assignedByAvatar}
                      alt={`${task.assignedBy}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{task.assignedBy}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned Date</h4>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{new Date(task.assignedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {task.status === "Done" ? "Reopen Task" : "Mark as Complete"}
              </Button>
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Reassign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails