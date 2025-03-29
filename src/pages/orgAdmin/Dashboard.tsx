import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, Users, Gauge, Zap, AlertTriangle
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Organization Admin Dashboard component
 * Displays overview of project statuses, team performance, and key metrics
 */
const OrgDashboard = () => {
  const { user } = useAuth()
  
  // Mock data for dashboard metrics
  const dashboardMetrics = {
    activeProjects: 8,
    completedProjects: 12,
    overdueTasks: 5,
    teamMembers: 24,
    upcomingDeadlines: 7,
    sprintHealth: 85,
    issuesReported: 4,
    issuesResolved: 3,
    teamVelocity: 78,
    clientSatisfaction: 92
  }

  // Mock data for team capacity and velocity
  const teamCapacityData = [
    { name: "Development", capacity: 85, allocated: 72 },
    { name: "Design", capacity: 65, allocated: 60 },
    { name: "QA", capacity: 55, allocated: 50 },
    { name: "DevOps", capacity: 45, allocated: 30 },
    { name: "Management", capacity: 35, allocated: 25 }
  ]

  // Mock data for recent activity
  const recentActivity = [
    { 
      id: 1, 
      action: "Task completed", 
      description: "Login and authentication flow completed", 
      user: "Sarah Chen", 
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff", 
      time: "10 minutes ago",
      project: "Customer Portal"
    },
    { 
      id: 2, 
      action: "Issue reported", 
      description: "Mobile menu not responsive on iPhone 13", 
      user: "Jason Patel", 
      avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff", 
      time: "45 minutes ago",
      project: "E-commerce App"
    },
    { 
      id: 3, 
      action: "Meeting scheduled", 
      description: "Sprint planning for next week", 
      user: "Michelle Wang", 
      avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff", 
      time: "2 hours ago",
      project: "Team Lens"
    },
    { 
      id: 4, 
      action: "Project milestone reached", 
      description: "Alpha version ready for internal testing", 
      user: "David Kim", 
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff", 
      time: "Yesterday",
      project: "Mobile Banking App"
    }
  ]

  // Mock data for project statuses
  const projectStatuses = [
    { 
      id: 1, 
      name: "Team Lens Dashboard", 
      progress: 85, 
      status: "On Track", 
      deadline: "Apr 15, 2025", 
      team: "Development",
      client: "Internal"
    },
    { 
      id: 2, 
      name: "E-commerce Mobile App", 
      progress: 62, 
      status: "At Risk", 
      deadline: "May 3, 2025", 
      team: "Mobile Dev",
      client: "Retail Inc."
    },
    { 
      id: 3, 
      name: "Marketing Website Redesign", 
      progress: 43, 
      status: "On Track", 
      deadline: "Jun 10, 2025", 
      team: "Design",
      client: "TechStart LLC"
    },
    { 
      id: 4, 
      name: "API Integration", 
      progress: 22, 
      status: "Behind", 
      deadline: "Apr 30, 2025", 
      team: "Backend",
      client: "FinTech Solutions"
    }
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening across your projects.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>+ New Project</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.teamMembers}</div>
                <p className="text-xs text-muted-foreground">
                  +3 new this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.overdueTasks}</div>
                <p className="text-xs text-muted-foreground">
                  -2 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sprint Health</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.sprintHealth}%</div>
                <p className="text-xs text-muted-foreground">
                  +5% increase
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Project Status Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status Overview</CardTitle>
              <CardDescription>Current status of your active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectStatuses.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.client} • {project.team} • Due {project.deadline}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "On Track" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                          : project.status === "At Risk" 
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}>
                        {project.status}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>{project.progress}% complete</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">{activity.action}</span>: {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time} • {activity.project}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab Content */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Active Projects</CardTitle>
              <CardDescription>Detailed view of all ongoing projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Showing {dashboardMetrics.activeProjects} active projects
              </p>
              
              <div className="space-y-6">
                {/* Project list would go here - more detailed than the overview */}
                <p className="text-center text-muted-foreground py-6">
                  More detailed project listing would be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Performance Tab Content */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Capacity & Allocation</CardTitle>
              <CardDescription>Current team workload and capacity limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamCapacityData.map((team, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{team.name} Team</div>
                      <div className="text-sm text-muted-foreground">
                        {team.allocated}/{team.capacity} hours allocated
                      </div>
                    </div>
                    <Progress 
                      value={(team.allocated / team.capacity) * 100} 
                      className={
                        (team.allocated / team.capacity) > 0.9 
                          ? "text-destructive" 
                          : (team.allocated / team.capacity) > 0.7 
                          ? "text-yellow-500" 
                          : ""
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Velocity</CardTitle>
                <CardDescription>Sprint points completed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold">{dashboardMetrics.teamVelocity}</p>
                  <p className="text-sm text-muted-foreground">Average points per sprint</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    (Detailed velocity chart would be displayed here)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
                <CardDescription>Based on recent feedback</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Gauge className="h-24 w-24 text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{dashboardMetrics.clientSatisfaction}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Based on feedback from 8 clients
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OrgDashboard