import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Grid, BarChart as BarChartIcon, Activity, Users, Building2, Settings, PieChart as PieChartIcon, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AreaChart } from '@/components/admin/charts/AreaChart'
import { BarChartComponent } from '@/components/admin/charts/BarChart'
import { KpiCard } from '@/components/admin/KpiCard'
import { DoughnutChart } from '@/components/admin/charts/DoughnutChart'
import { RecentActivityList } from '@/components/admin/RecentActivityList'

/**
 * SuperAdminDashboard component displays the main dashboard for the Super Admin role.
 * It includes: 
 * - KPI cards with key metrics
 * - Charts for user growth, organization activity, and platform performance
 * - Recent activities and alerts
 * - Quick access to important admin functions
 */
const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [timeframe, setTimeframe] = useState<string>('7d')
  
  // Mock data for KPIs
  const kpiData = [
    { 
      title: 'Total Users',
      value: '4,328',
      change: '+12.5%',
      trend: 'up' as const,
      description: 'Total users across all organizations',
      icon: <Users className="h-4 w-4" />
    },
    { 
      title: 'Organizations',
      value: '47',
      change: '+3',
      trend: 'up' as const,
      description: 'Active organizations on platform',
      icon: <Building2 className="h-4 w-4" />
    },
    { 
      title: 'API Calls',
      value: '892K',
      change: '+8.3%',
      trend: 'up' as const,
      description: 'Last 30 days platform API usage',
      icon: <Activity className="h-4 w-4" />
    },
    { 
      title: 'Integration Uptime',
      value: '99.97%',
      change: '-0.01%',
      trend: 'down' as const,
      description: 'Average uptime across all integrations',
      icon: <Grid className="h-4 w-4" />
    }
  ]
  
  // Mock data for charts
  const userGrowthData = [
    { name: 'Jan', users: 1350 },
    { name: 'Feb', users: 1500 },
    { name: 'Mar', users: 1750 },
    { name: 'Apr', users: 2100 },
    { name: 'May', users: 2400 },
    { name: 'Jun', users: 2850 },
    { name: 'Jul', users: 3200 },
    { name: 'Aug', users: 3600 },
    { name: 'Sep', users: 3950 },
    { name: 'Oct', users: 4328 }
  ]
  
  const orgActivityData = [
    { name: 'Mon', tasks: 458, meetings: 238 },
    { name: 'Tue', tasks: 580, meetings: 320 },
    { name: 'Wed', tasks: 690, meetings: 280 },
    { name: 'Thu', tasks: 720, meetings: 290 },
    { name: 'Fri', tasks: 530, meetings: 185 },
    { name: 'Sat', tasks: 145, meetings: 35 },
    { name: 'Sun', tasks: 98, meetings: 20 }
  ]
  
  const platformUsageData = [
    { name: 'JIRA', value: 32 },
    { name: 'ClickUp', value: 24 },
    { name: 'Asana', value: 18 },
    { name: 'Monday', value: 15 },
    { name: 'Teams', value: 7 },
    { name: 'Zoom', value: 4 }
  ]
  
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'user_added',
      message: 'New organization "Acme Corp" was created',
      timestamp: '2 hours ago',
      user: 'System'
    },
    {
      id: 2,
      type: 'integration',
      message: 'JIRA integration was updated to v3.2.1',
      timestamp: '5 hours ago',
      user: 'System'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Monday.com API rate limiting detected',
      timestamp: '1 day ago',
      user: 'System Monitor'
    },
    {
      id: 4,
      type: 'user_added',
      message: '15 new users joined across all organizations',
      timestamp: '2 days ago',
      user: 'User Service'
    },
    {
      id: 5,
      type: 'alert',
      message: 'Database backup completed successfully',
      timestamp: '2 days ago',
      user: 'Backup Service'
    }
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Team Lens Super Admin dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KpiCard 
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            description={kpi.description}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">User Growth</CardTitle>
                <CardDescription>Total users across all organizations</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AreaChart data={userGrowthData} xKey="name" yKey="users" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Weekly Activity</CardTitle>
                <CardDescription>Tasks and meetings across platform</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChartComponent 
                  data={orgActivityData} 
                  categories={['tasks', 'meetings']} 
                  index="name" 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-medium">Integration Usage</CardTitle>
                <CardDescription>By percentage of activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <DoughnutChart data={platformUsageData} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                <CardDescription>System and platform events</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivityList activities={recentActivities} />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/super-admin/reports')}>
                  View All Activity
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed platform analytics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The analytics dashboard is currently being enhanced with more detailed metrics.
                Use the Reports tab for current analytics insights.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                System generated and scheduled reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/super-admin/reports')}>
                  Monthly Platform Performance Report
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/super-admin/reports')}>
                  User Growth Analysis
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/super-admin/reports')}>
                  Integration Health Status
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/super-admin/reports')}>
                View All Reports
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">User Management</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage users across all organizations, review permissions and access levels.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/super-admin/users')}>
              Manage Users
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, or manage organizations and their subscription details.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/super-admin/organizations')}>
              Manage Organizations
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Platform Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure platform-wide settings, defaults, and integrations.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/super-admin/settings')}>
              Platform Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default SuperAdminDashboard