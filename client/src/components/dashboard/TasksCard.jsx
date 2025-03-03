import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function TasksCard({ 
  tasks = [],
  title = "Tasks Due Today",
  onAddTask = () => {},
  onTaskChange = () => {},
  emptyMessage = "No tasks due today"
}) {
  if (!tasks.length) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2 flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-teal-500 hover:bg-teal-600 h-6 text-xs"
            onClick={onAddTask}
          >
            + Task
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2 flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-teal-500 hover:bg-teal-600 h-6 text-xs"
          onClick={onAddTask}
        >
          + Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center">
              {task.isCheckbox ? (
                <Checkbox 
                  id={`task-${task.id}`} 
                  className="mr-2"
                  checked={task.completed}
                  onCheckedChange={(checked) => onTaskChange(task.id, checked)}
                />
              ) : (
                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                </div>
              )}
              <label htmlFor={`task-${task.id}`} className="text-sm">
                {task.title}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}