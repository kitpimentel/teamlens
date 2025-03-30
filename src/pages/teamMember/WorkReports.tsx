import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import PageHeader from "@/components/common/PageHeader"
import EmptyState from "@/components/common/EmptyState"
import { useAuth } from "@/hooks/useAuth"
import {
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Send,
} from "lucide-react"

/**
 * Type for report status
 */
type ReportStatus = "Draft" | "Submitted" | "Approved" | "Rejected"

/**
 * Type for report frequency
 */
type ReportFrequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Custom"

/**
 * Type for a time entry
 */
interface TimeEntry {
  id: string
  date: string
  project: string
  projectId: string
  task: string
  taskId: string
  hours: number
  description: string
}

/**
 * Type for a work report
 */
interface WorkReport {
  id: string
  title: string
  type: "Time Sheet" | "Progress Report" | "Status Update"
  status: ReportStatus
  frequency: ReportFrequency
  dateRange: {
    from: string
    to: string
  }
  createdAt: string
  submittedAt?: string
  approvedAt?: string
  approvedBy?: {
    id: string
    name: string
    avatar: string
  }
  timeEntries?: TimeEntry[]
  totalHours?: number
  achievements?: string
  challenges?: string
  nextSteps?: string
  notes?: string
  projects?: {
    id: string
    name: string
    hours: number
    percentage: number
  }[]
}

/**
 * Type for a report template
 */
interface ReportTemplate {
  id: string
  name: string
  type: "Time Sheet" | "Progress Report" | "Status Update"
  frequency: ReportFrequency
  description: string
}

/**
 * Mock time entries data
 */
const mockTimeEntries: TimeEntry[] = [
  {
    id: "entry-1",
    date: "2025-03-25",
    project: "E-commerce App",
    projectId: "proj-1",
    task: "Implement user authentication flow",
    taskId: "task-1",
    hours: 4.5,
    description: "Implemented login and signup forms with validation",
  },
  {
    id: "entry-2",
    date: "2025-03-25",
    project: "E-commerce App",
    projectId: "proj-1",
    task: "Create product listing page",
    taskId: "task-4",
    hours: 3.0,
    description: "Started implementing responsive grid layout for products",
  },
  {
    id: "entry-3",
    date: "2025-03-26",
    project: "E-commerce App",
    projectId: "proj-1",
    task: "Implement user authentication flow",
    taskId: "task-1",
    hours: 5.0,
    description: "Integrated JWT authentication and implemented token refresh logic",
  },
  {
    id: "entry-4",
    date: "2025-03-27",
    project: "CRM System",
    projectId: "proj-2",
    task: "Set up CI/CD pipeline",
    taskId: "task-3",
    hours: 2.5,
    description: "Set up GitHub Actions workflow for automated testing",
  },
  {
    id: "entry-5",
    date: "2025-03-27",
    project: "E-commerce App",
    projectId: "proj-1",
    task: "Create product listing page",
    taskId: "task-4",
    hours: 4.0,
    description: "Implemented filtering and sorting functionality",
  },
  {
    id: "entry-6",
    date: "2025-03-28",
    project: "E-commerce App",
    projectId: "proj-1",
    task: "Create product listing page",
    taskId: "task-4",
    hours: 6.0,
    description: "Finished product listing implementation and wrote unit tests",
  },
  {
    id: "entry-7",
    date: "2025-03-29",
    project: "CRM System",
    projectId: "proj-2",
    task: "Set up CI/CD pipeline",
    taskId: "task-3",
    hours: 3.0,
    description: "Configured deployment pipeline for staging environment",
  },
]

/**
 * Mock work reports data
 */
