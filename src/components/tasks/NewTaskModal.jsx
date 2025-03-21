// src/components/tasks/NewTaskModal.jsx
import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paperclip, X, File } from "lucide-react";

export default function NewTaskModal({ 
  isOpen, 
  onClose, 
  onCreateTask, 
  projects = [], 
  assignees = []
}) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    priority: "Medium",
    status: "Up Next",
    assignee: "",
    dueDate: "",
    attachments: []
  });
  
  const [errors, setErrors] = useState({});
  
  // Default projects and assignees if not provided
  const defaultProjects = projects.length ? projects : [
    "Project Alpha", 
    "Project Beta", 
    "Project Gamma", 
    "Project Delta"
  ];
  
  const defaultAssignees = assignees.length ? assignees : [
    { id: 1, name: "John Doe", avatar: "https://github.com/shadcn.png" },
    { id: 2, name: "Jane Smith", avatar: "https://github.com/shadcn.png" },
    { id: 3, name: "Robert Johnson", avatar: "https://github.com/shadcn.png" },
    { id: 4, name: "Emily Chen", avatar: "https://github.com/shadcn.png" },
    { id: 5, name: "Michael Brown", avatar: "https://github.com/shadcn.png" }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Convert files to objects with name and size properties
      const fileObjects = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        // In a real app, you might want to store the actual file or upload it to a server
        // For now, we'll just store the metadata
        lastModified: file.lastModified
      }));
      
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileObjects]
      }));
    }
  };
  
  // Handle file removal
  const handleRemoveFile = (index) => {
    setFormData(prev => {
      const newAttachments = [...prev.attachments];
      newAttachments.splice(index, 1);
      return {
        ...prev,
        attachments: newAttachments
      };
    });
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.project) {
      newErrors.project = "Project is required";
    }
    
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }
    
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    
    if (!formData.assignee) {
      newErrors.assignee = "Assignee is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.dueDate);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Find assignee details
      const assigneeObj = defaultAssignees.find(a => a.name === formData.assignee);
      
      // Create a new task object
      const newTask = {
        id: Date.now(), // Generate unique ID
        title: formData.title,
        description: formData.description || "",
        project: formData.project,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        assignee: assigneeObj || { name: formData.assignee, avatar: "https://github.com/shadcn.png" },
        attachments: formData.attachments
      };
      
      onCreateTask(newTask);
      
      // Reset form and close modal
      setFormData({
        title: "",
        description: "",
        project: "",
        priority: "Medium",
        status: "Up Next",
        assignee: "",
        dueDate: "",
        attachments: []
      });
      
      onClose();
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      project: "",
      priority: "Medium",
      status: "Up Next",
      assignee: "",
      dueDate: "",
      attachments: []
    });
    setErrors({});
    onClose();
  };
  
  // Calculate min date for due date (today)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">Create New Task</DialogTitle>
          <DialogDescription className="text-sm">
            Add a new task to your project management workflow.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the task"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="project" className="text-sm font-medium">
                Project
              </Label>
              <Select 
                value={formData.project} 
                onValueChange={(value) => handleSelectChange("project", value)}
              >
                <SelectTrigger className={`${errors.project ? "border-red-500" : ""} h-9 text-sm`}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {defaultProjects.map((project) => (
                    <SelectItem key={project} value={project} className="text-sm">
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && (
                <p className="text-xs text-red-500">{errors.project}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger className={`${errors.priority ? "border-red-500" : ""} h-9 text-sm`}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low" className="text-sm">Low</SelectItem>
                  <SelectItem value="Medium" className="text-sm">Medium</SelectItem>
                  <SelectItem value="High" className="text-sm">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-xs text-red-500">{errors.priority}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className={`${errors.status ? "border-red-500" : ""} h-9 text-sm`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Up Next" className="text-sm">Up Next</SelectItem>
                  <SelectItem value="In Progress" className="text-sm">In Progress</SelectItem>
                  <SelectItem value="Done" className="text-sm">Done</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                min={today}
                value={formData.dueDate}
                onChange={handleChange}
                className={`${errors.dueDate ? "border-red-500" : ""} h-9 text-sm`}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="assignee" className="text-sm font-medium">
              Assignee
            </Label>
            <Select 
              value={formData.assignee} 
              onValueChange={(value) => handleSelectChange("assignee", value)}
            >
              <SelectTrigger className={`${errors.assignee ? "border-red-500" : ""} h-9 text-sm`}>
                <SelectValue placeholder="Select an assignee" />
              </SelectTrigger>
              <SelectContent>
                {defaultAssignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.name} className="text-sm">
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignee && (
              <p className="text-xs text-red-500">{errors.assignee}</p>
            )}
          </div>
          
          {/* Attachments Section */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Attachments</Label>
            <div className="border border-gray-200 rounded-md p-2 sm:p-3 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mb-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start h-8"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip className="h-3 w-3 mr-1.5" />
                  Add file
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-xs text-gray-500 text-center sm:text-left sm:ml-3">
                  Upload files related to this task
                </span>
              </div>
              
              {/* Attached Files */}
              {formData.attachments.length > 0 && (
                <div className="space-y-1.5 mt-2 max-h-[120px] overflow-y-auto">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-1.5 rounded-md border border-gray-200">
                      <div className="flex items-center overflow-hidden max-w-[calc(100%-40px)]">
                        <File className="h-3 w-3 text-teal-500 mr-1.5 flex-shrink-0" />
                        <div className="truncate w-full">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-2 sm:pt-3">
            <Button type="button" variant="outline" onClick={resetForm} className="mr-2 h-8 text-xs sm:text-sm">
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 h-8 text-xs sm:text-sm">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}