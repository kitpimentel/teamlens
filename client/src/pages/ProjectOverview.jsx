// src/pages/ProjectOverview.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ProjectHeader from "@/components/projects/ProjectHeader";
import TaskStatusCard from "@/components/projects/TaskStatusCard";
import CompletionCard from "@/components/projects/CompletionCard";
import TaskTrackingTable from "@/components/projects/TaskTrackingTable";
import TaskTrackingFilter from "@/components/projects/TaskTrackingFilter";
import { Filter } from "lucide-react";

// Sample project data
import { projectData, taskData } from "@/data/projectData";

export default function ProjectOverview() {
  const { id } = useParams(); // Get project ID from URL
  const [activeFilter, setActiveFilter] = useState("in-progress");
  const [sortOrder, setSortOrder] = useState("Due date");

  // Project title - in real app, fetch based on ID
  const projectTitle = id ? `Project ${id.charAt(0).toUpperCase() + id.slice(1)}` : "Project Alpha";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Projects" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Project header with dropdown */}
          <ProjectHeader projectTitle={projectTitle} />
          
          {/* Project overview section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl font-bold mb-4">{projectTitle} Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Task status cards */}
              <TaskStatusCard 
                title="Ready for Sprint"
                count={projectData.tasks.sprint.count}
                trend={projectData.tasks.sprint.trend}
                icon="clock"
                color="teal"
              />
              
              <TaskStatusCard 
                title="In Progress"
                count={projectData.tasks.progress.count}
                trend={projectData.tasks.progress.trend}
                icon="pen"
                color="blue"
              />
              
              <TaskStatusCard 
                title="Ready for QA"
                count={projectData.tasks.qa.count}
                trend={projectData.tasks.qa.trend}
                icon="check-circle"
                color="purple"
              />
              
              <TaskStatusCard 
                title="Done"
                count={projectData.tasks.done.count}
                trend={projectData.tasks.done.trend}
                icon="check"
                color="cyan"
              />
              
              {/* Metrics cards - completion and KPI */}
              <CompletionCard 
                title="Completion Rate"
                percentage={projectData.completion.percentage}
                subtitle={`${projectData.completion.completed} / ${projectData.completion.total} tasks`}
                color="teal"
              />
              
              <CompletionCard 
                title="Individual KPI"
                percentage={projectData.kpi.percentage}
                subtitle={`${projectData.kpi.current} / ${projectData.kpi.target}`}
                color="cyan"
              />
            </div>
          </div>
          
          {/* Task tracking section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Project Task Tracking</h2>
              
              <button 
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                aria-label="Filter tasks"
              >
                <Filter className="h-4 w-4 mr-1" /> Filter
              </button>
            </div>
            
            <TaskTrackingFilter 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
            
            <TaskTrackingTable tasks={taskData} />
          </div>
        </div>
      </div>
    </div>
  );
}