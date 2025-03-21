// src/components/projects/TaskTrackingFilter.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskTrackingFilter({ 
  activeFilter, 
  onFilterChange, 
  sortOrder, 
  onSortChange 
}) {
  const filters = [
    { id: "new", label: "New" },
    { id: "in-progress", label: "In progress" },
    { id: "completed", label: "Completed" }
  ];

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <Badge 
            key={filter.id}
            variant="outline" 
            className={`px-4 py-1 rounded-full cursor-pointer ${
              activeFilter === filter.id 
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 text-xs flex items-center">
            Sort by: {sortOrder} <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortChange("Due date")}>Due date</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("Priority")}>Priority</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("Completion")}>Completion</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}