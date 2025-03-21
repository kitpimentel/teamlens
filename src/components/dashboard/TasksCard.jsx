import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Component doesn't rely on external state management for demo purposes
export default function TasksCard({
  title = "Tasks Due Today",
  onAddTask = () => console.log("Add task clicked"),
  emptyMessage = "No tasks due today"
}) {
  // Hard-coded tasks with different priorities
  const tasks = [
    {
      id: 1,
      title: "Complete project proposal",
      completed: false,
      priority: "Urgent"
    },
    {
      id: 2,
      title: "Review client feedback",
      completed: false,
      priority: "High"
    },
    {
      id: 3,
      title: "Prepare team meeting agenda",
      completed: true,
      priority: "Medium"
    },
    {
      id: 4,
      title: "Update documentation",
      completed: false,
      priority: "Low"
    },
    {
      id: 5,
      title: "Fix navigation bug",
      completed: false,
      priority: "High"
    },
    {
      id: 6,
      title: "Weekly progress report",
      completed: false,
      priority: "Medium"
    }
  ];

  // Local state for task completion (will reset on component remount)
  const [completedTasks, setCompletedTasks] = React.useState(
    tasks.reduce((acc, task) => {
      acc[task.id] = task.completed;
      return acc;
    }, {})
  );

  // Function to get priority badge styles
  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200"; // Default to medium
    }
  };

  // Handle task completion toggle
  const handleTaskToggle = (id, checked) => {
    setCompletedTasks(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <Button
          variant="default"
          size="sm"
          className="bg-teal-500 hover:bg-teal-600 h-7 text-xs"
          onClick={onAddTask}
        >
          + Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div className="flex items-center flex-1">
                <Checkbox
                  id={`task-${task.id}`}
                  className="mr-2"
                  checked={completedTasks[task.id]}
                  onCheckedChange={(checked) => handleTaskToggle(task.id, checked)}
                />
                <label 
                  htmlFor={`task-${task.id}`} 
                  className={`text-sm ${completedTasks[task.id] ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </label>
              </div>
              
              <Badge 
                variant="outline" 
                className={`ml-2 text-xs ${getPriorityStyles(task.priority)}`}
              >
                {task.priority || "Medium"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}