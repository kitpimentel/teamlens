import { useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

/**
 * Task status type definition
 */
type TaskStatus = "To Do" | "In Progress" | "In Review" | "Done"

/**
 * Task priority type definition
 */
type TaskPriority = "Low" | "Medium" | "High" | "Critical"

/**
 * Task interface for team member tasks
 */
interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project: string
  projectId: string
  dueDate: string
  assignedBy: string
  assignedById: string
  assignedDate: string
  tags: string[]
  completedPercent: number
}

/**
 * Props for KanbanBoard component
 */
interface KanbanBoardProps {
  tasks: Task[]
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void
}

/**
 * Get CSS class for task priority
 */
const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case "Low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

/**
 * KanbanColumn component to render a column in the Kanban board
 */
interface KanbanColumnProps {
  title: string
  tasks: Task[]
  bgColor: string
  onDrop: (taskId: string) => void
  onDragStart: (taskId: string) => void
}

/**
 * KanbanColumn component that represents a column in the kanban board
 */
const KanbanColumn = ({ title, tasks, bgColor, onDrop, onDragStart }: KanbanColumnProps) => {
  // Handle drag over event to enable dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    onDrop(taskId)
  }

  return (
    <div
      className="flex flex-col min-h-[500px] w-full bg-background border rounded-lg shadow-sm"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`p-4 ${bgColor} rounded-t-lg border-b`}>
        <h3 className="font-medium">{title}</h3>
        <div className="mt-1 text-sm">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </div>
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("taskId", task.id)
              onDragStart(task.id)
            }}
            className="p-3 bg-card border rounded-md cursor-move hover:shadow-md transition-shadow duration-200"
          >
            <Link
              to={`/team/tasks/${task.id}`}
              className="block font-medium hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              {task.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
            <div className="flex flex-wrap mt-2 gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{task.tags.length - 2} more
                </Badge>
              )}
            </div>
            <div className="flex justify-between mt-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <Badge className={getPriorityBadgeClass(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * KanbanBoard component that displays tasks in a kanban board format
 */
const KanbanBoard = ({ tasks, onTaskStatusChange }: KanbanBoardProps) => {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "To Do")
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress")
  const inReviewTasks = tasks.filter((task) => task.status === "In Review")
  const doneTasks = tasks.filter((task) => task.status === "Done")

  // Handle dropping a task in a column
  const handleDrop = (status: TaskStatus, taskId: string) => {
    if (draggingTaskId) {
      onTaskStatusChange(taskId, status)
    }
  }

  // Set the current dragging task
  const handleDragStart = (taskId: string) => {
    setDraggingTaskId(taskId)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KanbanColumn
            title="To Do"
            tasks={todoTasks}
            bgColor="bg-gray-100 dark:bg-gray-800"
            onDrop={(taskId) => handleDrop("To Do", taskId)}
            onDragStart={handleDragStart}
          />
          <KanbanColumn
            title="In Progress"
            tasks={inProgressTasks}
            bgColor="bg-blue-100 dark:bg-blue-950"
            onDrop={(taskId) => handleDrop("In Progress", taskId)}
            onDragStart={handleDragStart}
          />
          <KanbanColumn
            title="In Review"
            tasks={inReviewTasks}
            bgColor="bg-purple-100 dark:bg-purple-950"
            onDrop={(taskId) => handleDrop("In Review", taskId)}
            onDragStart={handleDragStart}
          />
          <KanbanColumn
            title="Done"
            tasks={doneTasks}
            bgColor="bg-green-100 dark:bg-green-950"
            onDrop={(taskId) => handleDrop("Done", taskId)}
            onDragStart={handleDragStart}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default KanbanBoard