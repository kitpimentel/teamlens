// src/pages/TeamCapacity.jsx
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Filter, ChevronDown } from "lucide-react";

export default function TeamCapacity() {
  // Sample team members data
  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      role: "Frontend Developer", 
      availability: 85, 
      avatar: "https://github.com/shadcn.png", 
      projects: ["Project Alpha", "Project Beta"],
      tasks: { active: 4, completed: 12 }
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      role: "UX Designer", 
      availability: 60, 
      avatar: "https://github.com/shadcn.png", 
      projects: ["Project Alpha", "Project Gamma"],
      tasks: { active: 2, completed: 8 } 
    },
    { 
      id: 3, 
      name: "Robert Johnson", 
      role: "Backend Developer", 
      availability: 40, 
      avatar: "https://github.com/shadcn.png", 
      projects: ["Project Alpha"],
      tasks: { active: 5, completed: 10 } 
    },
    { 
      id: 4, 
      name: "Emily Chen", 
      role: "Project Manager", 
      availability: 75, 
      avatar: "https://github.com/shadcn.png", 
      projects: ["Project Alpha", "Project Beta", "Project Delta"],
      tasks: { active: 3, completed: 15 } 
    },
    { 
      id: 5, 
      name: "Michael Brown", 
      role: "DevOps Engineer", 
      availability: 90, 
      avatar: "https://github.com/shadcn.png", 
      projects: ["Project Beta"],
      tasks: { active: 2, completed: 7 } 
    }
  ]);

  // Sample team capacity metrics
  const capacityMetrics = {
    overall: 70,
    frontend: 65,
    backend: 75,
    design: 60,
    management: 80
  };

  // Function to determine color based on availability
  const getAvailabilityColor = (availability) => {
    if (availability >= 70) return "bg-green-500";
    if (availability >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Team Capacity" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Team Capacity</h1>
              <p className="text-gray-500">Monitor team workload and resource allocation</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>Q2 2024</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Overall Team Capacity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Overall Team Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#e6e6e6"
                        strokeWidth="10"
                      />
                      {/* Progress arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray={`${capacityMetrics.overall * 2.51} ${251 - capacityMetrics.overall * 2.51}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{capacityMetrics.overall}%</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-center">Current team utilization</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Capacity by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Frontend</span>
                      <span className="text-sm">{capacityMetrics.frontend}%</span>
                    </div>
                    <Progress value={capacityMetrics.frontend} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Backend</span>
                      <span className="text-sm">{capacityMetrics.backend}%</span>
                    </div>
                    <Progress value={capacityMetrics.backend} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Design</span>
                      <span className="text-sm">{capacityMetrics.design}%</span>
                    </div>
                    <Progress value={capacityMetrics.design} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Management</span>
                      <span className="text-sm">{capacityMetrics.management}%</span>
                    </div>
                    <Progress value={capacityMetrics.management} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Capacity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Available</span>
                    <span className="text-sm font-bold">3 team members</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                    <span className="text-sm font-medium">Partially Available</span>
                    <span className="text-sm font-bold">1 team member</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">At Capacity</span>
                    <span className="text-sm font-bold">1 team member</span>
                  </div>
                  
                  <Button className="w-full mt-4 bg-teal-500 hover:bg-teal-600">
                    Optimize Allocation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Team Member</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Role</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Availability</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Projects</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Active Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map(member => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">{member.role}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getAvailabilityColor(member.availability)}`} 
                                style={{ width: `${member.availability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{member.availability}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {member.projects.map((project, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                {project}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium">{member.tasks.active}</span>
                          <span className="text-gray-500 text-sm"> / {member.tasks.active + member.tasks.completed}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}