const mockReports: WorkReport[] = [
  {
    id: "report-1",
    title: "Weekly Time Sheet - Mar 25-31, 2025",
    type: "Time Sheet",
    status: "Submitted",
    frequency: "Weekly",
    dateRange: {
      from: "2025-03-25",
      to: "2025-03-31",
    },
    createdAt: "2025-03-30T10:15:00Z",
    submittedAt: "2025-03-31T09:30:00Z",
    timeEntries: mockTimeEntries,
    totalHours: mockTimeEntries.reduce((sum, entry) => sum + entry.hours, 0),
    projects: [
      {
        id: "proj-1",
        name: "E-commerce App",
        hours: mockTimeEntries
          .filter((entry) => entry.projectId === "proj-1")
          .reduce((sum, entry) => sum + entry.hours, 0),
        percentage: 0, // Will be calculated
      },
      {
        id: "proj-2",
        name: "CRM System",
        hours: mockTimeEntries
          .filter((entry) => entry.projectId === "proj-2")
          .reduce((sum, entry) => sum + entry.hours, 0),
        percentage: 0, // Will be calculated
      },
    ],
  },
  {
    id: "report-2",
    title: "E-commerce App Progress Report - March 2025",
    type: "Progress Report",
    status: "Approved",
    frequency: "Monthly",
    dateRange: {
      from: "2025-03-01",
      to: "2025-03-31",
    },
    createdAt: "2025-03-29T14:20:00Z",
    submittedAt: "2025-03-30T10:00:00Z",
    approvedAt: "2025-03-31T11:15:00Z",
    approvedBy: {
      id: "user-123",
      name: "John Smith",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
    },
    achievements: `- Completed user authentication implementation
- Designed and implemented product listing page with filtering and sorting
- Set up automated testing and CI/CD pipeline
- Optimized image loading for better performance`,
    challenges: `- Encountered issues with JWT token refresh mechanism
- Mobile responsiveness required additional work for complex UI elements`,
    nextSteps: `- Implement shopping cart functionality
- Integrate payment gateway
- Add product search with autocomplete`,
    notes: "Overall good progress this month. The team is working well together and we're on track to meet the next milestone deadline.",
  },
  {
    id: "report-3",
    title: "Weekly Status Update - Mar 18-24, 2025",
    type: "Status Update",
    status: "Approved",
    frequency: "Weekly",
    dateRange: {
      from: "2025-03-18",
      to: "2025-03-24",
    },
    createdAt: "2025-03-24T16:45:00Z",
    submittedAt: "2025-03-24T17:30:00Z",
    approvedAt: "2025-03-25T09:20:00Z",
    approvedBy: {
      id: "user-123",
      name: "John Smith",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
    },
    achievements: `- Completed database schema design
- Started user authentication implementation
- Created initial UI design mockups`,
    challenges: `- Delayed API documentation
- Integration with third-party service requires more research`,
    nextSteps: `- Continue authentication implementation
- Start product listing page
- Plan for CI/CD setup`,
  },
  {
    id: "report-4",
    title: "Weekly Time Sheet - Mar 18-24, 2025",
    type: "Time Sheet",
    status: "Approved",
    frequency: "Weekly",
    dateRange: {
      from: "2025-03-18",
      to: "2025-03-24",
    },
    createdAt: "2025-03-23T18:10:00Z",
    submittedAt: "2025-03-24T09:15:00Z",
    approvedAt: "2025-03-24T14:45:00Z",
    approvedBy: {
      id: "user-123",
      name: "John Smith",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
    },
    totalHours: 38.5,
    projects: [
      {
        id: "proj-1",
        name: "E-commerce App",
        hours: 29.5,
        percentage: 76.6,
      },
      {
        id: "proj-2",
        name: "CRM System",
        hours: 9.0,
        percentage: 23.4,
      },
    ],
  },
  {
    id: "report-5",
    title: "Weekly Status Update - Mar 25-31, 2025",
    type: "Status Update",
    status: "Draft",
    frequency: "Weekly",
    dateRange: {
      from: "2025-03-25",
      to: "2025-03-31",
    },
    createdAt: "2025-03-30T11:30:00Z",
    achievements: `- Implemented product listing page with filtering
- Made progress on authentication flow
- Started CI/CD pipeline setup`,
    challenges: `- Performance issues with large product dataset
- Mobile responsive design challenges`,
    nextSteps: `- Complete authentication implementation
- Finish CI/CD pipeline setup
- Start shopping cart development`,
  },
]

/**
 * Mock report templates
 */
const mockTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Weekly Time Sheet",
    type: "Time Sheet",
    frequency: "Weekly",
    description: "Standard weekly time tracking report with project and task breakdown",
  },
  {
    id: "template-2",
    name: "Monthly Progress Report",
    type: "Progress Report",
    frequency: "Monthly",
    description: "Detailed monthly report with achievements, challenges, and next steps",
  },
  {
    id: "template-3",
    name: "Weekly Status Update",
    type: "Status Update",
    frequency: "Weekly",
    description: "Brief weekly status update with key achievements and next steps",
  },
  {
    id: "template-4",
    name: "Daily Time Log",
    type: "Time Sheet",
    frequency: "Daily",
    description: "Detailed daily time tracking by project and task",
  },
  {
    id: "template-5",
    name: "Quarterly Project Review",
    type: "Progress Report",
    frequency: "Quarterly",
    description: "Comprehensive quarterly project review with metrics and analysis",
  },
]

