import React, { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'

/**
 * KpiCard component for displaying key performance indicators
 * 
 * @param title - Title of the KPI
 * @param value - Current value of the KPI
 * @param change - Change value as a string (e.g., "+12.5%")
 * @param trend - Whether the trend is up, down, or neutral
 * @param description - Optional description text
 * @param icon - Optional icon to display
 */
interface KpiCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  description?: string
  icon?: ReactNode
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
  icon
}) => {
  // Determine trend color and icon
  const getTrendDetails = () => {
    switch (trend) {
      case 'up':
        return {
          color: 'text-emerald-500',
          icon: <ArrowUp className="h-4 w-4" />
        }
      case 'down':
        return {
          color: 'text-rose-500',
          icon: <ArrowDown className="h-4 w-4" />
        }
      default:
        return {
          color: 'text-gray-500',
          icon: <ArrowRight className="h-4 w-4" />
        }
    }
  }
  
  const trendDetails = getTrendDetails()
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          <span className={`${trendDetails.color} flex items-center text-xs font-medium`}>
            {trendDetails.icon}
            <span className="ml-1">{change}</span>
          </span>
          {description && (
            <CardDescription className="ml-2 text-xs truncate">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  )
}