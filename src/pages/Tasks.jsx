// src/pages/Tasks.jsx
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Calendar, Search, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import NewTaskModal from "@/components/tasks/NewTaskModal";

export default function Tasks() {
  // Sample tasks data
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Update homepage design", 
      project: "Project Alpha", 
      priority: "High", 
      dueDate: "2024-04-15", 
      status: "In Progress",
      assignee: { name: "John Doe", avatar: "https://github.com/shadcn.png" }
    },
    { 
      id: 2, 
      title: "Implement user authentication", 
      project: "Project Beta", 
      priority: "High", 
      dueDate: "2024-04-20", 
      status: "Up Next",
      assignee: { name: "Robert Johnson", avatar: "https://github.com/shadcn.png" }
    },
    { 
      id: 3, 
      title: "Create wireframes for new features", 
      project: "Project Alpha", 
      priority: "Medium", 
      dueDate: "2024-04-18", 
      status: "In Progress",
      assignee: { name: "Jane Smith", avatar: "https://github.com/shadcn.png" }
    },
    { 
      id: 4, 
      title: "Database schema optimization", 
      project: "Project Gamma", 
      priority: "Low", 
      dueDate: "2024-04-30", 
      status: "Up Next",
      assignee: { name: "Robert Johnson", avatar: "https://github.com/shadcn.png" }
    },
    { 
      id: 5, 
      title: "Code review for pull request #42", 
      project: "Project Alpha", 
      priority: "Medium", 
      dueDate: "2024-04-12", 
      status: "Done",
      assignee: { name: "Emily Chen", avatar: "https://github.com/shadcn.png" }
    },
    { 
      id: 6, 
      title: "Deploy new version to staging", 
      project: "Project Beta", 
      priority: "High", 
      dueDate: "2024-04-14", 
      status: "Done",
      assignee: { name: "Michael Brown", avatar: "https://github.com/shadcn.png" }
    },
    { 
      id: 7, 
      title: "Fix layout issues on mobile", 
      project: "Project Alpha", 
      priority: "Medium", 
      dueDate: "2024-04-16", 
      status: "Up Next",
      assignee: { name: "Jane Smith", avatar: "https://github.com/shadcn.png" }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Handle creating a new task
  const handleCreateTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === "Done" ? "In Progress" : "Done" } : task
    ));
  };

  // Get unique projects for filter
  const uniqueProjects = [...new Set(tasks.map(task => task.project))];
  
  // Get unique priorities for filter
  const uniquePriorities = [...new Set(tasks.map(task => task.priority))];
  
  // Get unique assignees for the new task modal
  const uniqueAssignees = tasks.reduce((acc, task) => {
    if (!acc.some(a => a.name === task.assignee.name)) {
      acc.push(task.assignee);
    }
    return acc;
  }, []);

  // Filter tasks based on status, search query, and additional filters
  const filterTasks = (status) => {
    let filtered = tasks;
    
    // Filter by status
    if (status === "all") {
      // All tasks
    } else if (status === "up-next") {
      filtered = filtered.filter(task => task.status === "Up Next");
    } else if (status === "in-progress") {
      filtered = filtered.filter(task => task.status === "In Progress");
    } else if (status === "done") {
      filtered = filtered.filter(task => task.status === "Done");
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.project.toLowerCase().includes(query) ||
        task.assignee.name.toLowerCase().includes(query)
      );
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filter by project
    if (projectFilter) {
      filtered = filtered.filter(task => task.project === projectFilter);
    }
    
    return filtered;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("");
    setProjectFilter("");
    setShowFilters(false);
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Up Next": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Tasks" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" currentPage="Tasks" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <p className="text-gray-500">Manage and track your tasks across projects</p>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-9 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              
              <Button 
                className="bg-teal-500 hover:bg-teal-600"
                onClick={() => setIsNewTaskModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> New Task
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <select 
                      className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                    >
                      <option value="">All Projects</option>
                      {uniqueProjects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select 
                      className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="">All Priorities</option>
                      {uniquePriorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="text-gray-600"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Tasks Interface */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="up-next">Up Next</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <TaskList 
                tasks={filterTasks("all")} 
                toggleCompletion={toggleTaskCompletion} 
                priorityColors={getPriorityColor}
                statusColors={getStatusColor}
              />
            </TabsContent>
            
            <TabsContent value="up-next" className="space-y-4">
              <TaskList 
                tasks={filterTasks("up-next")} 
                toggleCompletion={toggleTaskCompletion} 
                priorityColors={getPriorityColor} 
                statusColors={getStatusColor}
              />
            </TabsContent>
            
            <TabsContent value="in-progress" className="space-y-4">
              <TaskList 
                tasks={filterTasks("in-progress")} 
                toggleCompletion={toggleTaskCompletion} 
                priorityColors={getPriorityColor}
                statusColors={getStatusColor}
              />
            </TabsContent>
            
            <TabsContent value="done" className="space-y-4">
              <TaskList 
                tasks={filterTasks("done")} 
                toggleCompletion={toggleTaskCompletion} 
                priorityColors={getPriorityColor}
                statusColors={getStatusColor}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* New Task Modal */}
      <NewTaskModal 
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
        projects={uniqueProjects}
        assignees={uniqueAssignees}
      />
    </div>
  );
}

// Task List Component
function TaskList({ tasks, toggleCompletion, priorityColors, statusColors }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or create a new task.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Desktop Table View */}
          <table className="w-full border-collapse hidden md:table">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-500 w-10"></th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Task</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Project</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Due Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Assignee</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className={`border-b hover:bg-gray-50 ${task.status === "Done" ? "bg-gray-50" : ""}`}>
                  <td className="p-4">
                    <Checkbox
                      checked={task.status === "Done"}
                      onCheckedChange={() => toggleCompletion(task.id)}
                    />
                  </td>
                  <td className="p-4 font-medium">
                    <span className={task.status === "Done" ? "line-through text-gray-500" : ""}>
                      {task.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      {task.project}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`${priorityColors(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-1 sm:gap-0">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="whitespace-nowrap">{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="sm:ml-2 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs flex items-center w-fit">
                          <Paperclip className="h-3 w-3 mr-1 flex-shrink-0" />
                          {task.attachments.length}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${statusColors(task.status)}`}>
                      {task.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {tasks.map(task => (
              <div key={task.id} className={`p-4 border rounded-lg ${task.status === "Done" ? "bg-gray-50" : "bg-white"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.status === "Done"}
                      onCheckedChange={() => toggleCompletion(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <h3 className={`font-medium ${task.status === "Done" ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-800 rounded px-2 py-1 inline-block mt-1">
                        {task.project}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors(task.status)}`}>
                    {task.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Priority</p>
                    <Badge variant="outline" className={`${priorityColors(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Due Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Assignee</p>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>
                  </div>
                  
                  {task.attachments && task.attachments.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Attachments</p>
                      <div className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs flex items-center w-fit">
                        <Paperclip className="h-3 w-3 mr-1" />
                        {task.attachments.length} {task.attachments.length === 1 ? 'file' : 'files'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}