/**
 * Calculate project percentages for a work report
 */
const calculateProjectPercentages = (report: WorkReport): WorkReport => {
  if (!report.projects || !report.totalHours) return report
  
  const updatedProjects = report.projects.map((project) => ({
    ...project,
    percentage: Math.round((project.hours / report.totalHours!) * 100 * 10) / 10,
  }))
  
  return {
    ...report,
    projects: updatedProjects,
  }
}

/**
 * Get work report status badge class
 */
const getStatusBadgeClass = (status: ReportStatus): string => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    case "Submitted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

/**
 * Format date range string
 */
const formatDateRange = (from: string, to: string): string => {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  
  // If same month and year, show compact format
  if (
    fromDate.getMonth() === toDate.getMonth() &&
    fromDate.getFullYear() === toDate.getFullYear()
  ) {
    return `${fromDate.getDate()} - ${toDate.getDate()} ${format(fromDate, "MMM yyyy")}`
  }
  
  // If same year, show month-month format
  if (fromDate.getFullYear() === toDate.getFullYear()) {
    return `${format(fromDate, "MMM d")} - ${format(toDate, "MMM d, yyyy")}`
  }
  
  // Different years, show full format
  return `${format(fromDate, "MMM d, yyyy")} - ${format(toDate, "MMM d, yyyy")}`
}

/**
 * Format date as relative time (e.g., "2 days ago")
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
 * Format hours with decimal
 */
const formatHours = (hours: number): string => {
  return hours.toFixed(1) + " hrs"
}

/**
 * TimeEntryForm component for adding/editing time entries
 */
