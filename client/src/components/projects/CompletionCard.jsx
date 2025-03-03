// src/components/projects/CompletionCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CompletionCard({ 
  title, 
  percentage, 
  subtitle,
  color = "teal"
}) {
  // Color mapping
  const colorMap = {
    "teal": "text-teal-500 border-teal-200",
    "cyan": "text-cyan-500 border-cyan-200",
    "purple": "text-purple-500 border-purple-200",
    "blue": "text-blue-500 border-blue-200",
  };

  const colorClass = colorMap[color] || colorMap.teal;
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center my-4">
          {/* Circle progress indicator */}
          <div className="relative w-32 h-32 mb-4 lg:mb-0 lg:mr-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#e6e6e6"
                strokeWidth="10"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={color === "teal" ? "#14b8a6" : "#06b6d4"}
                strokeWidth="10"
                strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{percentage}%</span>
            </div>
          </div>
          
          <div className="text-center lg:text-left flex-1">
            <p className="text-md font-medium mb-2">Completed</p>
            <p className="text-sm mb-4">{subtitle}</p>
            <Button variant="outline" className={`${colorClass} border px-4 py-1 h-8 text-xs`}>
              View report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}