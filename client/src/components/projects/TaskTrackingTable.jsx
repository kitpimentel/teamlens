// src/components/projects/TaskTrackingTable.jsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function TaskTrackingTable({ tasks = [] }) {
  // Get appropriate color for progress bar
  const getProgressColor = (percentage) => {
    if (percentage >= 70) return "bg-teal-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-orange-400";
  };

  // Get color for priority badge
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)} px-2.5 py-0.5 text-xs font-medium`}>
                    {task.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {task.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-32">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          className={`${getProgressColor(task.progress)} rounded h-full`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs mt-1 text-gray-500">
                        {task.progress}%
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.image} alt={task.assignee.initials} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                  </Avatar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}