interface TimeEntryFormProps {
  entry?: TimeEntry
  onSave: (entry: Omit<TimeEntry, "id">) => void
  onCancel: () => void
  projects: { id: string; name: string }[]
  tasks: { id: string; title: string; projectId: string }[]
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ 
  entry, 
  onSave, 
  onCancel,
  projects,
  tasks,
}) => {
  const [date, setDate] = useState<Date | undefined>(
    entry ? new Date(entry.date) : new Date()
  )
  const [projectId, setProjectId] = useState(entry?.projectId || "")
  const [taskId, setTaskId] = useState(entry?.taskId || "")
  const [hours, setHours] = useState(entry?.hours.toString() || "")
  const [description, setDescription] = useState(entry?.description || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter tasks based on selected project
  const filteredTasks = tasks.filter(
    (task) => !projectId || task.projectId === projectId
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form fields
    const newErrors: Record<string, string> = {}
    
    if (!date) {
      newErrors.date = "Date is required"
    }
    
    if (!projectId) {
      newErrors.project = "Project is required"
    }
    
    if (!taskId) {
      newErrors.task = "Task is required"
    }
    
    if (!hours || isNaN(parseFloat(hours)) || parseFloat(hours) <= 0) {
      newErrors.hours = "Valid hours are required"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Get project and task names
    const project = projects.find((p) => p.id === projectId)?.name || ""
    const task = tasks.find((t) => t.id === taskId)?.title || ""
    
    // Save the time entry
    onSave({
      date: date!.toISOString().split("T")[0],
      project,
      projectId,
      task,
      taskId,
      hours: parseFloat(hours),
      description,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !date && "text-muted-foreground"
                } ${errors.date ? "border-red-500" : ""}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarPrimitive
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Hours</label>
          <Input
            type="number"
            step="0.5"
            min="0.5"
            placeholder="Enter hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className={errors.hours ? "border-red-500" : ""}
          />
          {errors.hours && (
            <p className="text-xs text-red-500">{errors.hours}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Project</label>
        <Select
          value={projectId}
          onValueChange={(value) => {
            setProjectId(value)
            setTaskId("") // Reset task when project changes
          }}
        >
          <SelectTrigger className={errors.project ? "border-red-500" : ""}>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project && (
          <p className="text-xs text-red-500">{errors.project}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Task</label>
        <Select
          value={taskId}
          onValueChange={setTaskId}
          disabled={!projectId}
        >
          <SelectTrigger className={errors.task ? "border-red-500" : ""}>
            <SelectValue placeholder={projectId ? "Select task" : "Select project first"} />
          </SelectTrigger>
          <SelectContent>
            {filteredTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.task && (
          <p className="text-xs text-red-500">{errors.task}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="What did you work on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Entry</Button>
      </div>
    </form>
  )
}

/**
 * TimeSheet component for viewing and editing time entries
 */
interface TimeSheetProps {
  entries: TimeEntry[]
  onAddEntry?: (entry: Omit<TimeEntry, "id">) => void
  onEditEntry?: (id: string, entry: Omit<TimeEntry, "id">) => void
  onDeleteEntry?: (id: string) => void
  readOnly?: boolean
}

const TimeSheet: React.FC<TimeSheetProps> = ({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  readOnly = false,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | undefined>(undefined)
  
  // Group entries by date
  const entriesByDate = entries.reduce((groups, entry) => {
    const date = entry.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(entry)
    return groups
  }, {} as Record<string, TimeEntry[]>)
  
  // Sort dates in descending order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )
  
  // Get total hours
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)
  
  // Mock projects and tasks for the form
  const mockProjects = [
    { id: "proj-1", name: "E-commerce App" },
    { id: "proj-2", name: "CRM System" },
  ]
  
  const mockTasks = [
    { id: "task-1", title: "Implement user authentication flow", projectId: "proj-1" },
    { id: "task-2", title: "Design database schema", projectId: "proj-1" },
    { id: "task-3", title: "Set up CI/CD pipeline", projectId: "proj-2" },
    { id: "task-4", title: "Create product listing page", projectId: "proj-1" },
    { id: "task-5", title: "Optimize API response times", projectId: "proj-2" },
  ]
  
  // Handle saving a time entry
  const handleSaveEntry = (entry: Omit<TimeEntry, "id">) => {
    if (editingEntry) {
      onEditEntry?.(editingEntry.id, entry)
    } else {
      onAddEntry?.(entry)
    }
    
    setShowForm(false)
    setEditingEntry(undefined)
  }
  
  // Handle editing a time entry
  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry)
    setShowForm(true)
  }
  
  return (
    <div className="space-y-6">
      {/* Total hours and add entry button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Time Entries</h3>
          <p className="text-sm text-muted-foreground">
            Total: {formatHours(totalHours)}
          </p>
        </div>
        {!readOnly && (
          <Button
            onClick={() => {
              setEditingEntry(undefined)
              setShowForm(true)
            }}
            disabled={showForm}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        )}
      </div>
      
      {/* Entry form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEntry ? "Edit Time Entry" : "Add Time Entry"}</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeEntryForm
              entry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={() => {
                setShowForm(false)
                setEditingEntry(undefined)
              }}
              projects={mockProjects}
              tasks={mockTasks}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Entries list */}
      {sortedDates.length === 0 ? (
        <EmptyState
          title="No time entries"
          description="Add your first time entry to start tracking your work"
          icon={<Clock className="w-10 h-10 text-muted-foreground" />}
          action={
            !readOnly && (
              <Button
                onClick={() => {
                  setEditingEntry(undefined)
                  setShowForm(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-medium mb-2">
                {format(new Date(date), "EEEE, MMMM d, yyyy")}
              </h3>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Description</TableHead>
                      {!readOnly && <TableHead className="w-20"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entriesByDate[date].map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.project}</TableCell>
                        <TableCell>{entry.task}</TableCell>
                        <TableCell>{formatHours(entry.hours)}</TableCell>
                        <TableCell className="max-w-sm truncate">
                          {entry.description}
                        </TableCell>
                        {!readOnly && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => onDeleteEntry?.(entry.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * ProgressReport component for viewing progress reports
 */
interface ProgressReportProps {
  report: WorkReport
  readOnly?: boolean
  onUpdate?: (reportId: string, data: Partial<WorkReport>) => void
}

const ProgressReport: React.FC<ProgressReportProps> = ({
  report,
  readOnly = false,
  onUpdate,
}) => {
  const [achievements, setAchievements] = useState(report.achievements || "")
  const [challenges, setChallenges] = useState(report.challenges || "")
  const [nextSteps, setNextSteps] = useState(report.nextSteps || "")
  const [notes, setNotes] = useState(report.notes || "")
  const [editing, setEditing] = useState(false)
  
  // Handle saving changes
  const handleSave = () => {
    onUpdate?.(report.id, {
      achievements,
      challenges,
      nextSteps,
      notes,
    })
    
    setEditing(false)
  }
  
  return (
    <div className="space-y-6">
      {/* Header with edit button */}
      {!readOnly && report.status === "Draft" && (
        <div className="flex justify-end">
          <Button
            variant={editing ? "outline" : "default"}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit Report"}
          </Button>
        </div>
      )}
      
      {/* Report content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Key accomplishments during this period</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <textarea
                className="w-full min-h-40 p-3 border rounded-md"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="List your key achievements..."
              />
            ) : (
              <div className="whitespace-pre-line">{achievements}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Challenges</CardTitle>
            <CardDescription>Obstacles encountered and issues addressed</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <textarea
                className="w-full min-h-32 p-3 border rounded-md"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Describe any challenges faced..."
              />
            ) : (
              <div className="whitespace-pre-line">{challenges}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Planned actions for the next period</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <textarea
                className="w-full min-h-32 p-3 border rounded-md"
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                placeholder="List your planned next steps..."
              />
            ) : (
              <div className="whitespace-pre-line">{nextSteps}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any other relevant information</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <textarea
                className="w-full min-h-24 p-3 border rounded-md"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
              />
            ) : (
              <div className="whitespace-pre-line">{notes}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Save button */}
      {editing && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}

/**
 * ReportViewer component for viewing a specific report
 */
interface ReportViewerProps {
  report: WorkReport
  onClose: () => void
  onUpdateReport: (reportId: string, data: Partial<WorkReport>) => void
  onUpdateTimeEntry: (reportId: string, entryId: string, entry: Omit<TimeEntry, "id">) => void
  onAddTimeEntry: (reportId: string, entry: Omit<TimeEntry, "id">) => void
  onDeleteTimeEntry: (reportId: string, entryId: string) => void
  onSubmitReport: (reportId: string) => void
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  onClose,
  onUpdateReport,
  onUpdateTimeEntry,
  onAddTimeEntry,
  onDeleteTimeEntry,
  onSubmitReport,
}) => {
  // Determine if the report is editable
  const isEditable = report.status === "Draft"
  
  // Format creation date
  const formattedCreationDate = new Date(report.createdAt).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  
  // Format date range
  const dateRange = formatDateRange(report.dateRange.from, report.dateRange.to)
  
  // Handle submitting the report
  const handleSubmit = () => {
    // Confirm before submitting
    if (confirm("Are you sure you want to submit this report? You won't be able to edit it after submission.")) {
      onSubmitReport(report.id)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{report.title}</h2>
          <div className="flex flex-wrap items-center mt-1 gap-2">
            <Badge className={getStatusBadgeClass(report.status)}>
              {report.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 inline-block mr-1" />
              {dateRange}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isEditable && (
            <Button onClick={handleSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Submit Report
            </Button>
          )}
        </div>
      </div>
      
      {/* Report metadata */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Report Type</h4>
              <p>{report.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Frequency</h4>
              <p>{report.frequency}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
              <p>{formattedCreationDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report content */}
      <Tabs defaultValue={report.type === "Time Sheet" ? "timesheet" : "progress"}>
        <TabsList>
          {report.type === "Time Sheet" && <TabsTrigger value="timesheet">Time Sheet</TabsTrigger>}
          {(report.type === "Progress Report" || report.type === "Status Update") && (
            <TabsTrigger value="progress">Progress Report</TabsTrigger>
          )}
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        {report.type === "Time Sheet" && (
          <TabsContent value="timesheet" className="mt-6">
            <TimeSheet
              entries={report.timeEntries || []}
              onAddEntry={(entry) => onAddTimeEntry(report.id, entry)}
              onEditEntry={(id, entry) => onUpdateTimeEntry(report.id, id, entry)}
              onDeleteEntry={(id) => onDeleteTimeEntry(report.id, id)}
              readOnly={!isEditable}
            />
          </TabsContent>
        )}
        
        {(report.type === "Progress Report" || report.type === "Status Update") && (
          <TabsContent value="progress" className="mt-6">
            <ProgressReport
              report={report}
              readOnly={!isEditable}
              onUpdate={(reportId, data) => onUpdateReport(reportId, data)}
            />
          </TabsContent>
        )}
        
        <TabsContent value="summary" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time allocation by project */}
            {report.projects && report.projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Time Allocation</CardTitle>
                  <CardDescription>Hours spent per project</CardDescription>
                </CardHeader>
                <CardContent>
                  {report.projects.map((project) => (
                    <div key={project.id} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{project.name}</span>
                        <span className="text-sm">{formatHours(project.hours)} ({project.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${project.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{formatHours(report.totalHours || 0)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Report status and submission details */}
            <Card>
              <CardHeader>
                <CardTitle>Report Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <Badge className={getStatusBadgeClass(report.status)}>
                    {report.status}
                  </Badge>
                </div>
                
                {report.submittedAt && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Submitted</h4>
                    <p>{new Date(report.submittedAt).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}</p>
                  </div>
                )}
                
                {report.approvedAt && report.approvedBy && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Approved By</h4>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <img
                          src={report.approvedBy.avatar}
                          alt={report.approvedBy.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{report.approvedBy.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(report.approvedAt).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                )}
                
                {report.status === "Draft" && (
                  <div className="pt-2">
                    <Button className="w-full" onClick={handleSubmit}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </Button>
                  </div>
                )}
                
                {report.status !== "Draft" && (
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * WorkReports component for team members to view and manage their work reports
 */
const WorkReports = () => {
  const { } = useAuth()
  const [reports, setReports] = useState<WorkReport[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [filteredReports, setFilteredReports] = useState<WorkReport[]>([])
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null)
  const [showNewReportModal, setShowNewReportModal] = useState(false)

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/reports/my-reports');
        // const data = await response.json();
        
        // Update project percentages for each report
        const processedReports = mockReports.map(calculateProjectPercentages)
        setReports(processedReports)
        setTemplates(mockTemplates)
      } catch (error) {
        console.error("Failed to fetch reports:", error)
        toast.error("Failed to load reports. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Apply filters whenever the filter criteria or reports change
  useEffect(() => {
    let result = [...reports]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (report) => report.title.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((report) => report.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((report) => report.type === typeFilter)
    }

    setFilteredReports(result)
  }, [searchQuery, statusFilter, typeFilter, reports])

  // Create a new report
  const handleCreateReport = (templateId: string) => {
    // Find the template
    const template = templates.find((t) => t.id === templateId)
    
    if (!template) {
      toast.error("Template not found")
      return
    }
    
    // Generate title based on template type and current date
    let title = ""
    let fromDate = new Date()
    let toDate = new Date()
    
    // Adjust date range based on frequency
    if (template.frequency === "Daily") {
      title = `Daily ${template.type} - ${format(new Date(), "MMM d, yyyy")}`
    } else if (template.frequency === "Weekly") {
      // Start from Monday of current week
      const day = fromDate.getDay()
      const diff = fromDate.getDate() - day + (day === 0 ? -6 : 1)
      fromDate = new Date(fromDate.setDate(diff))
      
      // End on Sunday of current week
      toDate = new Date(fromDate)
      toDate.setDate(toDate.getDate() + 6)
      
      title = `Weekly ${template.type} - ${format(fromDate, "MMM d")}-${format(toDate, "d, yyyy")}`
    } else if (template.frequency === "Monthly") {
      // Start from first day of current month
      fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1)
      
      // End on last day of current month
      toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0)
      
      title = `Monthly ${template.type} - ${format(fromDate, "MMMM yyyy")}`
    } else if (template.frequency === "Quarterly") {
      // Determine current quarter
      const quarter = Math.floor(fromDate.getMonth() / 3)
      
      // Start from first day of current quarter
      fromDate = new Date(fromDate.getFullYear(), quarter * 3, 1)
      
      // End on last day of current quarter
      toDate = new Date(fromDate.getFullYear(), (quarter + 1) * 3, 0)
      
      title = `Quarterly ${template.type} - Q${quarter + 1} ${fromDate.getFullYear()}`
    }
    
    // Create the new report
    const newReport: WorkReport = {
      id: `report-${Date.now()}`,
      title,
      type: template.type,
      status: "Draft",
      frequency: template.frequency,
      dateRange: {
        from: fromDate.toISOString().split("T")[0],
        to: toDate.toISOString().split("T")[0],
      },
      createdAt: new Date().toISOString(),
      timeEntries: template.type === "Time Sheet" ? [] : undefined,
      totalHours: template.type === "Time Sheet" ? 0 : undefined,
      projects: template.type === "Time Sheet" ? [] : undefined,
      achievements: template.type === "Progress Report" || template.type === "Status Update" ? "" : undefined,
      challenges: template.type === "Progress Report" || template.type === "Status Update" ? "" : undefined,
      nextSteps: template.type === "Progress Report" || template.type === "Status Update" ? "" : undefined,
    }
    
    // Add the new report to the list
    setReports([newReport, ...reports])
    
    // Select the new report
    setSelectedReport(newReport)
    
    toast.success("New report created!")
  }

  // Update a report
  const handleUpdateReport = (reportId: string, data: Partial<WorkReport>) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, ...data } : report
    )
    
    setReports(updatedReports)
    
    // Update selected report if it's the one being edited
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, ...data })
    }
    
    toast.success("Report updated")
  }

  // Add a time entry to a report
  const handleAddTimeEntry = (reportId: string, entry: Omit<TimeEntry, "id">) => {
    const report = reports.find((r) => r.id === reportId)
    
    if (!report || !report.timeEntries) return
    
    const newEntry: TimeEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
    }
    
    const newTimeEntries = [...report.timeEntries, newEntry]
    
    // Calculate total hours
    const totalHours = newTimeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    
    // Update projects
    const projectsMap = new Map<string, { id: string; name: string; hours: number; percentage: number }>()
    
    newTimeEntries.forEach((entry) => {
      if (!projectsMap.has(entry.projectId)) {
        projectsMap.set(entry.projectId, {
          id: entry.projectId,
          name: entry.project,
          hours: 0,
          percentage: 0,
        })
      }
      
      const project = projectsMap.get(entry.projectId)!
      project.hours += entry.hours
    })
    
    const projects = Array.from(projectsMap.values()).map((project) => ({
      ...project,
      percentage: Math.round((project.hours / totalHours) * 100 * 10) / 10,
    }))
    
    // Update the report
    const updatedReport = {
      ...report,
      timeEntries: newTimeEntries,
      totalHours,
      projects,
    }
    
    // Update reports list
    const updatedReports = reports.map((r) =>
      r.id === reportId ? updatedReport : r
    )
    
    setReports(updatedReports)
    
    // Update selected report if it's the one being edited
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(updatedReport)
    }
    
    toast.success("Time entry added")
  }

  // Update a time entry in a report
  const handleUpdateTimeEntry = (reportId: string, entryId: string, entry: Omit<TimeEntry, "id">) => {
    const report = reports.find((r) => r.id === reportId)
    
    if (!report || !report.timeEntries) return
    
    const updatedTimeEntries = report.timeEntries.map((e) =>
      e.id === entryId ? { ...entry, id: entryId } : e
    )
    
    // Calculate total hours
    const totalHours = updatedTimeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    
    // Update projects
    const projectsMap = new Map<string, { id: string; name: string; hours: number; percentage: number }>()
    
    updatedTimeEntries.forEach((entry) => {
      if (!projectsMap.has(entry.projectId)) {
        projectsMap.set(entry.projectId, {
          id: entry.projectId,
          name: entry.project,
          hours: 0,
          percentage: 0,
        })
      }
      
      const project = projectsMap.get(entry.projectId)!
      project.hours += entry.hours
    })
    
    const projects = Array.from(projectsMap.values()).map((project) => ({
      ...project,
      percentage: Math.round((project.hours / totalHours) * 100 * 10) / 10,
    }))
    
    // Update the report
    const updatedReport = {
      ...report,
      timeEntries: updatedTimeEntries,
      totalHours,
      projects,
    }
    
    // Update reports list
    const updatedReports = reports.map((r) =>
      r.id === reportId ? updatedReport : r
    )
    
    setReports(updatedReports)
    
    // Update selected report if it's the one being edited
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(updatedReport)
    }
    
    toast.success("Time entry updated")
  }

  // Delete a time entry from a report
  const handleDeleteTimeEntry = (reportId: string, entryId: string) => {
    const report = reports.find((r) => r.id === reportId)
    
    if (!report || !report.timeEntries) return
    
    const updatedTimeEntries = report.timeEntries.filter((e) => e.id !== entryId)
    
    // Calculate total hours
    const totalHours = updatedTimeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    
    // Update projects
    const projectsMap = new Map<string, { id: string; name: string; hours: number; percentage: number }>()
    
    updatedTimeEntries.forEach((entry) => {
      if (!projectsMap.has(entry.projectId)) {
        projectsMap.set(entry.projectId, {
          id: entry.projectId,
          name: entry.project,
          hours: 0,
          percentage: 0,
        })
      }
      
      const project = projectsMap.get(entry.projectId)!
      project.hours += entry.hours
    })
    
    const projects = Array.from(projectsMap.values()).map((project) => ({
      ...project,
      percentage: totalHours > 0 
        ? Math.round((project.hours / totalHours) * 100 * 10) / 10
        : 0,
    }))
    
    // Update the report
    const updatedReport = {
      ...report,
      timeEntries: updatedTimeEntries,
      totalHours,
      projects,
    }
    
    // Update reports list
    const updatedReports = reports.map((r) =>
      r.id === reportId ? updatedReport : r
    )
    
    setReports(updatedReports)
    
    // Update selected report if it's the one being edited
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(updatedReport)
    }
    
    toast.success("Time entry deleted")
  }

  // Submit a report
  const handleSubmitReport = (reportId: string) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            status: "Submitted" as ReportStatus,
            submittedAt: new Date().toISOString(),
          }
        : report
    )
    
    setReports(updatedReports)
    
    // Update selected report if it's the one being submitted
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({
        ...selectedReport,
        status: "Submitted",
        submittedAt: new Date().toISOString(),
      })
    }
    
    toast.success("Report submitted successfully!")
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <PageHeader
        title="Work Reports"
        description="Create and manage your time sheets, progress reports, and status updates."
        actions={
          <Button onClick={() => setShowNewReportModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        }
      />

      {selectedReport ? (
        // Report viewer
        <ReportViewer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateReport={handleUpdateReport}
          onUpdateTimeEntry={handleUpdateTimeEntry}
          onAddTimeEntry={handleAddTimeEntry}
          onDeleteTimeEntry={handleDeleteTimeEntry}
          onSubmitReport={handleSubmitReport}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <div className="flex items-center w-full max-w-sm space-x-2">
                <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 flex-1"
                    />
                </div>
            </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Time Sheet">Time Sheet</SelectItem>
                    <SelectItem value="Progress Report">Progress Report</SelectItem>
                    <SelectItem value="Status Update">Status Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Create new report button (small screens) */}
            <div className="md:hidden">
              <Button className="w-full" onClick={() => setShowNewReportModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading reports...</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredReports.length === 0 && (
            <EmptyState
              title="No reports found"
              description={
                reports.length === 0
                  ? "Create your first report to start tracking your work."
                  : "No reports match your current filter criteria."
              }
              icon={<FileText className="w-12 h-12 text-muted-foreground" />}
              action={
                reports.length === 0 ? (
                  <Button onClick={() => setShowNewReportModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Report
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setTypeFilter("all")
                  }}>
                    Clear Filters
                  </Button>
                )
              }
            />
          )}

          {/* Reports list */}
          {!loading && filteredReports.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <div
                    className={`h-1 ${
                      report.status === "Draft"
                        ? "bg-gray-300 dark:bg-gray-600"
                        : report.status === "Submitted"
                        ? "bg-blue-500"
                        : report.status === "Approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge className={getStatusBadgeClass(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <CardTitle className="mt-2">{report.title}</CardTitle>
                    <CardDescription>
                      <Calendar className="w-3.5 h-3.5 inline-block mr-1" />
                      {formatDateRange(report.dateRange.from, report.dateRange.to)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {report.type === "Time Sheet" && report.totalHours !== undefined && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Total Hours:</span>
                        <span className="font-medium">{formatHours(report.totalHours)}</span>
                      </div>
                    )}
                    
                    {report.submittedAt && (
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Submitted {formatRelativeTime(report.submittedAt)}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* New report modal */}
          {showNewReportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle>Create New Report</CardTitle>
                  <CardDescription>
                    Select a template for your new report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-start border rounded-md p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                        onClick={() => {
                          handleCreateReport(template.id)
                          setShowNewReportModal(false)
                        }}
                      >
                        <div>
                          <h3 className="font-medium mb-1">{template.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Badge variant="outline" className="mr-2">
                              {template.type}
                            </Badge>
                            <Badge variant="outline">
                              {template.frequency}
                            </Badge>
                          </div>
                          <p className="text-sm">{template.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewReportModal(false)}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WorkReports