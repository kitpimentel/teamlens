// src/pages/Reports.jsx
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ArrowDownRight, ArrowUpRight, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  // Sample data for reports
  const [activeType, setActiveType] = useState("performance");
  
  // Sample metrics data
  const performanceMetrics = [
    { id: 1, name: "Tasks Completed", value: "256", change: "+12%", trend: "up" },
    { id: 2, name: "Avg. Completion Time", value: "3.2 days", change: "-8%", trend: "down" },
    { id: 3, name: "Sprint Velocity", value: "24 points", change: "+5%", trend: "up" },
    { id: 4, name: "Bug Rate", value: "1.4%", change: "-2%", trend: "down" }
  ];

  // Sample team data
  const teamMetrics = [
    { id: 1, name: "Team Utilization", value: "87%", change: "+4%", trend: "up" },
    { id: 2, name: "Resource Allocation", value: "92%", change: "+7%", trend: "up" },
    { id: 3, name: "Team Capacity", value: "76%", change: "-3%", trend: "down" },
    { id: 4, name: "Cost Performance", value: "$12.4k", change: "+2%", trend: "up" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Reports" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-gray-500">View and analyze project performance data</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Last 30 days</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="performance" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {performanceMetrics.map(metric => (
                  <Card key={metric.id}>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`text-sm mt-1 flex items-center ${
                        metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.trend === 'up' ? 
                          <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        }
                        {metric.change}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Completion Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-gray-500">Chart placeholder: Task completion over time</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sprint Velocity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-gray-500">Chart placeholder: Sprint velocity trends</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {teamMetrics.map(metric => (
                  <Card key={metric.id}>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`text-sm mt-1 flex items-center ${
                        metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.trend === 'up' ? 
                          <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        }
                        {metric.change}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Allocation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-gray-500">Chart placeholder: Team resource allocation</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-gray-500">Chart placeholder: Team performance metrics</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financial">
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Financial reports will be available in the next update</p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom">
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Custom reports feature coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Report Name</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Date Generated</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Q2 Performance Report</td>
                    <td className="p-3 text-sm text-gray-500">June 30, 2024</td>
                    <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Complete</span></td>
                    <td className="p-3"><Button variant="outline" size="sm">View</Button></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Team Utilization Analysis</td>
                    <td className="p-3 text-sm text-gray-500">May 15, 2024</td>
                    <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Complete</span></td>
                    <td className="p-3"><Button variant="outline" size="sm">View</Button></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Resource Allocation Report</td>
                    <td className="p-3 text-sm text-gray-500">April 28, 2024</td>
                    <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Complete</span></td>
                    <td className="p-3"><Button variant="outline" size="sm">View</Button></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3">Q3 Financial Projection</td>
                    <td className="p-3 text-sm text-gray-500">In progress</td>
                    <td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">In Progress</span></td>
                    <td className="p-3"><Button variant="outline" size="sm" disabled>View</Button></td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}