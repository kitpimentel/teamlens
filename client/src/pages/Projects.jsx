// src/pages/Projects.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Plus, FolderOpen } from "lucide-react";

export default function Projects() {
  // Sample projects data
  const [projects, setProjects] = useState([
    { id: "alpha", name: "Project Alpha", description: "Marketing website redesign", progress: 72, tasksCompleted: 13, totalTasks: 18 },
    { id: "beta", name: "Project Beta", description: "Mobile app development", progress: 45, tasksCompleted: 9, totalTasks: 20 },
    { id: "gamma", name: "Project Gamma", description: "CRM integration", progress: 90, tasksCompleted: 18, totalTasks: 20 },
    { id: "delta", name: "Project Delta", description: "Data migration", progress: 30, tasksCompleted: 6, totalTasks: 20 },
    { id: "epsilon", name: "Project Epsilon", description: "E-commerce platform", progress: 10, tasksCompleted: 2, totalTasks: 20 },
    { id: "zeta", name: "Project Zeta", description: "Internal dashboard", progress: 60, tasksCompleted: 12, totalTasks: 20 }
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Projects" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Projects</h1>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus size={16} className="mr-2" /> New Project
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Link key={project.id} to={`/project/${project.id}`} className="block group">
                <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md border-gray-200 hover:border-teal-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-teal-600 transition-colors">{project.name}</h3>
                        <p className="text-gray-500 text-sm">{project.description}</p>
                      </div>
                      <div className="bg-gray-100 group-hover:bg-teal-50 p-2 rounded-full text-gray-500 group-hover:text-teal-500 transition-colors">
                        <FolderOpen size={20} />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span>{project.tasksCompleted} of {project.totalTasks} tasks completed</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}