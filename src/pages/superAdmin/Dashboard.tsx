import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Building2, 
  ArrowUpRight, 
  Layers, 
  Server, 
  Activity 
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Dashboard component for Super Admin users
 */
function SuperAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  const statsCards = [
    {
      title: "Total Organizations",
      value: "127",
      change: "+12%",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      title: "Active Users",
      value: "3,452",
      change: "+8%",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Platform Usage",
      value: "89%",
      change: "+5%",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Active Integrations",
      value: "512",
      change: "+15%",
      icon: <Layers className="h-4 w-4" />,
    },
  ]
  
  // Recent organizations data for table
  const recentOrganizations = [
    { id: 1, name: "Acme Corp", users: 45, projects: 12, status: "active", date: "2023-06-15" },
    { id: 2, name: "Globex Industries", users: 32, projects: 8, status: "active", date: "2023-06-14" },
    { id: 3, name: "Wayne Enterprises", users: 78, projects: 24, status: "active", date: "2023-06-12" },
    { id: 4, name: "Stark Industries", users: 53, projects: 16, status: "active", date: "2023-06-10" },
    { id: 5, name: "Umbrella Corp", users: 28, projects: 6, status: "onboarding", date: "2023-06-08" },
  ]
  
  // Column definitions for organization table
  const columns = [
    {
      accessorKey: "name",
      header: "Organization",
    },
    {
      accessorKey: "users",
      header: "Users",
    },
    {
      accessorKey: "projects",
      header: "Projects",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status")
        return (
          <div className="flex items-center">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                status === "active" ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            <span className="capitalize">{status}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "date",
      header: "Join Date",
    },
  ]
  
  // User growth by month data for chart
  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [120, 150, 180, 220, 270, 300],
        backgroundColor: "hsl(var(--primary))",
        borderColor: "hsl(var(--primary))",
        borderWidth: 2,
      },
    ],
  }
  
  // Organization distribution data for pie chart
  const organizationTypeData = {
    labels: ["Enterprise", "Mid-Market", "Small Business", "Startup"],
    datasets: [
      {
        label: "Organizations by Type",
        data: [35, 42, 28, 22],
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(152 76% 50%)",
          "hsl(20 100% 70%)",
        ],
        borderWidth: 1,
        borderColor: "hsl(var(--background))",
      },
    ],
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <div className="rounded-full p-1 bg-secondary/10 text-secondary">
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <h4 className="text-3xl font-bold">{card.value}</h4>
                    <span className="flex items-center text-xs text-green-600">
                      {card.change}
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main content area with tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* User Growth Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly new user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <LineChart data={userGrowthData} height={300} />
                )}
              </CardContent>
            </Card>
            
            {/* Organization Types */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Organization Types</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <PieChart data={organizationTypeData} height={300} />
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Organizations Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Organizations</CardTitle>
                <CardDescription>
                  Latest organizations that joined the platform
                </CardDescription>
              </div>
              <Button variant="outline">View All</Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <DataTable columns={columns} data={recentOrganizations} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Detailed usage metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section would contain detailed analytics on platform usage, 
                popular features, and performance metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>System-generated reports and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section would contain downloadable reports, custom report 
                generation options, and scheduled reporting features.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current platform health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <span>API Services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-muted-foreground" />
                    <span>Integration Services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <span>Analytics Engine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-sm">Operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SuperAdminDashboard