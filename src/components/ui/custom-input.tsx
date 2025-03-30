import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Extended input props with prefix and suffix icons/elements
 * Using prefixIcon and suffixIcon to avoid conflict with HTML input's native prefix attribute
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

/**
 * Custom Input component that supports prefix and suffix icons/elements
 * This component extends the standard HTML input element with additional functionality
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixIcon, suffixIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {prefixIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {prefixIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            prefixIcon && "pl-10",
            suffixIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffixIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none">
            {suffixIcon}
          </div>
        )}
      </div>
    );
  }
);

// Add display name for React DevTools
Input.displayName = "Input";

export { Input };