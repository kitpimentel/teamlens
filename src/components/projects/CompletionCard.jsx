// src/components/projects/CompletionCard.jsx
import React from "react";

const CompletionCard = ({ title, percentage, subtitle, color, showViewReport = false }) => {
  // Define colors for the progress ring
  const getProgressColor = () => {
    switch (color) {
      case "teal":
        return "stroke-teal-500";
      case "cyan":
        return "stroke-cyan-500";
      default:
        return "stroke-blue-500";
    }
  };
  
  // Define colors for the button
  const getButtonColor = () => {
    switch (color) {
      case "teal":
        return "bg-teal-500 hover:bg-teal-600";
      case "cyan":
        return "bg-cyan-500 hover:bg-cyan-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  // Calculate the circumference and offset for the SVG circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="text-gray-600 font-medium mb-5">{title}</div>
      
      <div className="flex">
        {/* SVG Progress Circle */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeLinecap="round"
              className={getProgressColor()}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{percentage}%</span>
          </div>
        </div>
        
        {/* Text */}
        <div className="ml-6">
          <div className="font-bold text-gray-800">Completed</div>
          <div className="text-gray-600 mb-4">{subtitle}</div>
          
          {showViewReport && (
            <button 
              className={`text-white text-sm py-2 px-4 rounded ${getButtonColor()}`}
            >
              View report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletionCard;