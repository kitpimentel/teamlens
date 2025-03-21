// src/pages/ProjectOverview.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ProjectHeader from "@/components/projects/ProjectHeader";
import TaskStatusCard from "@/components/projects/TaskStatusCard";
import CompletionCard from "@/components/projects/CompletionCard";
import TaskTrackingTable from "@/components/projects/TaskTrackingTable";
import { ChevronDown, Filter, Download } from "lucide-react";

// Sample project data - updated to match image
const projectData = {
  tasks: {
    sprint: { count: 5, trend: -25 },
    progress: { count: 2, trend: -25 },
    qa: { count: 2, trend: 25 },
    done: { count: 6, trend: 25 }
  },
  completion: {
    percentage: 72,
    completed: 13,
    total: 15
  },
  velocity: {
    percentage: 82,
    completed: 13,
    total: 15
  }
};

// Import taskData from your existing data file
import { taskData } from "@/data/projectData";

export default function ProjectOverview() {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("Due date");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentProject, setCurrentProject] = useState("Project Alpha");

  // Map project names to URL-friendly IDs
  const projectToIdMap = {
    "Project Alpha": "alpha",
    "Project Beta": "beta",
    "Project Gamma": "gamma",
    "Project Delta": "delta",
    "Project Epsilon": "epsilon"
  };

  // Set initial project based on URL param if available
  useEffect(() => {
    if (id) {
      const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
      const projectName = `Project ${capitalizedId}`;
      if (Object.keys(projectToIdMap).includes(projectName)) {
        setCurrentProject(projectName);
      }
    }
  }, [id]);

  // Handle sorting change
  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    setShowSortDropdown(false);
  };
  
  // Handle project change from dropdown
  const handleProjectChange = (project) => {
    setCurrentProject(project);
    const projectId = projectToIdMap[project];
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Projects" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          username="Sergey Goldberg" 
          currentPage={`${currentProject} Overview`} 
          onNewProject={() => alert("Create new project")} 
          onNotifications={() => alert("View notifications")} 
          onSettings={() => alert("Open settings")} 
        />
        
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 lg:px-12">
          {/* Project header with dropdown */}
          <div className="mb-8">
            <ProjectHeader 
              initialProject={currentProject} 
              onProjectChange={handleProjectChange} 
            />
          </div>
          
          {/* Project overview section */}
          <div className="mb-10">
            {/* Section header with actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Project Overview</h2>
              <div className="flex space-x-3">
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 shadow-sm transition-colors flex items-center">
                  <Filter className="w-4 h-4 mr-2" /> This Week
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 shadow-sm transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" /> Export
                </button>
              </div>
            </div>
            
            {/* Main dashboard grid - FIXED LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Task Status Cards */}
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
            </div>
            
            {/* Completion Cards in a separate row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <CompletionCard 
                title="Completion Rate"
                percentage={projectData.completion.percentage}
                subtitle={`${projectData.completion.completed} / ${projectData.completion.total} tasks`}
                color="teal"
                showViewReport={true}
              />
              
              <CompletionCard 
                title="Team Velocity"
                percentage={projectData.velocity.percentage}
                subtitle={`${projectData.velocity.completed} / ${projectData.velocity.total} story points`}
                color="cyan"
                showViewReport={true}
              />
            </div>
          </div>
          
          {/* Task tracking section with improved styling */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Project Task Summary</h2>
              
              {/* Sort dropdown with improved styling */}
              <div className="relative">
                <button 
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2 border border-gray-200 text-sm text-gray-700 font-medium transition-colors w-full sm:w-auto"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  Sort by: {sortOrder} <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden">
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === 'Due date' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => handleSortChange('Due date')}
                      >
                        Due date
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === 'Priority' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => handleSortChange('Priority')}
                      >
                        Priority
                      </button>

                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Task table with container */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <TaskTrackingTable tasks={taskData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}