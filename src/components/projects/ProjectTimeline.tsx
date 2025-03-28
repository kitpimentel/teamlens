import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format, differenceInWeeks } from "date-fns"

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: string
}

interface ProjectTimelineProps {
  milestones: Milestone[]
  startDate: string
  endDate: string
}

/**
 * Project timeline component for visualizing project milestones
 */
function ProjectTimeline({ milestones, startDate, endDate }: ProjectTimelineProps) {
  const projectStart = new Date(startDate)
  const projectEnd = new Date(endDate)
  const totalDuration = differenceInWeeks(projectEnd, projectStart) + 1 // +1 to include start week
  
  /**
   * Calculate milestone position in timeline based on due date
   */
  const calculatePosition = (dueDate: string) => {
    const date = new Date(dueDate)
    const weeksFromStart = differenceInWeeks(date, projectStart)
    return Math.max(0, Math.min(100, (weeksFromStart / totalDuration) * 100))
  }
  
  /**
   * Get status color class
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white'
      case 'inProgress':
        return 'bg-blue-500 text-white'
      case 'todo':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }
  
  /**
   * Generate timeline weeks
   */
  const generateTimelineWeeks = () => {
    const weeks = []
    for (let i = 0; i <= totalDuration; i++) {
      // Create a date for this week
      const weekDate = new Date(projectStart)
      weekDate.setDate(weekDate.getDate() + i * 7)
      
      // Add week to array
      weeks.push({
        week: i + 1,
        date: weekDate
      })
    }
    return weeks
  }
  
  const timelineWeeks = generateTimelineWeeks()
  
  return (
    <div className="space-y-6">
      {/* Timeline scale */}
      <div className="relative">
        <div className="h-14 flex items-end relative">
          <div className="absolute inset-0 border-b">
            {timelineWeeks.map((week, index) => (
              <div 
                key={index}
                className="absolute bottom-0 border-l h-2"
                style={{ left: `${(index / timelineWeeks.length) * 100}%` }}
              ></div>
            ))}
          </div>
          
          {/* Week labels */}
          {timelineWeeks.filter((_, i) => i % 2 === 0).map((week, index) => (
            <div 
              key={index}
              className="absolute bottom-4 text-xs text-muted-foreground"
              style={{ 
                left: `${((index * 2) / timelineWeeks.length) * 100}%`, 
                transform: 'translateX(-50%)' 
              }}
            >
              Week {week.week}
              <div className="text-[10px]">{format(week.date, 'MMM d')}</div>
            </div>
          ))}
        </div>
        
        {/* Today marker */}
        <div 
          className="absolute top-0 bottom-0 border-l-2 border-primary z-10"
          style={{ 
            left: `${calculatePosition(new Date().toISOString())}%`,
          }}
        >
          <div className="absolute top-0 -left-2 bg-primary text-primary-foreground text-[10px] px-1 rounded">
            Today
          </div>
        </div>
      </div>
      
      {/* Milestones */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.id}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium">{milestone.title}</h4>
              <Badge className={cn("capitalize text-xs", getStatusColor(milestone.status))}>
                {milestone.status === 'inProgress' ? 'In Progress' : milestone.status}
              </Badge>
            </div>
            <div className="relative h-8 bg-muted/50 rounded-md">
              {/* Milestone marker */}
              <div 
                className={cn(
                  "absolute top-0 bottom-0 h-full w-1 rounded-md",
                  milestone.status === 'completed' ? 'bg-green-500' : 
                  milestone.status === 'inProgress' ? 'bg-blue-500' : 
                  'bg-gray-400'
                )}
                style={{ 
                  left: `${calculatePosition(milestone.dueDate)}%`,
                }}
              ></div>
              
              {/* Due date label */}
              <div 
                className="absolute -bottom-6 text-xs text-muted-foreground"
                style={{ 
                  left: `${calculatePosition(milestone.dueDate)}%`, 
                  transform: 'translateX(-50%)' 
                }}
              >
                {format(new Date(milestone.dueDate), 'MMM d')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border rounded-md p-4 mt-8">
        <h3 className="text-sm font-medium mb-2">Upcoming Milestones</h3>
        <div className="space-y-2">
          {milestones
            .filter(m => m.status !== 'completed')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map(milestone => (
              <Card key={milestone.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn("capitalize", getStatusColor(milestone.status))}>
                        {milestone.status === 'inProgress' ? 'In Progress' : milestone.status}
                      </Badge>
                      <p className="text-sm mt-1">{format(new Date(milestone.dueDate), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectTimeline