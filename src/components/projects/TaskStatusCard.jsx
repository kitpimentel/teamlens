// src/components/projects/TaskStatusCard.jsx
import React from "react";
import { 
  Clock, 
  PenTool, 
  CheckCircle, 
  Check, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

const TaskStatusCard = ({ title, count, trend, icon, color }) => {
  // Define the icon component based on the icon prop
  const getIcon = () => {
    const iconStyles = "w-6 h-6 text-white";
    
    switch (icon) {
      case "clock":
        return <Clock className={iconStyles} />;
      case "pen":
        return <PenTool className={iconStyles} />;
      case "check-circle":
        return <CheckCircle className={iconStyles} />;
      case "check":
        return <Check className={iconStyles} />;
      default:
        return <Clock className={iconStyles} />;
    }
  };

  // Define background color for the icon container
  const getBgColor = () => {
    switch (color) {
      case "teal":
        return "bg-teal-500";
      case "blue":
        return "bg-blue-500";
      case "purple":
        return "bg-purple-500";
      case "cyan":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start mb-6">
        <div className="text-gray-600 font-medium">{title}</div>
        <div className={`rounded-full p-2 flex items-center justify-center ${getBgColor()}`}>
          {getIcon()}
        </div>
      </div>
      
      <div>
        <div className="text-2xl font-bold mb-1">{count} tasks</div>
        
        <div className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? (
            <ArrowUp className="w-4 h-4 inline mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 inline mr-1" />
          )}
          {Math.abs(trend)}%
        </div>
      </div>
    </div>
  );
};

export default TaskStatusCard;