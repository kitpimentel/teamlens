import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Import the custom Input component instead of the default one
import { Input } from "@/components/ui/custom-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { PlusCircle, Search, MoreVertical, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

/**
 * Task status type definition
 */
type TaskStatus = "To Do" | "In Progress" | "In Review" | "Done";

/**
 * Task priority type definition
 */
type TaskPriority = "Low" | "Medium" | "High" | "Critical";

/**
 * Task interface for team member tasks
 */
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  projectId: string;
  dueDate: string;
  assignedBy: string;
  assignedById: string;
  assignedDate: string;
  tags: string[];
  completedPercent: number;
}

/**
 * Mock data for tasks
 */
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement user authentication flow",
    description: "Create login, signup, and password reset screens according to design specs",
    status: "In Progress",
    priority: "High",
    project: "E-commerce App",
    projectId: "proj-1",
    dueDate: "2025-04-10",
    assignedBy: "John Smith",
    assignedById: "user-123",
    assignedDate: "2025-03-20",
    tags: ["frontend", "authentication"],
    completedPercent: 60,
  },
  {
    id: "task-2",
    title: "Design database schema",
    description: "Create entity relationship diagrams and define table structures",
    status: "Done",
    priority: "High",
    project: "E-commerce App",
    projectId: "proj-1",
    dueDate: "2025-03-28",
    assignedBy: "John Smith",
    assignedById: "user-123",
    assignedDate: "2025-03-15",
    tags: ["database", "architecture"],
    completedPercent: 100,
  },
  {
    id: "task-3",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment workflows",
    status: "To Do",
    priority: "Medium",
    project: "CRM System",
    projectId: "proj-2",
    dueDate: "2025-04-15",
    assignedBy: "Sarah Johnson",
    assignedById: "user-456",
    assignedDate: "2025-03-25",
    tags: ["devops", "automation"],
    completedPercent: 0,
  },
  {
    id: "task-4",
    title: "Create product listing page",
    description: "Implement responsive grid layout with filters and sorting options",
    status: "In Review",
    priority: "Medium",
    project: "E-commerce App",
    projectId: "proj-1",
    dueDate: "2025-04-05",
    assignedBy: "John Smith",
    assignedById: "user-123",
    assignedDate: "2025-03-22",
    tags: ["frontend", "ui"],
    completedPercent: 90,
  },
  {
    id: "task-5",
    title: "Optimize API response times",
    description: "Identify and resolve performance bottlenecks in backend services",
    status: "To Do",
    priority: "Critical",
    project: "CRM System",
    projectId: "proj-2",
    dueDate: "2025-04-12",
    assignedBy: "Sarah Johnson",
    assignedById: "user-456",
    assignedDate: "2025-03-26",
    tags: ["backend", "performance"],
    completedPercent: 0,
  },
];

/**
 * Get CSS class for task priority
 */
const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case "Low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

/**
 * Get CSS class for task status
 */
const getStatusBadgeClass = (status: TaskStatus): string => {
  switch (status) {
    case "To Do":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "In Review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

/**
 * MyTasks component displays all tasks assigned to the team member
 */
const MyTasks = () => {
  const { } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<"list" | "kanban" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/tasks/assigned');
        // const data = await response.json();
        
        setTasks(mockTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Apply filters whenever the filter criteria or tasks change
  useEffect(() => {
    let result = [...tasks];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.project.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Apply project filter
    if (projectFilter !== "all") {
      result = result.filter((task) => task.projectId === projectFilter);
    }

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, priorityFilter, projectFilter, tasks]);

  // Get unique projects for filter dropdown
  const projects = [...new Set(tasks.map((task) => task.project))].map((projectName) => {
    const task = tasks.find((t) => t.project === projectName);
    return { id: task?.projectId || "", name: projectName };
  });

  // Get tasks for selected date in calendar view
  const getTasksForSelectedDate = () => {
    const dateString = selectedDate.toISOString().split("T")[0];
    return filteredTasks.filter((task) => task.dueDate === dateString);
  };

  // Update task status (mock implementation)
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast.success(`Task status updated to ${newStatus}`);
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <PageHeader
        title="My Tasks"
        description={`Manage and track all your assigned tasks across projects.`}
        actions={
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        }
      />

      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Search and filters */}
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="flex items-center w-full max-w-sm space-x-2">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              prefixIcon={<Search className="w-4 h-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View toggle */}
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban" | "calendar")} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            <span className="text-sm text-muted-foreground">Loading tasks...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTasks.length === 0 && (
        <EmptyState
          title="No tasks found"
          description={
            tasks.length === 0
              ? "You don't have any tasks assigned to you yet."
              : "No tasks match your current filter criteria."
          }
          icon={<CheckCircle2 className="w-10 h-10 text-muted-foreground" />}
          action={
            tasks.length === 0 ? (
              <Button>Request a Task</Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setProjectFilter("all");
              }}>
                Clear Filters
              </Button>
            )
          }
        />
      )}

      {/* List view */}
      {!loading && filteredTasks.length > 0 && view === "list" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Task</TableHead>
                  <TableHead className="w-[15%]">Project</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Priority</TableHead>
                  <TableHead className="w-[15%]">Due Date</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Link to={`/team/tasks/${task.id}`} className="font-medium hover:underline">
                        {task.title}
                      </Link>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </div>
                      <div className="flex flex-wrap mt-1 gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/team/projects/${task.projectId}`} className="hover:underline">
                        {task.project}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeClass(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link to={`/team/tasks/${task.id}`} className="w-full">
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateTaskStatus(task.id, "In Progress")}
                            disabled={task.status === "In Progress"}
                          >
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateTaskStatus(task.id, "Done")}
                            disabled={task.status === "Done"}
                          >
                            Mark as Done
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Kanban view */}
      {!loading && filteredTasks.length > 0 && view === "kanban" && (
        <KanbanBoard tasks={filteredTasks} onTaskStatusChange={updateTaskStatus} />
      )}

      {/* Calendar view */}
      {!loading && view === "calendar" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getTasksForSelectedDate().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mb-2 opacity-20" />
                  <h3 className="text-lg font-medium">No tasks due</h3>
                  <p className="text-sm">There are no tasks due on this date.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getTasksForSelectedDate().map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-medium">
                          <Link to={`/team/tasks/${task.id}`} className="hover:underline">
                            {task.title}
                          </Link>
                        </h3>
                        <Badge className={getStatusBadgeClass(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex flex-wrap justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge className={getPriorityBadgeClass(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyTasks;