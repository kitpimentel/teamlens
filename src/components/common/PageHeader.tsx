import React from "react";

/**
 * Props for PageHeader component
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * PageHeader component for consistent page headers across the application
 * Displays a title, optional description, and optional action buttons
 */
const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;