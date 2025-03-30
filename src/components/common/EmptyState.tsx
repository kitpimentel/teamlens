import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Props for EmptyState component
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/**
 * EmptyState component for displaying when a list or data set is empty
 * Provides visual feedback and optional action button
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center text-center py-10 px-4">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
};

export default EmptyState;