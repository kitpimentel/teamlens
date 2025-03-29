import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  ExternalLink,
  Users, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  BarChart3,
  Building2,
  Activity
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
  teamMembers: number
  teamLead: string
  budget?: number
  tags: string[]
  integrations: string[]
  healthScore?: number
  priority: "low" | "medium" | "high"
  lastUpdated: string
}

/**
 * Organization Admin Project Management component
 * Allows organization admins to manage projects and view their status
 */
const ProjectManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("active")
  const [clientFilter, setClientFilter] = useState<string | null>(null)

  // Form state for new project
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    client: "",
    startDate: "",
    endDate: "",
    priority: "medium",
    tags: ""
  })

  // Mock project data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj-1",
      name: "Team Lens Dashboard",
      description: "Internal project management dashboard with analytics and team coordination features.",
      client: "Internal",
      clientId: "int-1",
      status: "active",
      progress: 85,
      startDate: "2025-01-15",
      endDate: "2025-04-15",
      teamMembers: 8,
      teamLead: "Michelle Wang",
      budget: 0,
      tags: ["Web App", "React", "TypeScript"],
      integrations: ["JIRA", "GitHub"],
      healthScore: 92,
      priority: "high",
      lastUpdated: "2025-03-28T14:30:00Z"
    },
    {
      id: "proj-2",
      name: "E-commerce Mobile App",
      description: "Cross-platform mobile application for retail client with integrated payment processing.",
      client: "Retail Inc.",
      clientId: "client-1",
      status: "active",
      progress: 62,
      startDate: "2025-02-01",
      endDate: "2025-05-03",
      teamMembers: 6,
      teamLead: "Jason Patel",
      budget: 75000,
      tags: ["Mobile", "React Native", "E-commerce"],
      integrations: ["ClickUp", "Stripe"],
      healthScore: 78,
      priority: "high",
      lastUpdated: "2025-03-27T11:15:00Z"
    },
    {
      id: "proj-3",
      name: "Marketing Website Redesign",
      description: "Complete overhaul of client marketing website with improved SEO and accessibility.",
      client: "TechStart LLC",
      clientId: "client-2",
      status: "active",
      progress: 43,
      startDate: "2025-02-20",
      endDate: "2025-06-10",
      teamMembers: 4,
      teamLead: "Emily Johnson",
      budget: 45000,
      tags: ["Web Design", "SEO", "Content"],
      integrations: ["Asana", "Figma"],
      healthScore: 85,
      priority: "medium",
      lastUpdated: "2025-03-28T09:45:00Z"
    },
    {
      id: "proj-4",
      name: "API Integration",
      description: "Integration of payment processing and authentication APIs for financial client.",
      client: "FinTech Solutions",
      clientId: "client-3",
      status: "active",
      progress: 22,
      startDate: "2025-03-10",
      endDate: "2025-04-30",
      teamMembers: 3,
      teamLead: "Sarah Chen",
      budget: 35000,
      tags: ["API", "Backend", "Security"],
      integrations: ["JIRA", "Postman"],
      healthScore: 65,
      priority: "high",
      lastUpdated: "2025-03-26T16:20:00Z"
    },
    {
      id: "proj-5",
      name: "CRM Implementation",
      description: "Customized CRM solution with integration to existing customer databases.",
      client: "Global Services Inc.",
      clientId: "client-4",
      status: "on_hold",
      progress: 32,
      startDate: "2025-01-05",
      endDate: "2025-05-15",
      teamMembers: 5,
      teamLead: "David Kim",
      budget: 60000,
      tags: ["CRM", "Database", "Integration"],
      integrations: ["Monday.com", "Salesforce"],
      healthScore: 45,
      priority: "medium",
      lastUpdated: "2025-03-15T10:30:00Z"
    },
    {
      id: "proj-6",
      name: "Internal HR Portal",
      description: "Employee self-service portal for HR processes and documentation.",
      client: "Internal",
      clientId: "int-1",
      status: "completed",
      progress: 100,
      startDate: "2024-10-01",
      endDate: "2025-02-28",
      teamMembers: 4,
      teamLead: "Michelle Wang",
      budget: 0,
      tags: ["Web App", "HR", "Internal"],
      integrations: ["JIRA", "Microsoft Teams"],
      healthScore: 98,
      priority: "medium",
      lastUpdated: "2025-02-28T15:45:00Z"
    },
    {
      id: "proj-7",
      name: "Data Analytics Dashboard",
      description: "Interactive data visualization dashboard for business intelligence.",
      client: "Analytics Corp",
      clientId: "client-5",
      status: "cancelled",
      progress: 15,
      startDate: "2025-01-20",
      endDate: "2025-06-30",
      teamMembers: 3,
      teamLead: "Sarah Chen",
      budget: 55000,
      tags: ["Data Viz", "Analytics", "Dashboard"],
      integrations: ["Tableau", "ClickUp"],
      healthScore: 0,
      priority: "low",
      lastUpdated: "2025-02-15T11:20:00Z"
    }
  ])

  // Get unique clients for filtering
  const clients = Array.from(new Set(projects.map(project => project.client)))

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(project => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by status (using activeTab instead of statusFilter)
    const matchesStatus = activeTab === "all" || project.status === activeTab
    
    // Filter by client
    const matchesClient = clientFilter === null || project.client === clientFilter
    
    return matchesSearch && matchesStatus && matchesClient
  })

  // Group projects by status for displaying counts
  const activeProjects = projects.filter(project => project.status === "active")
  const completedProjects = projects.filter(project => project.status === "completed")
  const onHoldProjects = projects.filter(project => project.status === "on_hold")
  const cancelledProjects = projects.filter(project => project.status === "cancelled")

  /**
   * Handle creating a new project
   */
  const handleCreateProject = () => {
    // Validate form
    if (!newProject.name || !newProject.client || !newProject.startDate || !newProject.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    // Parse tags into array
    const tagArray = newProject.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Create new project (in a real app, this would call an API)
    const createdProject: Project = {
      id: `proj-${projects.length + 1}`,
      name: newProject.name,
      description: newProject.description,
      client: newProject.client,
      clientId: `client-${Math.floor(Math.random() * 1000)}`,
      status: "active",
      progress: 0,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      teamMembers: 0,
      teamLead: user?.name || "Unassigned",
      tags: tagArray,
      integrations: [],
      priority: newProject.priority as "low" | "medium" | "high",
      lastUpdated: new Date().toISOString()
    }

    // Add to projects list
    setProjects([createdProject, ...projects])
    
    // Reset form and close dialog
    setNewProject({
      name: "",
      description: "",
      client: "",
      startDate: "",
      endDate: "",
      priority: "medium",
      tags: ""
    })
    setCreateProjectDialogOpen(false)
    
    toast.success(`Project "${newProject.name}" created successfully`)
  }

  /**
   * Handle opening a project detail page
   */
  const handleOpenProject = (projectId: string) => {
    navigate(`/org-admin/projects/${projectId}`)
  }

  /**
   * Handle archiving a project
   */
  const handleArchiveProject = (projectId: string, projectName: string) => {
    // Update project status to completed
    const updatedProjects = projects.map(project => 
      project.id === projectId
        ? { ...project, status: "completed" as const, progress: 100 }
        : project
    )
    
    setProjects(updatedProjects)
    toast.success(`Project "${projectName}" archived`)
  }

  /**
   * Handle putting a project on hold
   */
  const handleHoldProject = (projectId: string, projectName: string) => {
    // Update project status to on_hold
    const updatedProjects = projects.map(project => 
      project.id === projectId
        ? { ...project, status: "on_hold" as const }
        : project
    )
    
    setProjects(updatedProjects)
    toast.success(`Project "${projectName}" put on hold`)
  }

  /**
   * Handle cancelling a project
   */
  const handleCancelProject = (projectId: string, projectName: string) => {
    // Update project status to cancelled
    const updatedProjects = projects.map(project => 
      project.id === projectId
        ? { ...project, status: "cancelled" as const, healthScore: 0 }
        : project
    )
    
    setProjects(updatedProjects)
    toast.success(`Project "${projectName}" cancelled`)
  }

  /**
   * Helper function to format status for display
   */
  const formatStatus = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" }
      case "completed":
        return { label: "Completed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" }
      case "on_hold":
        return { label: "On Hold", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" }
      case "cancelled":
        return { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" }
    }
  }

  /**
   * Helper function to format priority for display
   */
  const formatPriority = (priority: string) => {
    switch (priority) {
      case "high":
        return { label: "High", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" }
      case "medium":
        return { label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" }
      case "low":
        return { label: "Low", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" }
      default:
        return { label: priority, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" }
    }
  }

  /**
   * Project Card component
   */
  const ProjectCard = ({ project }: { project: Project }) => {
    const status = formatStatus(project.status)
    const priority = formatPriority(project.priority)
    
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenProject(project.id)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {project.status === "active" && (
                  <>
                    <DropdownMenuItem onClick={() => handleArchiveProject(project.id, project.name)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleHoldProject(project.id, project.name)}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Put on Hold
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleCancelProject(project.id, project.name)}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Project
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{project.client}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.teamMembers}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} 
                className={
                  project.status === "cancelled" ? "bg-red-200 dark:bg-red-900" : ""
                }
              />
            </div>
            
            <div className="flex justify-between pt-2">
              <Badge variant="outline" className={`${status.color} border-none`}>
                {status.label}
              </Badge>
              <Badge variant="outline" className={`${priority.color} border-none`}>
                {priority.label} Priority
              </Badge>
            </div>
            
            {project.healthScore !== undefined && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm">Health Score</span>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                  project.healthScore > 75 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                  project.healthScore > 50 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }`}>
                  <Activity className="h-3 w-3 mr-1" />
                  {project.healthScore}%
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex flex-wrap gap-1">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's projects and their status
          </p>
        </div>

        <Dialog open={createProjectDialogOpen} onOpenChange={setCreateProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your organization
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name">Project Name*</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Enter project description"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="project-client">Client*</Label>
                <Input
                  id="project-client"
                  placeholder="Enter client name"
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-start-date">Start Date*</Label>
                  <Input
                    id="project-start-date"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="project-end-date">End Date*</Label>
                  <Input
                    id="project-end-date"
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-priority">Priority</Label>
                  <Select 
                    value={newProject.priority} 
                    onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
                  >
                    <SelectTrigger id="project-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="project-tags">Tags</Label>
                  <Input
                    id="project-tags"
                    placeholder="Enter tags (comma separated)"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="active">
              Active ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="on_hold">
              On Hold ({onHoldProjects.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledProjects.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                CLIENT
              </DropdownMenuLabel>
              <DropdownMenuItem 
                className={!clientFilter ? "bg-muted/50" : ""} 
                onClick={() => setClientFilter(null)}
              >
                All Clients
              </DropdownMenuItem>
              {clients.map(client => (
                <DropdownMenuItem 
                  key={client} 
                  className={clientFilter === client ? "bg-muted/50" : ""}
                  onClick={() => setClientFilter(client)}
                >
                  {client}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-0">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              {activeTab === "active" && <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />}
              {activeTab === "completed" && <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-4" />}
              {activeTab === "on_hold" && <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />}
              {activeTab === "cancelled" && <XCircle className="h-10 w-10 text-muted-foreground mb-4" />}
              <p className="text-lg font-medium">No {activeTab.replace('_', ' ')} projects found</p>
              <p className="text-sm text-muted-foreground">
                {activeTab === "active" ? "Create a new project to get started" : 
                 activeTab === "completed" ? "Complete active projects to see them here" :
                 activeTab === "on_hold" ? "Projects on temporary pause will appear here" :
                 "Cancelled projects will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectManagement