import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Search,
  Filter,
  Plus,
  ExternalLink,
  CalendarDays,
  PlusCircle,
  Flag, // Added the missing Flag icon import
} from "lucide-react";
import { format } from "date-fns";
import TaskList, { Task } from "@/components/projects/TaskList";
import TeamMembers from "@/components/projects/TeamMembers";
import ProjectTimeline from "@/components/projects/ProjectTimeline";

/**
 * Project interface to properly type our data
 */
interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface Risk {
  id: string;
  title: string;
  description: string;
  severity: string;
  mitigation: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  client: {
    id: string;
    name: string;
    logo: string;
  };
  manager: ProjectMember;
  team: ProjectMember[];
  tasks: Task[];
  milestones: Milestone[];
  risks: Risk[];
  documents: Document[];
}

/**
 * Project Overview page for Team Members
 */
function ProjectOverview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch project data
  useEffect(() => {
    const fetchProjectDetails = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock project data - in a real app, this would be fetched from an API
      const mockProject: Project = {
        id: "proj-1",
        name: "Website Redesign",
        description: "Redesign and implement the company website with improved UX and modern design",
        status: "inProgress",
        progress: 68,
        startDate: "2023-05-15T00:00:00Z",
        endDate: "2023-07-20T00:00:00Z",
        client: {
          id: "client-1",
          name: "Acme Corporation",
          logo: ""
        },
        manager: {
          id: "user-2",
          name: "Jane Smith",
          avatar: "",
          email: "jane@example.com",
          role: "Project Manager"
        },
        team: [
          {
            id: "user-1",
            name: "John Doe",
            avatar: "",
            email: "john@example.com",
            role: "UI/UX Designer"
          },
          {
            id: "user-2",
            name: "Jane Smith",
            avatar: "",
            email: "jane@example.com",
            role: "Project Manager"
          },
          {
            id: "user-3",
            name: "Robert Johnson",
            avatar: "",
            email: "robert@example.com",
            role: "Frontend Developer"
          },
          {
            id: "user-4",
            name: "Emily Davis",
            avatar: "",
            email: "emily@example.com",
            role: "Backend Developer"
          },
          {
            id: "user-5",
            name: "Michael Brown",
            avatar: "",
            email: "michael@example.com",
            role: "QA Engineer"
          }
        ],
        tasks: [
          {
            id: "task-1",
            title: "Design new dashboard layout",
            description: "Create wireframes and mockups for the new dashboard layout",
            status: "inProgress",
            priority: "high",
            dueDate: "2023-06-18T18:00:00Z",
            assignee: {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            tags: ["Design", "UI/UX"]
          },
          {
            id: "task-2",
            title: "Implement authentication flow",
            description: "Implement user login, registration and password reset functionality",
            status: "todo",
            priority: "high",
            dueDate: "2023-06-20T18:00:00Z",
            assignee: {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            tags: ["Backend", "Security"]
          },
          {
            id: "task-3",
            title: "Fix responsive layout issues",
            description: "Fix layout issues on mobile devices",
            status: "inProgress",
            priority: "medium",
            dueDate: "2023-06-19T18:00:00Z",
            assignee: {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            tags: ["Frontend", "CSS"]
          },
          {
            id: "task-6",
            title: "Unit testing for authentication module",
            description: "Write unit tests for the authentication module",
            status: "completed",
            priority: "medium",
            dueDate: "2023-06-15T18:00:00Z",
            assignee: {
              id: "user-5",
              name: "Michael Brown",
              avatar: ""
            },
            tags: ["Testing", "Backend"]
          },
          {
            id: "task-7",
            title: "Create brand guidelines document",
            description: "Document brand colors, typography, and component design patterns",
            status: "completed",
            priority: "low",
            dueDate: "2023-06-10T18:00:00Z",
            assignee: {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            tags: ["Design", "Documentation"]
          },
          {
            id: "task-8",
            title: "Design contact form",
            description: "Create form layout and validation flow",
            status: "todo",
            priority: "medium",
            dueDate: "2023-06-25T18:00:00Z",
            assignee: {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            tags: ["Design", "UI/UX"]
          },
          {
            id: "task-9",
            title: "Implement homepage hero section",
            description: "Code the responsive hero section with animations",
            status: "todo",
            priority: "medium",
            dueDate: "2023-06-27T18:00:00Z",
            assignee: {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            tags: ["Frontend", "Animation"]
          },
        ],
        milestones: [
          {
            id: "milestone-1",
            title: "Design Phase Complete",
            description: "All design assets and prototypes approved by client",
            dueDate: "2023-06-01T00:00:00Z",
            status: "completed"
          },
          {
            id: "milestone-2",
            title: "Frontend Development Complete",
            description: "All frontend components implemented and responsive",
            dueDate: "2023-06-30T00:00:00Z",
            status: "inProgress"
          },
          {
            id: "milestone-3",
            title: "Backend Integration Complete",
            description: "All API endpoints implemented and tested",
            dueDate: "2023-07-15T00:00:00Z",
            status: "todo"
          },
          {
            id: "milestone-4",
            title: "Project Launch",
            description: "Final QA, deployment and handover to client",
            dueDate: "2023-07-20T00:00:00Z",
            status: "todo"
          }
        ],
        risks: [
          {
            id: "risk-1",
            title: "Third-party API integration delay",
            description: "Potential delay in integration due to API documentation issues",
            severity: "medium",
            mitigation: "Start integration early and prepare fallback options"
          },
          {
            id: "risk-2",
            title: "Client feedback delays",
            description: "Possible delays in receiving timely feedback from the client",
            severity: "high",
            mitigation: "Schedule regular check-ins and set clear feedback deadlines"
          }
        ],
        documents: [
          {
            id: "doc-1",
            title: "Project Brief",
            description: "Initial project requirements and scope document",
            updatedAt: "2023-05-15T10:00:00Z",
            author: {
              id: "user-2",
              name: "Jane Smith"
            }
          },
          {
            id: "doc-2",
            title: "Design System",
            description: "Component library and design guidelines",
            updatedAt: "2023-05-30T14:30:00Z",
            author: {
              id: "user-1",
              name: "John Doe"
            }
          },
          {
            id: "doc-3",
            title: "Technical Architecture",
            description: "Technical stack and implementation details",
            updatedAt: "2023-06-05T09:15:00Z",
            author: {
              id: "user-4",
              name: "Emily Davis"
            }
          }
        ]
      };
      
      // Check if the project exists
      if (id === "proj-1") {
        setProject(mockProject);
      }
      
      setIsLoading(false);
    };
    
    fetchProjectDetails();
  }, [id]);
  
  /**
   * Get initials from name for avatar fallback
   */
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  /**
   * Get status color class
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'inProgress':
        return 'bg-blue-500 text-white';
      case 'todo':
        return 'bg-gray-500 text-white';
      case 'at-risk':
        return 'bg-amber-500 text-white';
      case 'blocked':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  /**
   * Navigate back to projects list
   */
  const goBack = () => {
    navigate('/team/projects');
  };
  
  /**
   * Calculate project timeline
   */
  const calculateTimeline = () => {
    if (!project) return { daysTotal: 0, daysRemaining: 0, percentComplete: 0 };
    
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();
    
    const daysTotal = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) daysRemaining = 0;
    
    const daysPassed = daysTotal - daysRemaining;
    const percentComplete = Math.round((daysPassed / daysTotal) * 100);
    
    return { daysTotal, daysRemaining, percentComplete };
  };
  
  /**
   * Calculate task stats
   */
  const calculateTaskStats = () => {
    if (!project) return { total: 0, completed: 0, inProgress: 0, todo: 0, percentComplete: 0 };
    
    const total = project.tasks.length;
    const completed = project.tasks.filter((task) => task.status === 'completed').length;
    const inProgress = project.tasks.filter((task) => task.status === 'inProgress').length;
    const todo = project.tasks.filter((task) => task.status === 'todo').length;
    
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, inProgress, todo, percentComplete };
  };
  
  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-full max-w-md mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }
  
  // If project not found, show error
  if (!project) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Project Not Found</h2>
        </div>
        
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <XCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">Project not found</h3>
              <p className="text-muted-foreground mb-6">
                The project you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={goBack}>Back to Projects</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Calculate timeline and task stats
  const timeline = calculateTimeline();
  const taskStats = calculateTaskStats();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-muted-foreground">
            {project.client.name}
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                {format(new Date(project.startDate), 'MMM d, yyyy')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
              </CardDescription>
            </div>
            <Badge className={cn("capitalize", getStatusColor(project.status))}>
              {project.status === 'inProgress' ? 'In Progress' : project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              {project.description}
            </p>
            
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <div className="text-sm">Team:</div>
              <div className="flex -space-x-2">
                {project.team.slice(0, 5).map((member) => (
                  <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.team.length > 5 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{project.team.length - 5}
                  </div>
                )}
              </div>
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Timeline Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="text-2xl font-bold">{timeline.daysRemaining} days</p>
                <p className="text-xs text-muted-foreground">remaining of {timeline.daysTotal}</p>
              </div>
            </div>
            <Progress value={timeline.percentComplete} className="h-2 mt-4" />
          </CardContent>
        </Card>
        
        {/* Tasks Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tasks</p>
                <p className="text-2xl font-bold">{taskStats.completed}/{taskStats.total}</p>
                <p className="text-xs text-muted-foreground">completed tasks</p>
              </div>
            </div>
            <Progress value={taskStats.percentComplete} className="h-2 mt-4" />
          </CardContent>
        </Card>
        
        {/* Milestones Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900">
                <Flag className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Milestones</p>
                <p className="text-2xl font-bold">
                  {project.milestones.filter((m) => m.status === 'completed').length}/{project.milestones.length}
                </p>
                <p className="text-xs text-muted-foreground">completed milestones</p>
              </div>
            </div>
            <Progress 
              value={(project.milestones.filter((m) => m.status === 'completed').length / project.milestones.length) * 100} 
              className="h-2 mt-4"
            />
          </CardContent>
        </Card>
        
        {/* Risks Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Risks</p>
                <p className="text-2xl font-bold">{project.risks.length}</p>
                <p className="text-xs text-muted-foreground">identified risks</p>
              </div>
            </div>
            <div className="mt-2">
              {project.risks.map((risk) => (
                <div key={risk.id} className="flex items-center gap-2 text-xs mb-1">
                  <div 
                    className={cn(
                      "h-2 w-2 rounded-full",
                      risk.severity === 'high' ? 'bg-red-500' : 
                      risk.severity === 'medium' ? 'bg-amber-500' : 
                      'bg-blue-500'
                    )}
                  ></div>
                  <span className="truncate">{risk.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Project Tasks</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>All Tasks</DropdownMenuItem>
                      <DropdownMenuItem>My Tasks</DropdownMenuItem>
                      <DropdownMenuItem>High Priority</DropdownMenuItem>
                      <DropdownMenuItem>Due Soon</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TaskList 
                tasks={project.tasks} 
                searchTerm={searchTerm} 
                onTaskClick={(taskId: string) => navigate(`/team/tasks/${taskId}`)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Project Timeline</CardTitle>
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Change View
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProjectTimeline 
                milestones={project.milestones}
                startDate={project.startDate}
                endDate={project.endDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View Team Capacity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TeamMembers team={project.team} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Project Documents</CardTitle>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md p-2 bg-muted">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <p className="text-muted-foreground">
                        Last updated {format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                      </p>
                      <p>by {doc.author.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProjectOverview;