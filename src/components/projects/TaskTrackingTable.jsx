// src/components/projects/TaskTrackingTable.jsx
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function TaskTrackingTable({ tasks = [] }) {
  // Debug the incoming tasks data
  console.log('Raw tasks data:', tasks);
  
  const [taskStatuses, setTaskStatuses] = useState({});
  const statusOptions = ["Up Next", "In Progress", "Completed"];
  
  // Use hardcoded tasks if none are provided or if the array is empty
  const tasksToDisplay = tasks && tasks.length > 0 ? tasks : [
    {
      id: 1,
      title: "Create Dashboard page",
      priority: "High",
      date: "Oct 09, 2020",
      progress: 75,
      status: "In Progress",
      assignee: { image: "/avatars/john.jpg", initials: "JD" }
    },
    {
      id: 2,
      title: "Update website copy",
      priority: "High",
      date: "Oct 09, 2020",
      progress: 50,
      status: "In Progress",
      assignee: { image: "/avatars/jane.jpg", initials: "JS" }
    },
    {
      id: 3,
      title: "Create Landing page",
      priority: "High",
      date: "Oct 09, 2020",
      progress: 23,
      status: "In Progress",
      assignee: { image: "/avatars/mike.jpg", initials: "MJ" }
    },
    {
      id: 4,
      title: "Create new task component",
      priority: "Low",
      date: "Oct 09, 2020",
      progress: 25,
      status: "In Progress",
      assignee: { image: "/avatars/sarah.jpg", initials: "SW" }
    },
    {
      id: 5,
      title: "Add edit/delete task function",
      priority: "Medium",
      date: "Oct 09, 2020",
      progress: 100,
      status: "In Progress",
      assignee: { image: "/avatars/lisa.jpg", initials: "LB" }
    },
    {
      id: 6,
      title: "Create Projects page",
      priority: "Medium",
      date: "Oct 09, 2020",
      progress: 75,
      status: "In Progress",
      assignee: { image: "/avatars/david.jpg", initials: "DW" }
    }
  ];
  
  // Helper function to get the task title/name regardless of property name
  const getTaskName = (task) => {
    // Try all possible property names and return the first one that exists
    if (task.title) return task.title;
    if (task.task) return task.task;
    if (task.name) return task.name;
    if (task.description) return task.description;
    return "Untitled Task";
  };
  
  // Update status for a specific task
  const handleStatusChange = (taskId, event) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: event.target.value
    }));
  };
  
  // Get appropriate color for progress bar
  const getProgressColor = (percentage) => {
    if (percentage === 100) return "bg-teal-500";
    if (percentage >= 70) return "bg-teal-500";
    if (percentage >= 40) return "bg-blue-500";
    return "bg-orange-400";
  };

  // Get color for priority badge
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-600";
      case "medium": return "bg-amber-100 text-amber-600";
      case "low": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Desktop view */}
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasksToDisplay.map((task) => {
            // Log each task to help debugging
            console.log('Processing task:', task, 'Name:', getTaskName(task));
            
            return (
              <tr key={task.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getTaskName(task)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={(task.assignee && task.assignee.image) || "/avatars/placeholder.jpg"} 
                      alt={(task.assignee && task.assignee.initials) || "??"}
                    />
                    <AvatarFallback>
                      {(task.assignee && task.assignee.initials) || "??"}
                    </AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)} px-2.5 py-0.5 text-xs font-medium border-0`}>
                    {task.priority || "Unset"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                    {task.date || task.dueDate || "No date set"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    className="border border-gray-300 rounded-md shadow-sm py-1 px-3 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={taskStatuses[task.id] || task.status || "In Progress"}
                    onChange={(e) => handleStatusChange(task.id, e)}
                    style={{ width: '130px' }}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="w-28 bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className={`${getProgressColor(task.progress || 0)} h-2.5 rounded-full`} 
                        style={{ width: `${task.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {task.progress || 0}%
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}