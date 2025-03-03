// src/pages/Tasks.jsx
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      status: "To Do",
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
      status: "To Do",
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
      status: "To Do",
      assignee: { name: "Jane Smith", avatar: "https://github.com/shadcn.png" }
    }
  ]);

  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === "Done" ? "In Progress" : "Done" } : task
    ));
  };

  // Filter tasks based on status and search query
  const filterTasks = (status) => {
    let filtered = tasks;
    
    // Filter by status
    if (status === "active") {
      filtered = filtered.filter(task => task.status !== "Done");
    } else if (status === "completed") {
      filtered = filtered.filter(task => task.status === "Done");
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.project.toLowerCase().includes(query)
      );
    }
    
    return filtered;
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Tasks" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Tasks</h1>
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
              
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="h-4 w-4 mr-2" /> New Task
              </Button>
            </div>
          </div>
          
          {/* Tasks Interface */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <TaskList tasks={filterTasks("all")} toggleCompletion={toggleTaskCompletion} priorityColors={getPriorityColor} />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <TaskList tasks={filterTasks("active")} toggleCompletion={toggleTaskCompletion} priorityColors={getPriorityColor} />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <TaskList tasks={filterTasks("completed")} toggleCompletion={toggleTaskCompletion} priorityColors={getPriorityColor} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Task List Component
function TaskList({ tasks, toggleCompletion, priorityColors }) {
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
          <table className="w-full border-collapse">
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
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(task.dueDate).toLocaleDateString()}
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
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                      ${task.status === "Done" ? "bg-green-100 text-green-800" : 
                        task.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                        "bg-gray-100 text-gray-800"}`}>
                      {task.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}