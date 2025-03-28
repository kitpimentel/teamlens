import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, isThisWeek, isThisMonth, addWeeks, startOfWeek, endOfWeek } from "date-fns"
import { 
  Calendar, 
  Users, 
  BarChart2, 
  Plus, 
  Filter, 
  Download, 
  Search, 
  Settings, 
  AlertTriangle, 
  HelpCircle,
  ChevronsUpDown,
  ChevronDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TeamCapacityChart } from "@/components/charts"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * Schema for capacity allocation form
 */
const capacityFormSchema = z.object({
  userId: z.string().min(1, "User is required"),
  projectId: z.string().min(1, "Project is required"),
  allocation: z.number().min(0).max(100, "Allocation must be between 0-100%"),
  startDate: z.date(),
  endDate: z.date(),
  notes: z.string().optional(),
})

/**
 * Team Capacity Management page for Org Admins
 */
function TeamCapacity() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeTimeframe, setActiveTimeframe] = useState("week")
  const [teamData, setTeamData] = useState<any[]>([])
  const [projectsData, setProjectsData] = useState<any[]>([])
  const [allocationsData, setAllocationsData] = useState<any[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof capacityFormSchema>>({
    resolver: zodResolver(capacityFormSchema),
    defaultValues: {
      userId: "",
      projectId: "",
      allocation: 50,
      startDate: new Date(),
      endDate: addWeeks(new Date(), 4),
      notes: "",
    },
  })
  
  // Fetch team, projects and allocations data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock team data
      const mockTeam = [
        {
          id: "user-1",
          name: "John Doe",
          avatar: "",
          role: "UI/UX Designer",
          department: "Design",
          maxCapacity: 40, // hours per week
          skills: ["UI Design", "User Research", "Prototyping"],
          currentAllocation: 85, // percentage
        },
        {
          id: "user-2",
          name: "Jane Smith",
          avatar: "",
          role: "Project Manager",
          department: "Management",
          maxCapacity: 40,
          skills: ["Project Management", "Agile", "Client Relations"],
          currentAllocation: 100,
        },
        {
          id: "user-3",
          name: "Robert Johnson",
          avatar: "",
          role: "Frontend Developer",
          department: "Engineering",
          maxCapacity: 40,
          skills: ["React", "TypeScript", "CSS"],
          currentAllocation: 75,
        },
        {
          id: "user-4",
          name: "Emily Davis",
          avatar: "",
          role: "Backend Developer",
          department: "Engineering",
          maxCapacity: 40,
          skills: ["Node.js", "MongoDB", "API Design"],
          currentAllocation: 90,
        },
        {
          id: "user-5",
          name: "Michael Brown",
          avatar: "",
          role: "QA Engineer",
          department: "Quality Assurance",
          maxCapacity: 40,
          skills: ["Testing", "Automation", "QA Processes"],
          currentAllocation: 60,
        },
        {
          id: "user-6",
          name: "Sarah Wilson",
          avatar: "",
          role: "Content Strategist",
          department: "Marketing",
          maxCapacity: 40,
          skills: ["Content Strategy", "Copywriting", "SEO"],
          currentAllocation: 70,
        },
        {
          id: "user-7",
          name: "David Miller",
          avatar: "",
          role: "DevOps Engineer",
          department: "Operations",
          maxCapacity: 40,
          skills: ["AWS", "CI/CD", "Docker"],
          currentAllocation: 80,
        },
      ]
      
      // Mock projects data
      const mockProjects = [
        {
          id: "proj-1",
          name: "Website Redesign",
          color: "#4f46e5",
          client: "Acme Corporation",
          startDate: "2023-05-15T00:00:00Z",
          endDate: "2023-07-20T00:00:00Z",
          status: "inProgress",
          teamAllocation: 4, // Number of team members
        },
        {
          id: "proj-2",
          name: "Mobile App Development",
          color: "#0ea5e9",
          client: "Globex Industries",
          startDate: "2023-06-01T00:00:00Z",
          endDate: "2023-09-15T00:00:00Z",
          status: "inProgress",
          teamAllocation: 3,
        },
        {
          id: "proj-3",
          name: "E-commerce Platform",
          color: "#10b981",
          client: "Oceanic Airlines",
          startDate: "2023-04-10T00:00:00Z",
          endDate: "2023-08-30T00:00:00Z",
          status: "inProgress",
          teamAllocation: 5,
        },
        {
          id: "proj-4",
          name: "Internal Dashboard",
          color: "#f59e0b",
          client: "Internal",
          startDate: "2023-06-10T00:00:00Z",
          endDate: "2023-07-10T00:00:00Z",
          status: "inProgress",
          teamAllocation: 2,
        },
      ]
      
      // Mock allocations data
      const mockAllocations = [
        {
          id: "alloc-1",
          userId: "user-1",
          projectId: "proj-1",
          allocation: 50, // percentage
          startDate: "2023-05-15T00:00:00Z",
          endDate: "2023-07-20T00:00:00Z",
          hoursPerWeek: 20,
        },
        {
          id: "alloc-2",
          userId: "user-1",
          projectId: "proj-3",
          allocation: 35,
          startDate: "2023-06-01T00:00:00Z",
          endDate: "2023-08-30T00:00:00Z",
          hoursPerWeek: 14,
        },
        {
          id: "alloc-3",
          userId: "user-2",
          projectId: "proj-1",
          allocation: 50,
          startDate: "2023-05-15T00:00:00Z",
          endDate: "2023-07-20T00:00:00Z",
          hoursPerWeek: 20,
        },
        {
          id: "alloc-4",
          userId: "user-2",
          projectId: "proj-2",
          allocation: 50,
          startDate: "2023-06-01T00:00:00Z",
          endDate: "2023-09-15T00:00:00Z",
          hoursPerWeek: 20,
        },
        {
          id: "alloc-5",
          userId: "user-3",
          projectId: "proj-1",
          allocation: 25,
          startDate: "2023-05-15T00:00:00Z",
          endDate: "2023-07-20T00:00:00Z",
          hoursPerWeek: 10,
        },
        {
          id: "alloc-6",
          userId: "user-3",
          projectId: "proj-2",
          allocation: 50,
          startDate: "2023-06-01T00:00:00Z",
          endDate: "2023-09-15T00:00:00Z",
          hoursPerWeek: 20,
        },
        {
          id: "alloc-7",
          userId: "user-4",
          projectId: "proj-3",
          allocation: 70,
          startDate: "2023-04-10T00:00:00Z",
          endDate: "2023-08-30T00:00:00Z",
          hoursPerWeek: 28,
        },
        {
          id: "alloc-8",
          userId: "user-4",
          projectId: "proj-4",
          allocation: 20,
          startDate: "2023-06-10T00:00:00Z",
          endDate: "2023-07-10T00:00:00Z",
          hoursPerWeek: 8,
        },
        {
          id: "alloc-9",
          userId: "user-5",
          projectId: "proj-1",
          allocation: 20,
          startDate: "2023-05-15T00:00:00Z",
          endDate: "2023-07-20T00:00:00Z",
          hoursPerWeek: 8,
        },
        {
          id: "alloc-10",
          userId: "user-5",
          projectId: "proj-2",
          allocation: 40,
          startDate: "2023-06-01T00:00:00Z",
          endDate: "2023-09-15T00:00:00Z",
          hoursPerWeek: 16,
        },
        {
          id: "alloc-11",
          userId: "user-6",
          projectId: "proj-1",
          allocation: 30,
          startDate: "2023-05-15T00:00:00Z",
          endDate: "2023-07-20T00:00:00Z",
          hoursPerWeek: 12,
        },
        {
          id: "alloc-12",
          userId: "user-6",
          projectId: "proj-3",
          allocation: 40,
          startDate: "2023-04-10T00:00:00Z",
          endDate: "2023-08-30T00:00:00Z",
          hoursPerWeek: 16,
        },
        {
          id: "alloc-13",
          userId: "user-7",
          projectId: "proj-3",
          allocation: 50,
          startDate: "2023-04-10T00:00:00Z",
          endDate: "2023-08-30T00:00:00Z",
          hoursPerWeek: 20,
        },
        {
          id: "alloc-14",
          userId: "user-7",
          projectId: "proj-4",
          allocation: 30,
          startDate: "2023-06-10T00:00:00Z",
          endDate: "2023-07-10T00:00:00Z",
          hoursPerWeek: 12,
        },
      ]
      
      setTeamData(mockTeam)
      setProjectsData(mockProjects)
      setAllocationsData(mockAllocations)
      setIsLoading(false)
    }
    
    fetchData()
  }, [])
  
  /**
   * Handle form submission for creating a new allocation
   */
  const onSubmit = async (values: z.infer<typeof capacityFormSchema>) => {
    // In a real app, this would send the data to the server
    console.log("Creating allocation:", values)
    
    // Show success toast
    toast({
      title: "Allocation created",
      description: "Team member allocation has been created successfully.",
    })
    
    // Reset form and close dialog
    form.reset()
    setOpenDialog(false)
  }
  
  /**
   * Filter team members by search term
   */
  const filteredTeam = searchTerm
    ? teamData.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : teamData
  
  /**
   * Get user's allocations
   */
  const getUserAllocations = (userId: string) => {
    return allocationsData.filter(allocation => allocation.userId === userId)
  }
  
  /**
   * Get project name by ID
   */
  const getProjectName = (projectId: string) => {
    const project = projectsData.find(project => project.id === projectId)
    return project ? project.name : 'Unknown Project'
  }
  
  /**
   * Get project color by ID
   */
  const getProjectColor = (projectId: string) => {
    const project = projectsData.find(project => project.id === projectId)
    return project ? project.color : '#888888'
  }
  
  /**
   * Check if a date range is current
   */
  const isDateRangeCurrent = (startDate: string, endDate: string) => {
    const now = new Date()
    return new Date(startDate) <= now && new Date(endDate) >= now
  }
  
  /**
   * Get initials from name for avatar fallback
   */
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
  
  /**
   * Calculate team allocation data
   */
  const calculateTeamAllocationData = () => {
    return {
      labels: ["Under Allocated", "Optimally Allocated", "Over Allocated"],
      datasets: [
        {
          label: "Team Members",
          data: [
            teamData.filter(member => member.currentAllocation < 70).length,
            teamData.filter(member => member.currentAllocation >= 70 && member.currentAllocation <= 90).length,
            teamData.filter(member => member.currentAllocation > 90).length
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.7)",  // green
            "rgba(59, 130, 246, 0.7)", // blue
            "rgba(239, 68, 68, 0.7)",  // red
          ],
        },
      ],
    }
  }
  
  /**
   * Calculate department allocation data
   */
  const calculateDepartmentAllocationData = () => {
    // Get unique departments
    const departments = Array.from(new Set(teamData.map(member => member.department)))
    
    // Calculate average allocation per department
    return {
      labels: departments,
      datasets: [
        {
          label: "Average Allocation",
          data: departments.map(dept => {
            const deptMembers = teamData.filter(member => member.department === dept)
            const avgAllocation = deptMembers.reduce((sum, member) => sum + member.currentAllocation, 0) / deptMembers.length
            return avgAllocation
          }),
          backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
        },
      ],
    }
  }
  
  /**
   * Calculate project allocation data
   */
  const calculateProjectAllocationData = () => {
    return {
      labels: projectsData.map(project => project.name),
      datasets: [
        {
          label: "Team Members",
          data: projectsData.map(project => project.teamAllocation),
          backgroundColor: projectsData.map(project => project.color),
        },
      ],
    }
  }
  
  /**
   * Generate team capacity chart data
   */
  const generateTeamCapacityData = () => {
    // Simple example for demonstration
    return {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Total Capacity",
          data: [280, 280, 280, 280, 280, 280], // 7 team members * 40 hours
          borderColor: "rgba(148, 163, 184, 0.7)",
          backgroundColor: "rgba(148, 163, 184, 0.1)",
          fill: true,
        },
        {
          label: "Allocated",
          data: [245, 250, 260, 255, 240, 235], // Simulated allocated hours
          borderColor: "rgba(59, 130, 246, 0.7)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
        },
      ],
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Capacity Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your team's workload and capacity
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Allocate Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Resource Allocation</DialogTitle>
              <DialogDescription>
                Allocate team member capacity to a project
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Team Member</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamData.map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} - {member.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Project</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectsData.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="allocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocation Percentage</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <span>%</span>
                      </div>
                      <FormDescription>
                        Percentage of team member's time allocated to this project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={"w-full pl-3 text-left font-normal"}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
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
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={"w-full pl-3 text-left font-normal"}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
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
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Any additional notes about this allocation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Allocation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>
                Current allocation and capacity across all team members
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="qa">Quality Assurance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="underallocated">Under Allocated</SelectItem>
                  <SelectItem value="optimalallocated">Optimally Allocated</SelectItem>
                  <SelectItem value="overallocated">Over Allocated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[500px] rounded-md border">
              <div className="p-4 space-y-4">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-md">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20 mt-1" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mt-3" />
                    </div>
                  ))
                ) : (
                  filteredTeam.map(member => (
                    <div key={member.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.role} • {member.department}</div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Allocation</span>
                            <span className={
                              member.currentAllocation > 90 
                                ? "text-red-500" 
                                : member.currentAllocation > 80 
                                ? "text-amber-500" 
                                : "text-green-500"
                            }>
                              {member.currentAllocation}%
                            </span>
                          </div>
                          <Progress value={member.currentAllocation} 
                            className={
                              member.currentAllocation > 90 
                                ? "bg-red-100 dark:bg-red-950" 
                                : member.currentAllocation > 80 
                                ? "bg-amber-100 dark:bg-amber-950" 
                                : "bg-green-100 dark:bg-green-950"
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={
                            member.currentAllocation > 90 
                              ? "destructive" 
                              : member.currentAllocation > 80 
                              ? "default" 
                              : "secondary"
                          }>
                            {member.currentAllocation > 90 
                              ? "Over Allocated" 
                              : member.currentAllocation > 80 
                              ? "Near Capacity" 
                              : "Available"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronsUpDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Allocation
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage Capacity
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {getUserAllocations(member.id).length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Current Allocations:</p>
                          <div className="flex flex-wrap gap-2">
                            {getUserAllocations(member.id).map(allocation => (
                              <div 
                                key={allocation.id} 
                                className="text-xs px-2 py-1 rounded-md flex items-center gap-1"
                                style={{ 
                                  backgroundColor: `${getProjectColor(allocation.projectId)}20`,
                                  color: getProjectColor(allocation.projectId),
                                  border: `1px solid ${getProjectColor(allocation.projectId)}40`,
                                }}
                              >
                                <span 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: getProjectColor(allocation.projectId) }}
                                ></span>
                                <span>{getProjectName(allocation.projectId)}</span>
                                <span className="font-medium">{allocation.allocation}%</span>
                                {isDateRangeCurrent(allocation.startDate, allocation.endDate) && (
                                  <span className="ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-1 rounded">
                                    Active
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="project">By Project</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          {activeTab === "timeline" && (
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger 
                  value="week" 
                  onClick={() => setActiveTimeframe("week")}
                  className={activeTimeframe === "week" ? "bg-primary text-primary-foreground" : ""}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month" 
                  onClick={() => setActiveTimeframe("month")}
                  className={activeTimeframe === "month" ? "bg-primary text-primary-foreground" : ""}
                >
                  Month
                </TabsTrigger>
                <TabsTrigger 
                  value="quarter" 
                  onClick={() => setActiveTimeframe("quarter")}
                  className={activeTimeframe === "quarter" ? "bg-primary text-primary-foreground" : ""}
                >
                  Quarter
                </TabsTrigger>
              </TabsList>
            </div>
          )}
        </div>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Team Allocation Distribution</CardTitle>
                <CardDescription>How team members are allocated across projects</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <div className="h-[250px]">
                    <BarChart data={calculateTeamAllocationData()} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Department Allocation</CardTitle>
                <CardDescription>Average allocation by department</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <div className="h-[250px]">
                    <BarChart data={calculateDepartmentAllocationData()} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Project Resources</CardTitle>
                <CardDescription>Team members allocated to each project</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <div className="h-[250px]">
                    <BarChart data={calculateProjectAllocationData()} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Capacity Forecast</CardTitle>
              <CardDescription>Team capacity and allocation over the next 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <TeamCapacityChart data={generateTeamCapacityData()} />
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-medium">Resource Conflicts</CardTitle>
                <CardDescription>Potential resource conflicts and over-allocations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200">
                      <AlertTriangle className="h-5 w-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Jane Smith is over-allocated</h4>
                        <p className="text-sm">Currently at 100% allocation across multiple projects. Consider redistributing workload.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200">
                      <AlertTriangle className="h-5 w-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Emily Davis is nearing capacity</h4>
                        <p className="text-sm">Currently at 90% allocation. Monitor workload and avoid adding new tasks.</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
                <CardDescription>Common resource management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    View Unallocated Team Members
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Resolve Resource Conflicts
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Capacity Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Capacity Planning Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="department" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Department Capacity</CardTitle>
              <CardDescription>Current allocation by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Engineering</h4>
                        <span className="text-sm">82% Allocated</span>
                      </div>
                      <Progress value={82} className="h-2" />
                      <div className="text-xs text-muted-foreground">3 team members • 120/146 hours allocated</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Design</h4>
                        <span className="text-sm">85% Allocated</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="text-xs text-muted-foreground">1 team member • 34/40 hours allocated</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Management</h4>
                        <span className="text-sm text-red-500">100% Allocated</span>
                      </div>
                      <Progress value={100} className="h-2 bg-red-100 dark:bg-red-950" />
                      <div className="text-xs text-muted-foreground">1 team member • 40/40 hours allocated</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Quality Assurance</h4>
                        <span className="text-sm text-green-500">60% Allocated</span>
                      </div>
                      <Progress value={60} className="h-2 bg-green-100 dark:bg-green-950" />
                      <div className="text-xs text-muted-foreground">1 team member • 24/40 hours allocated</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Marketing</h4>
                        <span className="text-sm">70% Allocated</span>
                      </div>
                      <Progress value={70} className="h-2" />
                      <div className="text-xs text-muted-foreground">1 team member • 28/40 hours allocated</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Operations</h4>
                        <span className="text-sm">80% Allocated</span>
                      </div>
                      <Progress value={80} className="h-2" />
                      <div className="text-xs text-muted-foreground">1 team member • 32/40 hours allocated</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="project" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-28" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              projectsData.map(project => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      ></span>
                      <CardTitle className="text-base font-medium">{project.name}</CardTitle>
                    </div>
                    <CardDescription>{project.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Allocation</span>
                        <span>{project.teamAllocation} team members</span>
                      </div>
                      <div className="space-y-3">
                        {allocationsData
                          .filter(allocation => allocation.projectId === project.id)
                          .map(allocation => {
                            const teamMember = teamData.find(member => member.id === allocation.userId)
                            if (!teamMember) return null
                            
                            return (
                              <div key={allocation.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={teamMember.avatar} alt={teamMember.name} />
                                    <AvatarFallback className="text-xs">{getInitials(teamMember.name)}</AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm">{teamMember.name}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-sm text-muted-foreground">{allocation.hoursPerWeek}h/week</div>
                                  <Badge variant="outline" className="text-xs">{allocation.allocation}%</Badge>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <div>{format(new Date(project.startDate), 'MMM d, yyyy')} - {format(new Date(project.endDate), 'MMM d, yyyy')}</div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Resource Timeline
                {activeTimeframe === "week" && " - This Week"}
                {activeTimeframe === "month" && " - This Month"}
                {activeTimeframe === "quarter" && " - This Quarter"}
              </CardTitle>
              <CardDescription>
                {activeTimeframe === "week" && 
                  `${format(startOfWeek(new Date()), 'MMM d')} - ${format(endOfWeek(new Date()), 'MMM d, yyyy')}`
                }
                {activeTimeframe === "month" && 
                  `${format(new Date(), 'MMMM yyyy')}`
                }
                {activeTimeframe === "quarter" && 
                  `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Timeline visualization coming soon. This will show a Gantt-style view of 
                    resource allocations over time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeamCapacity