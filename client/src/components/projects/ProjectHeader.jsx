// src/components/projects/ProjectHeader.jsx
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl md:text-2xl font-bold">Projects</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            Project Alpha
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Project Alpha</DropdownMenuItem>
          <DropdownMenuItem>Project Beta</DropdownMenuItem>
          <DropdownMenuItem>Project Gamma</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}