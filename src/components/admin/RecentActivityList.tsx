import React from 'react'
import { AlertCircle, CheckCircle2, Clock, User, Zap } from 'lucide-react'

/**
 * Activity type definition
 */
interface Activity {
  id: number
  type: 'user_added' | 'alert' | 'integration' | 'system' | string
  message: string
  timestamp: string
  user: string
}

/**
 * RecentActivityList component for displaying a list of recent activities
 * 
 * @param activities - Array of activity objects to display
 */
interface RecentActivityListProps {
  activities: Activity[]
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_added':
        return <User className="h-5 w-5 text-blue-500" />
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case 'integration':
        return <Zap className="h-5 w-5 text-purple-500" />
      default:
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    }
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className="mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.message}
            </p>
            <div className="flex items-center pt-1">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {activity.timestamp}
              </span>
              <span className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></span>
              <span className="text-xs text-muted-foreground">
                {activity.user}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}