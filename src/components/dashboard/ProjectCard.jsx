import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";

export default function ProjectCard({ 
  project,
  onOptionsClick,
  statusColors = {
    inQA: "#10B981", // green
    done: "#3B82F6", // blue
    inCodeReview: "#8B5CF6", // purple
    inProgress: "#6B7280" // gray
  }
}) {
  const total = Object.values(project.status).reduce((acc, val) => acc + val, 0);
  const percentages = {};
  
  // Calculate percentages for each status
  Object.keys(project.status).forEach(key => {
    percentages[key] = (project.status[key] / total) * 100;
  });

  // Calculate stroke dasharray and offset for SVG circles
  const getCircleConfig = (key, keys) => {
    const percentage = percentages[key];
    const dashArray = `${percentage * 2.51} ${251 - percentage * 2.51}`;
    
    // Calculate offset based on previous segments
    let offset = 0;
    for (let i = 0; i < keys.indexOf(key); i++) {
      offset += percentages[keys[i]];
    }
    const dashOffset = offset > 0 ? `${251 - offset * 2.51}` : 0;
    
    return { dashArray, dashOffset };
  };

  const statusKeys = Object.keys(project.status);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex-row justify-between items-start">
        <h3 className="font-medium">{project.name}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onOptionsClick && onOptionsClick(project)}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col sm:flex-row mb-4">
          {/* Pie chart visualization */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 mb-3 sm:mb-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {statusKeys.map((key, index) => {
                const { dashArray, dashOffset } = getCircleConfig(key, statusKeys);
                return (
                  <circle
                    key={key}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={statusColors[key]}
                    strokeWidth="20"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 50 50)"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="ml-0 sm:ml-4 space-y-1 text-sm flex flex-wrap sm:flex-col justify-center sm:justify-start">
            {statusKeys.map((key) => (
              <div key={key} className="flex items-center mr-3 sm:mr-0">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: statusColors[key] }}
                ></span>
                <span className="text-xs sm:text-sm">{formatStatusName(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between text-center sm:text-left mx-7">
        <div>
          <p className="text-xs text-gray-500">Completion Rate</p>
          <p className="font-semibold text-base sm:text-lg">{project.completion}%</p>
          <p className={`text-xs ${project.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {project.trend}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Added Hours</p>
          <p className="font-semibold text-base sm:text-lg">{project.hours} hours</p>
          <p className={`text-xs ${project.hoursTrend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {project.hoursTrend}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper to format status key to readable text
function formatStatusName(key) {
  return key
    .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}