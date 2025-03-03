// src/components/projects/TaskStatusCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Check, Pen } from "lucide-react";

export default function TaskStatusCard({ 
  title, 
  count, 
  trend, 
  icon, 
  color = "blue" 
}) {
  // Icon mapping
  const iconMap = {
    "clock": <Clock size={20} />,
    "check-circle": <CheckCircle size={20} />,
    "check": <Check size={20} />,
    "pen": <Pen size={20} />
  };

  // Color mapping
  const colorMap = {
    "teal": {
      border: "border-t-teal-500",
      bg: "bg-teal-100",
      text: "text-teal-500"
    },
    "blue": {
      border: "border-t-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-500"
    },
    "purple": {
      border: "border-t-purple-500",
      bg: "bg-purple-100",
      text: "text-purple-500"
    },
    "cyan": {
      border: "border-t-cyan-500",
      bg: "bg-cyan-100",
      text: "text-cyan-500"
    }
  };

  const colorClasses = colorMap[color] || colorMap.blue;
  const IconComponent = iconMap[icon] || iconMap.clock;

  return (
    <Card className={`overflow-hidden border-t-4 ${colorClasses.border} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-lg font-bold">{count} tasks</p>
          </div>
          <div className={`${colorClasses.bg} p-2 rounded-full ${colorClasses.text}`}>
            {IconComponent}
          </div>
        </div>
        <p className={`text-xs ${trend.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}