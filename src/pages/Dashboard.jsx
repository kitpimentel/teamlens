// src/pages/Dashboard.jsx
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

// Dashboard components
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ProjectCard from "@/components/dashboard/ProjectCard";
import MeetingsCard from "@/components/dashboard/MeetingsCard";
import TasksCard from "@/components/dashboard/TasksCard";
import InsightsCard from "@/components/dashboard/InsightsCard";

// Sample data
import { 
  sampleProjects, 
  sampleMeetings, 
  sampleTasks, 
  sampleInsights 
} from "@/data/sampleData";

export default function Dashboard() {
  const location = useLocation();

  // In a real application, you would fetch this data from an API
  const [projects, setProjects] = useState(sampleProjects);
  const [meetings, setMeetings] = useState(sampleMeetings);
  const [tasks, setTasks] = useState(sampleTasks);
  const [insights, setInsights] = useState(sampleInsights);
  const [username, setUsername] = useState("Sergey Goldberg");

  // Event handlers
  const handleNewProject = useCallback(() => {
    toast.info("New project feature coming soon");
  }, []);

  const handleJoinMeeting = useCallback((meeting) => {
    toast.info(`Joining meeting: ${meeting.title}`);
  }, []);

  const handleAddTask = useCallback(() => {
    toast.info("Add task feature coming soon");
  }, []);

  const handleTaskChange = useCallback((taskId, checked) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: checked } : task
      )
    );
    toast.success(`Task ${checked ? 'completed' : 'reopened'}`);
  }, []);

  const handleAcknowledgeInsight = useCallback((insight) => {
    setInsights(prev => prev.filter(item => item.id !== insight.id));
    toast.success("Insight acknowledged");
  }, []);

  const handleProjectOptions = useCallback((project) => {
    toast.info(`Options for: ${project.name}`);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Dashboard" />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            username={username}
            welcomeMessage="Welcome back"
            currentPage="Dashboard"
            onNewProject={handleNewProject}
            onNotifications={() => toast.info("Notifications coming soon")}
            onSettings={() => toast.info("Settings coming soon")}
          />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Projects section */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg font-medium mb-3 md:mb-4">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onOptionsClick={handleProjectOptions}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Section: Meetings, Tasks, Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <MeetingsCard 
                meetings={meetings}
                onJoinMeeting={handleJoinMeeting}
              />
              <TasksCard 
                tasks={tasks}
                onAddTask={handleAddTask}
                onTaskChange={handleTaskChange}
              />
              <InsightsCard 
                insights={insights}
                onAcknowledge={handleAcknowledgeInsight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}