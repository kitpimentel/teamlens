import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogClose
} from "@/components/ui/dialog"
import { 
  Users, 
  BarChart3, 
  Calendar, 
  Info,
  AlertTriangle,
  LineChart,
  Activity,
  Layers
} from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for team member data with capacity information
 */
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
  capacityHours: number
  allocatedHours: number
  projects: {
    id: string
    name: string
    hours: number
    color: string
  }[]
  skills: string[]
  velocity: number
  availabilityStart?: string
  availabilityEnd?: string
}

/**
 * Interface for department data
 */
interface Department {
  id: string
  name: string
  totalCapacity: number
  allocatedCapacity: number
  members: number
  utilization: number
  lead: string
}

/**
 * Interface for sprint data
 */
interface SprintData {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "active" | "planned" | "completed"
  totalPoints: number
  completedPoints: number
  teamVelocity: number
}

/**
 * Team Capacity Management component
 * Allows organization admins to manage team workload and capacity
 */
const TeamCapacity = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("team")
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false)
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null)
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null)

  // Form state for allocation
  const [allocationForm, setAllocationForm] = useState({
    projectId: "",
    hours: 0
  })

  // Mock team capacity data for individual team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "tm-1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "Lead Developer",
      department: "Development",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      capacityHours: 40,
      allocatedHours: 35,
      projects: [
        { id: "proj-1", name: "Team Lens Dashboard", hours: 20, color: "bg-blue-500" },
        { id: "proj-4", name: "API Integration", hours: 15, color: "bg-purple-500" }
      ],
      skills: ["React", "TypeScript", "Node.js", "MongoDB"],
      velocity: 12
    },
    {
      id: "tm-2",
      name: "Jason Patel",
      email: "jason.patel@example.com",
      role: "UX Designer",
      department: "Design",
      avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      capacityHours: 40,
      allocatedHours: 32,
      projects: [
        { id: "proj-1", name: "Team Lens Dashboard", hours: 15, color: "bg-blue-500" },
        { id: "proj-2", name: "E-commerce Mobile App", hours: 17, color: "bg-green-500" }
      ],
      skills: ["UI Design", "User Research", "Figma", "Prototyping"],
      velocity: 10
    },
    {
      id: "tm-3",
      name: "Michelle Wang",
      email: "michelle.wang@example.com",
      role: "Project Manager",
      department: "Management",
      avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
      capacityHours: 40,
      allocatedHours: 38,
      projects: [
        { id: "proj-1", name: "Team Lens Dashboard", hours: 10, color: "bg-blue-500" },
        { id: "proj-2", name: "E-commerce Mobile App", hours: 10, color: "bg-green-500" },
        { id: "proj-3", name: "Marketing Website Redesign", hours: 10, color: "bg-yellow-500" },
        { id: "proj-4", name: "API Integration", hours: 8, color: "bg-purple-500" }
      ],
      skills: ["Project Planning", "Agile", "Stakeholder Management", "Risk Management"],
      velocity: 8
    },
    {
      id: "tm-4",
      name: "David Kim",
      email: "david.kim@example.com",
      role: "QA Engineer",
      department: "Quality Assurance",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff",
      capacityHours: 40,
      allocatedHours: 30,
      projects: [
        { id: "proj-2", name: "E-commerce Mobile App", hours: 20, color: "bg-green-500" },
        { id: "proj-5", name: "CRM Implementation", hours: 10, color: "bg-red-500" }
      ],
      skills: ["Test Planning", "Automated Testing", "Manual Testing", "Test Documentation"],
      velocity: 9
    },
    {
      id: "tm-5",
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      role: "Frontend Developer",
      department: "Development",
      avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      capacityHours: 40,
      allocatedHours: 36,
      projects: [
        { id: "proj-1", name: "Team Lens Dashboard", hours: 15, color: "bg-blue-500" },
        { id: "proj-3", name: "Marketing Website Redesign", hours: 21, color: "bg-yellow-500" }
      ],
      skills: ["HTML/CSS", "JavaScript", "React", "Vue"],
      velocity: 11,
      availabilityStart: "2025-04-15",
      availabilityEnd: "2025-04-22"
    },
    {
      id: "tm-6",
      name: "Marcus Johnson",
      email: "marcus.johnson@example.com",
      role: "Backend Developer",
      department: "Development",
      avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=ec4899&color=fff",
      capacityHours: 40,
      allocatedHours: 20,
      projects: [
        { id: "proj-4", name: "API Integration", hours: 20, color: "bg-purple-500" }
      ],
      skills: ["Java", "Spring Boot", "SQL", "API Design"],
      velocity: 10
    },
    {
      id: "tm-7",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "Content Strategist",
      department: "Marketing",
      avatar: "https://ui-avatars.com/api/?name=Jessica+Lee&background=14b8a6&color=fff",
      capacityHours: 30, // Part time
      allocatedHours: 25,
      projects: [
        { id: "proj-3", name: "Marketing Website Redesign", hours: 25, color: "bg-yellow-500" }
      ],
      skills: ["Content Strategy", "Copywriting", "SEO", "Content Planning"],
      velocity: 7
    }
  ])

  // Mock project data for allocation
  const projects = [
    { id: "proj-1", name: "Team Lens Dashboard" },
    { id: "proj-2", name: "E-commerce Mobile App" },
    { id: "proj-3", name: "Marketing Website Redesign" },
    { id: "proj-4", name: "API Integration" },
    { id: "proj-5", name: "CRM Implementation" }
  ]

  // Mock department data
  const departments = [
    { 
      id: "dept-1", 
      name: "Development", 
      totalCapacity: 120, 
      allocatedCapacity: 91, 
      members: 3,
      utilization: 75.8,
      lead: "Sarah Chen"
    },
    { 
      id: "dept-2", 
      name: "Design", 
      totalCapacity: 40, 
      allocatedCapacity: 32, 
      members: 1,
      utilization: 80,
      lead: "Jason Patel"
    },
    { 
      id: "dept-3", 
      name: "Management", 
      totalCapacity: 40, 
      allocatedCapacity: 38, 
      members: 1,
      utilization: 95,
      lead: "Michelle Wang"
    },
    { 
      id: "dept-4", 
      name: "Quality Assurance", 
      totalCapacity: 40, 
      allocatedCapacity: 30, 
      members: 1,
      utilization: 75,
      lead: "David Kim"
    },
    { 
      id: "dept-5", 
      name: "Marketing", 
      totalCapacity: 30, 
      allocatedCapacity: 25, 
      members: 1,
      utilization: 83.3,
      lead: "Jessica Lee"
    }
  ]

  // Mock sprint data
  const sprintData: SprintData[] = [
    {
      id: "sprint-1",
      name: "Sprint 7",
      startDate: "2025-03-15",
      endDate: "2025-03-28",
      status: "completed",
      totalPoints: 120,
      completedPoints: 108,
      teamVelocity: 108
    },
    {
      id: "sprint-2",
      name: "Sprint 8",
      startDate: "2025-03-29",
      endDate: "2025-04-11",
      status: "active",
      totalPoints: 115,
      completedPoints: 45,
      teamVelocity: 110
    },
    {
      id: "sprint-3",
      name: "Sprint 9",
      startDate: "2025-04-12",
      endDate: "2025-04-25",
      status: "planned",
      totalPoints: 110,
      completedPoints: 0,
      teamVelocity: 110
    }
  ]

  // Filter team members based on department
  const filteredTeamMembers = teamMembers.filter(member => {
    return filterDepartment === null || member.department === filterDepartment
  })

  // Sort team members by utilization (allocated hours / capacity hours)
  const sortedTeamMembers = [...filteredTeamMembers].sort((a, b) => {
    const utilizationA = (a.allocatedHours / a.capacityHours) * 100
    const utilizationB = (b.allocatedHours / b.capacityHours) * 100
    return utilizationB - utilizationA
  })

  // Get unique departments for filtering
  const departmentOptions = Array.from(new Set(teamMembers.map(member => member.department)))

  // Handle opening allocation dialog for a team member
  const handleOpenAllocateDialog = (member: TeamMember) => {
    setSelectedTeamMember(member)
    setAllocateDialogOpen(true)
    setAllocationForm({
      projectId: "",
      hours: 0
    })
  }

  // Handle allocation of hours to a project
  const handleAllocateHours = () => {
    if (!selectedTeamMember) return
    
    // Validate form
    if (!allocationForm.projectId) {
      toast.error("Please select a project")
      return
    }
    
    if (allocationForm.hours <= 0) {
      toast.error("Hours must be greater than 0")
      return
    }
    
    const availableHours = selectedTeamMember.capacityHours - selectedTeamMember.allocatedHours
    if (allocationForm.hours > availableHours) {
      toast.error(`Only ${availableHours} hours available for allocation`)
      return
    }
    
    // Find selected project
    const selectedProject = projects.find(p => p.id === allocationForm.projectId)
    if (!selectedProject) {
      toast.error("Invalid project selected")
      return
    }
    
    // Generate a random color for the project if not already assigned
    const projectColors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500", "bg-pink-500"]
    const randomColor = projectColors[Math.floor(Math.random() * projectColors.length)]
    
    // Check if project already exists for this team member
    const existingProjectIndex = selectedTeamMember.projects.findIndex(p => p.id === allocationForm.projectId)
    
    // Update team members with new allocation
    const updatedTeamMembers = teamMembers.map(member => {
      if (member.id === selectedTeamMember.id) {
        const updatedProjects = [...member.projects]
        
        if (existingProjectIndex >= 0) {
          // Update existing project
          updatedProjects[existingProjectIndex] = {
            ...updatedProjects[existingProjectIndex],
            hours: updatedProjects[existingProjectIndex].hours + allocationForm.hours
          }
        } else {
          // Add new project
          updatedProjects.push({
            id: allocationForm.projectId,
            name: selectedProject.name,
            hours: allocationForm.hours,
            color: randomColor
          })
        }
        
        return {
          ...member,
          allocatedHours: member.allocatedHours + allocationForm.hours,
          projects: updatedProjects
        }
      }
      return member
    })
    
    setTeamMembers(updatedTeamMembers)
    setAllocateDialogOpen(false)
    toast.success(`${allocationForm.hours} hours allocated to ${selectedProject.name}`)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Capacity</h1>
          <p className="text-muted-foreground">
            Manage and track team workload, allocation, and capacity
          </p>
        </div>
        <Button>
          Download Capacity Report
        </Button>
      </div>

      <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
          </TabsList>
          
          {activeTab === "team" && (
            <div className="flex gap-2">
              <Select value={filterDepartment || ""} onValueChange={(value) => setFilterDepartment(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {departmentOptions.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <TabsContent value="team">
          <div className="grid gap-6">
            {sortedTeamMembers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Users className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No team members found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or add team members
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Team Members Utilization */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedTeamMembers.map(member => {
                    const utilization = (member.allocatedHours / member.capacityHours) * 100
                    const utilizationStatus = 
                      utilization > 90 ? "overallocated" :
                      utilization > 75 ? "optimal" : "underallocated"
                      
                    const isOnLeave = member.availabilityStart && member.availabilityEnd
                    
                    return (
                      <Card key={member.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg font-semibold">{member.name}</CardTitle>
                                <CardDescription className="text-sm">{member.role}</CardDescription>
                              </div>
                            </div>
                            
                            {isOnLeave && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-none">
                                <Calendar className="h-3 w-3 mr-1" />
                                On Leave Soon
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-3">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>Capacity Utilization</span>
                                <Badge variant={
                                  utilizationStatus === "overallocated" ? "destructive" :
                                  utilizationStatus === "optimal" ? "default" : "outline"
                                }>
                                  {utilization.toFixed(0)}%
                                </Badge>
                              </div>
                              <Progress value={utilization} className={
                                utilizationStatus === "overallocated" ? "text-destructive" : ""
                              } />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Allocated: {member.allocatedHours}h</span>
                                <span>Capacity: {member.capacityHours}h</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Project Allocation</div>
                              {member.projects.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No projects assigned</div>
                              ) : (
                                <div className="space-y-2">
                                  {member.projects.map((project, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                                      <div className="text-sm flex-1">{project.name}</div>
                                      <div className="text-sm text-muted-foreground">{project.hours}h</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {isOnLeave && (
                              <div className="rounded-md bg-yellow-50 dark:bg-yellow-950 p-2">
                                <div className="flex items-center text-xs text-yellow-800 dark:text-yellow-200">
                                  <Info className="h-3 w-3 mr-1" />
                                  <span>
                                    On leave {new Date(member.availabilityStart!).toLocaleDateString()} 
                                    {" - "}
                                    {new Date(member.availabilityEnd!).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs"
                            disabled={member.allocatedHours >= member.capacityHours}
                            onClick={() => handleOpenAllocateDialog(member)}
                          >
                            Allocate Hours
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
                
                {/* Team Allocation Summary */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Team Allocation Summary</CardTitle>
                    <CardDescription>
                      Overall team capacity utilization and allocation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Capacity Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Total Team Capacity</div>
                          <div className="text-2xl font-bold">
                            {teamMembers.reduce((sum, member) => sum + member.capacityHours, 0)}h
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Across {teamMembers.length} team members
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Allocated Hours</div>
                          <div className="text-2xl font-bold">
                            {teamMembers.reduce((sum, member) => sum + member.allocatedHours, 0)}h
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {((teamMembers.reduce((sum, member) => sum + member.allocatedHours, 0) / 
                            teamMembers.reduce((sum, member) => sum + member.capacityHours, 0)) * 100).toFixed(1)}% of capacity
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Available Hours</div>
                          <div className="text-2xl font-bold">
                            {teamMembers.reduce((sum, member) => sum + (member.capacityHours - member.allocatedHours), 0)}h
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Available for allocation
                          </div>
                        </div>
                      </div>
                      
                      {/* Allocation Warnings */}
                      <div className="rounded-md bg-muted p-4 mt-4">
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-medium">Capacity Alerts</div>
                          
                          {teamMembers.filter(m => (m.allocatedHours / m.capacityHours) > 0.9).length > 0 && (
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium">Overallocated Team Members</div>
                                <div className="text-sm text-muted-foreground">
                                  {teamMembers.filter(m => (m.allocatedHours / m.capacityHours) > 0.9).length} team members are allocated more than 90% of their capacity
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {teamMembers.filter(m => (m.allocatedHours / m.capacityHours) < 0.5).length > 0 && (
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium">Underallocated Team Members</div>
                                <div className="text-sm text-muted-foreground">
                                  {teamMembers.filter(m => (m.allocatedHours / m.capacityHours) < 0.5).length} team members are allocated less than 50% of their capacity
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {teamMembers.filter(m => m.availabilityStart && m.availabilityEnd).length > 0 && (
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-orange-600 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium">Upcoming Leave</div>
                                <div className="text-sm text-muted-foreground">
                                  {teamMembers.filter(m => m.availabilityStart && m.availabilityEnd).length} team members have scheduled leave in the near future
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="departments">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Capacity Overview</CardTitle>
                <CardDescription>
                  Capacity allocation across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {departments.map(dept => {
                    const utilizationPercentage = (dept.allocatedCapacity / dept.totalCapacity) * 100
                    
                    return (
                      <div key={dept.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">{dept.name} Department</div>
                            <div className="text-sm text-muted-foreground">
                              Led by {dept.lead} • {dept.members} team member{dept.members !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <Badge variant={
                            utilizationPercentage > 90 ? "destructive" :
                            utilizationPercentage > 75 ? "default" : "outline"
                          }>
                            {utilizationPercentage.toFixed(1)}% Utilized
                          </Badge>
                        </div>
                        
                        <Progress 
                          value={utilizationPercentage} 
                          className={utilizationPercentage > 90 ? "text-destructive" : ""}
                        />
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Allocated: {dept.allocatedCapacity}h</span>
                          <span>Capacity: {dept.totalCapacity}h</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Allocation Summary</CardTitle>
                  <CardDescription>
                    Distribution of allocated hours by department
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      (Department allocation chart would be displayed here)
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Department Velocity</CardTitle>
                  <CardDescription>
                    Average team velocity by department
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      (Department velocity chart would be displayed here)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid gap-6">
            {/* Team Velocity & Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Velocity Trend</CardTitle>
                  <CardDescription>
                    Velocity points completed over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      (Velocity trend chart would be displayed here)
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>
                    Task completion rates across sprints
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      (Completion rate chart would be displayed here)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sprint Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sprint Performance</CardTitle>
                <CardDescription>
                  Current and recent sprint data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sprintData.map(sprint => {
                    const completionRate = sprint.status === "planned" ? 0 : (sprint.completedPoints / sprint.totalPoints * 100)
                    
                    return (
                      <div key={sprint.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium flex items-center">
                              {sprint.name}
                              {sprint.status === "active" && (
                                <Badge variant="default" className="ml-2">Active</Badge>
                              )}
                              {sprint.status === "planned" && (
                                <Badge variant="outline" className="ml-2">Planned</Badge>
                              )}
                              {sprint.status === "completed" && (
                                <Badge variant="secondary" className="ml-2">Completed</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(sprint.startDate).toLocaleDateString()} to {new Date(sprint.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {sprint.status === "completed" ? `${sprint.completedPoints}/${sprint.totalPoints} points` : 
                                sprint.status === "active" ? `${sprint.completedPoints} of ${sprint.totalPoints} points` :
                                `${sprint.totalPoints} planned points`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Target Velocity: {sprint.teamVelocity} points
                            </div>
                          </div>
                        </div>
                        
                        {sprint.status !== "planned" && (
                          <>
                            <Progress value={completionRate} />
                            <div className="text-xs text-muted-foreground text-right">
                              {completionRate.toFixed(1)}% complete
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(teamMembers.reduce((sum, member) => sum + member.velocity, 0) / teamMembers.length * 10) / 10}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Points per sprint
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Team Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(teamMembers.reduce((sum, member) => sum + member.capacityHours, 0) / teamMembers.reduce((sum, member) => sum + member.allocatedHours, 0) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Utilization rate
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(sprintData.filter(s => s.status === "completed").reduce((sum, sprint) => sum + sprint.completedPoints, 0) /
                    sprintData.filter(s => s.status === "completed").reduce((sum, sprint) => sum + sprint.totalPoints, 0) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last 4 weeks
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sprint Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    85%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on current progress
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Allocation Dialog */}
      <Dialog open={allocateDialogOpen} onOpenChange={setAllocateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Allocate Hours to Project</DialogTitle>
            <DialogDescription>
              {selectedTeamMember && (
                <span>
                  Allocating hours for {selectedTeamMember.name}. 
                  Available capacity: {selectedTeamMember.capacityHours - selectedTeamMember.allocatedHours} hours
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select value={allocationForm.projectId} onValueChange={(value) => setAllocationForm({ ...allocationForm, projectId: value })}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="hours">Hours to Allocate</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max={selectedTeamMember ? selectedTeamMember.capacityHours - selectedTeamMember.allocatedHours : 0}
                value={allocationForm.hours}
                onChange={(e) => setAllocationForm({ ...allocationForm, hours: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAllocateHours}>Allocate Hours</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TeamCapacity