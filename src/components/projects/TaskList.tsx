import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Task interface for consistent type checking
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
}

/**
 * TaskList component props interface
 */
export interface TaskListProps {
  tasks: Task[];
  searchTerm: string;
  onTaskClick: (taskId: string) => void;
}

/**
 * Get CSS class for task priority badge
 */
const getPriorityBadgeClass = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

/**
 * Get CSS class for task status badge
 */
const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case "todo":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "inprogress":
    case "in progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "in review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "completed":
    case "done":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "blocked":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

/**
 * Get initials from name for avatar fallback
 */
const getInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Formats status for display
 */
const formatStatus = (status: string): string => {
  if (status === 'inProgress') return 'In Progress';
  if (status === 'todo') return 'To Do';
  
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * TaskList component that displays filterable list of tasks
 */
const TaskList: React.FC<TaskListProps> = ({ tasks, searchTerm, onTaskClick }) => {
  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.assignee.name.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  // Check if there are no tasks to display
  if (filteredTasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No tasks found matching your search criteria.</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Task</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTasks.map((task) => (
          <TableRow 
            key={task.id} 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onTaskClick(task.id)}
          >
            <TableCell>
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {task.description}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">{getInitials(task.assignee.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignee.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={cn(getStatusBadgeClass(task.status))}>
                {formatStatus(task.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={cn(getPriorityBadgeClass(task.priority))}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskList;