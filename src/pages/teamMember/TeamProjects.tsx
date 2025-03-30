import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/common/PageHeader"
import EmptyState from "@/components/common/EmptyState"
import { Calendar, Clock, Eye, Folder, Loader2, Search } from "lucide-react"

/**
 * Project status type
 */
type ProjectStatus = "Active" | "Completed" | "On Hold" | "Planned"

/**
 * Project interface
 */
interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  endDate: string
  progress: number
  tasksCompleted: number
  totalTasks: number
}

/**
 * Mock projects data
 */
const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "E-commerce Website Redesign",
    description: "Redesigning the main e-commerce platform with improved UX and mobile responsiveness",
    status: "Active",
    startDate: "2025-02-15",
    endDate: "2025-05-30",
    progress: 45,
    tasksCompleted: 27,
    totalTasks: 60,
  },
  {
    id: "proj-2",
    name: "CRM System Implementation",
    description: "Implementing a new customer relationship management system with integration to existing tools",
    status: "Active",
    startDate: "2025-01-10",
    endDate: "2025-04-20",
    progress: 65,
    tasksCompleted: 78,
    totalTasks: 120,
  },
  {
    id: "proj-3",
    name: "Mobile App Development",
    description: "Building a new mobile application for both iOS and Android platforms",
    status: "Planned",
    startDate: "2025-04-01",
    endDate: "2025-08-15",
    progress: 0,
    tasksCompleted: 0,
    totalTasks: 85,
  },
  {
    id: "proj-4",
    name: "Content Marketing Campaign",
    description: "Creating and executing a content marketing strategy for Q2 2025",
    status: "Active",
    startDate: "2025-03-01",
    endDate: "2025-06-30",
    progress: 30,
    tasksCompleted: 12,
    totalTasks: 40,
  },
  {
    id: "proj-5",
    name: "Internal Dashboard Development",
    description: "Creating an internal analytics dashboard for executive reporting",
    status: "Completed",
    startDate: "2025-01-05",
    endDate: "2025-02-28",
    progress: 100,
    tasksCompleted: 45,
    totalTasks: 45,
  },
]

/**
 * Get status badge styling based on project status
 */
const getStatusBadgeClass = (status: ProjectStatus): string => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "On Hold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Planned":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

/**
 * Format date range for display
 */
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const startMonth = start.toLocaleString('default', { month: 'short' })
  const endMonth = end.toLocaleString('default', { month: 'short' })
  
  // Same year
  if (start.getFullYear() === end.getFullYear()) {
    // Same month
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`
    }
    // Different month, same year
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`
  }
  
  // Different years
  return `${startMonth} ${start.getDate()}, ${start.getFullYear()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
}

/**
 * TeamProjects component for team members to view all projects
 */
const TeamProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/projects');
        // const data = await response.json();
        
        setProjects(mockProjects)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects when search query, active tab, or projects change
  useEffect(() => {
    let filtered = [...projects]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) => 
          project.name.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query)
      )
    }
    
    // Apply status filter
    if (activeTab !== "all") {
      filtered = filtered.filter((project) => {
        if (activeTab === "active") return project.status === "Active"
        if (activeTab === "completed") return project.status === "Completed"
        if (activeTab === "onhold") return project.status === "On Hold"
        if (activeTab === "planned") return project.status === "Planned"
        return true
      })
    }
    
    setFilteredProjects(filtered)
  }, [searchQuery, activeTab, projects])

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <PageHeader
        title="My Projects"
        description="View and manage all projects you're currently assigned to."
      />

      {/* Filters */}
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center w-full max-w-sm">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 flex-1"
            />
          </div>
        </div>
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="onhold">On Hold</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading projects...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredProjects.length === 0 && (
        <EmptyState
          title="No projects found"
          description={
            projects.length === 0
              ? "You aren't assigned to any projects yet."
              : "No projects match your current filter criteria."
          }
          icon={<Folder className="w-12 h-12 text-muted-foreground" />}
          action={
            projects.length === 0 ? undefined : (
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setActiveTab("all")
              }}>
                Clear Filters
              </Button>
            )
          }
        />
      )}

      {/* Projects grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className={`h-1 ${
                project.status === "Active" ? "bg-green-500" :
                project.status === "Completed" ? "bg-blue-500" :
                project.status === "On Hold" ? "bg-yellow-500" :
                "bg-purple-500"
              }`} />
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className={getStatusBadgeClass(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="mt-2 line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5 inline-block mr-1" />
                      {formatDateRange(project.startDate, project.endDate)}
                    </p>
                    <p className="text-sm">
                      <Clock className="w-3.5 h-3.5 inline-block mr-1" />
                      Tasks: {project.tasksCompleted} of {project.totalTasks} completed
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          project.status === "Active" ? "bg-green-500" :
                          project.status === "Completed" ? "bg-blue-500" :
                          project.status === "On Hold" ? "bg-yellow-500" :
                          "bg-purple-500"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to={`/team/projects/${project.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamProjects