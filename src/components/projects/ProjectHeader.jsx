// src/components/projects/ProjectHeader.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectHeader({ 
  onProjectChange = () => {}, 
  initialProject = "Project Alpha"
}) {
  // List of available projects
  const projects = [
    "Project Alpha",
    "Project Beta",
    "Project Gamma",
    "Project Delta",
    "Project Epsilon"
  ];

  // State to track the currently selected project
  const [selectedProject, setSelectedProject] = useState(initialProject);

  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    onProjectChange(project); // Call the callback prop for parent components
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            {selectedProject}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          {projects.map((project) => (
            <DropdownMenuItem 
              key={project}
              onClick={() => handleProjectSelect(project)}
              className={selectedProject === project ? "bg-muted font-medium" : ""}
            >
              {project}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}