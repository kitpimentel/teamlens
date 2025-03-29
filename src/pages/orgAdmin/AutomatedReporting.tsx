import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  PlusCircle, 
  FileDown, 
  FileCog, 
  Calendar, 
  Clock, 
  Mail, 
  MoreHorizontal, 
  Copy, 
  Trash2, 
  CheckCircle, 
  FileText, 
  Send, 
  Download, 
  Clock4, 
  Pencil,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for report template
 */
/**
 * Type for report template section types
 */
type SectionType = "progress" | "tasks" | "time" | "team" | "issues" | "risks" | "budget" | "custom" | "kpis";

/**
 * Type for report template types
 */
type TemplateType = "project" | "team" | "client" | "executive" | "custom";

/**
 * Type for report format types
 */
type FormatType = "pdf" | "excel" | "web";

/**
 * Type for template status
 */
type StatusType = "active" | "draft" | "archived";

/**
 * Type for schedule frequency
 */
type FrequencyType = "daily" | "weekly" | "biweekly" | "monthly" | "custom" | "manual";

/**
 * Interface for report template
 */
interface ReportTemplate {
  id: string
  name: string
  description: string
  projectId?: string
  projectName?: string
  type: TemplateType
  format: FormatType
  status: StatusType
  createdAt: string
  createdBy: string
  lastModified: string
  lastModifiedBy: string
  lastGenerated?: string
  sections: {
    id: string
    name: string
    type: SectionType
    enabled: boolean
  }[]
  schedule?: {
    frequency: FrequencyType
    day?: string // day of week or month
    time?: string // time of day
    nextScheduled?: string // next scheduled generation
  }
  recipients?: {
    id: string
    name: string
    email: string
    role: string
  }[]
}

/**
 * Interface for generated report
 */
interface GeneratedReport {
  id: string
  templateId: string
  templateName: string
  projectId?: string
  projectName?: string
  format: "pdf" | "excel" | "web"
  generatedAt: string
  generatedBy: string
  downloadUrl: string
  viewUrl: string
  shared: boolean
  size: string
  recipients?: {
    id: string
    name: string
    email: string
    sentAt?: string
  }[]
}

/**
 * Automated Reporting component
 * Allows organization admins to create, schedule, and manage automated reports
 */
const AutomatedReporting = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("templates")
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null)

  // Form state for new template
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    projectId: "",
    type: "project",
    format: "pdf",
    sections: [
      { id: "progress", name: "Project Progress", type: "progress" as const, enabled: true },
      { id: "tasks", name: "Tasks Overview", type: "tasks" as const, enabled: true },
      { id: "time", name: "Timeline & Milestones", type: "time" as const, enabled: true },
      { id: "team", name: "Team Performance", type: "team" as const, enabled: true },
      { id: "issues", name: "Issues & Blockers", type: "issues" as const, enabled: false },
      { id: "risks", name: "Risks Assessment", type: "risks" as const, enabled: false },
      { id: "budget", name: "Budget vs. Actual", type: "budget" as const, enabled: false },
      { id: "kpis", name: "Key Metrics & KPIs", type: "kpis" as const, enabled: true }
    ]
  })

  // Form state for scheduling
  const [schedule, setSchedule] = useState({
    frequency: "weekly",
    day: "monday",
    time: "09:00",
    recipients: [] as string[]
  })

  // Form state for sharing
  const [shareForm, setShareForm] = useState({
    recipients: [] as string[],
    message: ""
  })

  // Mock projects data
  const projects = [
    { id: "proj-1", name: "Team Lens Dashboard" },
    { id: "proj-2", name: "E-commerce Mobile App" },
    { id: "proj-3", name: "Marketing Website Redesign" },
    { id: "proj-4", name: "API Integration" },
    { id: "proj-5", name: "CRM Implementation" }
  ]

  // Mock team members/recipients data
  const teamMembers = [
    {
      id: "tm-1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "Lead Developer",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff"
    },
    {
      id: "tm-2",
      name: "Jason Patel",
      email: "jason.patel@example.com",
      role: "UX Designer",
      avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff"
    },
    {
      id: "tm-3",
      name: "Michelle Wang",
      email: "michelle.wang@example.com",
      role: "Project Manager",
      avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff"
    },
    {
      id: "tm-4",
      name: "David Kim",
      email: "david.kim@example.com",
      role: "QA Engineer",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff"
    },
    {
      id: "cl-1",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@retailinc.example.com",
      role: "Client - Retail Inc.",
      avatar: "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=ec4899&color=fff"
    },
    {
      id: "cl-2",
      name: "Jessica Lee",
      email: "jessica.lee@techstart.example.com",
      role: "Client - TechStart LLC",
      avatar: "https://ui-avatars.com/api/?name=Jessica+Lee&background=14b8a6&color=fff"
    }
  ]

  // Mock report templates data
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([
    {
      id: "template-1",
      name: "Weekly Project Status Report",
      description: "Comprehensive weekly status report with progress, tasks, and team performance metrics.",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      type: "project",
      format: "pdf",
      status: "active",
      createdAt: "2025-02-15T10:30:00Z",
      createdBy: "Michelle Wang",
      lastModified: "2025-03-10T14:45:00Z",
      lastModifiedBy: "Michelle Wang",
      lastGenerated: "2025-03-28T09:00:00Z",
      sections: [
        { id: "progress", name: "Project Progress", type: "progress", enabled: true },
        { id: "tasks", name: "Tasks Overview", type: "tasks", enabled: true },
        { id: "time", name: "Timeline & Milestones", type: "time", enabled: true },
        { id: "team", name: "Team Performance", type: "team", enabled: true },
        { id: "issues", name: "Issues & Blockers", type: "issues", enabled: true },
        { id: "kpis", name: "Key Metrics & KPIs", type: "kpis", enabled: true }
      ],
      schedule: {
        frequency: "weekly",
        day: "friday",
        time: "16:00",
        nextScheduled: "2025-04-05T16:00:00Z"
      },
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          role: "Project Manager"
        },
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          role: "Lead Developer"
        }
      ]
    },
    {
      id: "template-2",
      name: "E-commerce App Client Update",
      description: "Client-facing report focusing on progress, completed features, and upcoming milestones.",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      type: "client",
      format: "pdf",
      status: "active",
      createdAt: "2025-02-20T11:15:00Z",
      createdBy: "Michelle Wang",
      lastModified: "2025-03-15T13:30:00Z",
      lastModifiedBy: "Michelle Wang",
      lastGenerated: "2025-03-25T10:00:00Z",
      sections: [
        { id: "progress", name: "Project Progress", type: "progress", enabled: true },
        { id: "time", name: "Timeline & Milestones", type: "time", enabled: true },
        { id: "kpis", name: "Key Metrics & KPIs", type: "kpis", enabled: true },
        { id: "budget", name: "Budget vs. Actual", type: "budget", enabled: true }
      ],
      schedule: {
        frequency: "biweekly",
        day: "tuesday",
        time: "10:00",
        nextScheduled: "2025-04-08T10:00:00Z"
      },
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          role: "Project Manager"
        },
        {
          id: "cl-1",
          name: "Alex Rodriguez",
          email: "alex.rodriguez@retailinc.example.com",
          role: "Client - Retail Inc."
        }
      ]
    },
    {
      id: "template-3",
      name: "Development Team Performance",
      description: "Team-focused report with velocity, task completion rate, and individual metrics.",
      type: "team",
      format: "web",
      status: "active",
      createdAt: "2025-03-01T09:45:00Z",
      createdBy: "Sarah Chen",
      lastModified: "2025-03-01T09:45:00Z",
      lastModifiedBy: "Sarah Chen",
      lastGenerated: "2025-03-29T08:00:00Z",
      sections: [
        { id: "team", name: "Team Performance", type: "team", enabled: true },
        { id: "tasks", name: "Tasks Overview", type: "tasks", enabled: true },
        { id: "issues", name: "Issues & Blockers", type: "issues", enabled: true }
      ],
      schedule: {
        frequency: "weekly",
        day: "monday",
        time: "08:00",
        nextScheduled: "2025-04-05T08:00:00Z"
      },
      recipients: [
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          role: "Lead Developer"
        },
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          role: "Project Manager"
        }
      ]
    },
    {
      id: "template-4",
      name: "Executive Dashboard",
      description: "High-level summary of all projects, focusing on key metrics and financial data.",
      type: "executive",
      format: "pdf",
      status: "active",
      createdAt: "2025-03-05T14:20:00Z",
      createdBy: "Michelle Wang",
      lastModified: "2025-03-20T11:30:00Z",
      lastModifiedBy: "Michelle Wang",
      lastGenerated: "2025-03-31T07:00:00Z",
      sections: [
        { id: "progress", name: "Project Progress", type: "progress", enabled: true },
        { id: "kpis", name: "Key Metrics & KPIs", type: "kpis", enabled: true },
        { id: "budget", name: "Budget vs. Actual", type: "budget", enabled: true },
        { id: "risks", name: "Risks Assessment", type: "risks", enabled: true }
      ],
      schedule: {
        frequency: "monthly",
        day: "1",
        time: "07:00",
        nextScheduled: "2025-05-01T07:00:00Z"
      },
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          role: "Project Manager"
        }
      ]
    },
    {
      id: "template-5",
      name: "Website Redesign Analytics",
      description: "Custom report focusing on website analytics, SEO metrics, and user feedback.",
      projectId: "proj-3",
      projectName: "Marketing Website Redesign",
      type: "custom",
      format: "excel",
      status: "draft",
      createdAt: "2025-03-15T16:00:00Z",
      createdBy: "Jason Patel",
      lastModified: "2025-03-15T16:00:00Z",
      lastModifiedBy: "Jason Patel",
      sections: [
        { id: "progress", name: "Project Progress", type: "progress", enabled: true },
        { id: "custom", name: "Analytics Dashboard", type: "custom", enabled: true },
        { id: "kpis", name: "Key Metrics & KPIs", type: "kpis", enabled: true }
      ]
    }
  ])

  // Mock generated reports data
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: "report-1",
      templateId: "template-1",
      templateName: "Weekly Project Status Report",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      format: "pdf",
      generatedAt: "2025-03-28T09:00:00Z",
      generatedBy: "System (Automated)",
      downloadUrl: "#",
      viewUrl: "#",
      shared: true,
      size: "2.4 MB",
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          sentAt: "2025-03-28T09:05:00Z"
        },
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          sentAt: "2025-03-28T09:05:00Z"
        }
      ]
    },
    {
      id: "report-2",
      templateId: "template-1",
      templateName: "Weekly Project Status Report",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      format: "pdf",
      generatedAt: "2025-03-21T09:00:00Z",
      generatedBy: "System (Automated)",
      downloadUrl: "#",
      viewUrl: "#",
      shared: true,
      size: "2.3 MB",
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          sentAt: "2025-03-21T09:05:00Z"
        },
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          sentAt: "2025-03-21T09:05:00Z"
        }
      ]
    },
    {
      id: "report-3",
      templateId: "template-2",
      templateName: "E-commerce App Client Update",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      format: "pdf",
      generatedAt: "2025-03-25T10:00:00Z",
      generatedBy: "System (Automated)",
      downloadUrl: "#",
      viewUrl: "#",
      shared: true,
      size: "3.1 MB",
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          sentAt: "2025-03-25T10:05:00Z"
        },
        {
          id: "cl-1",
          name: "Alex Rodriguez",
          email: "alex.rodriguez@retailinc.example.com",
          sentAt: "2025-03-25T10:05:00Z"
        }
      ]
    },
    {
      id: "report-4",
      templateId: "template-3",
      templateName: "Development Team Performance",
      format: "web",
      generatedAt: "2025-03-29T08:00:00Z",
      generatedBy: "System (Automated)",
      downloadUrl: "#",
      viewUrl: "#",
      shared: true,
      size: "1.8 MB",
      recipients: [
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          sentAt: "2025-03-29T08:05:00Z"
        },
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          sentAt: "2025-03-29T08:05:00Z"
        }
      ]
    },
    {
      id: "report-5",
      templateId: "template-4",
      templateName: "Executive Dashboard",
      format: "pdf",
      generatedAt: "2025-03-31T07:00:00Z",
      generatedBy: "System (Automated)",
      downloadUrl: "#",
      viewUrl: "#",
      shared: true,
      size: "4.2 MB",
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          sentAt: "2025-03-31T07:05:00Z"
        }
      ]
    },
    {
      id: "report-6",
      templateId: "template-2",
      templateName: "E-commerce App Client Update",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      format: "pdf",
      generatedAt: "2025-03-11T10:00:00Z",
      generatedBy: "System (Automated)",
      downloadUrl: "#",
      viewUrl: "#",
      shared: true,
      size: "2.9 MB",
      recipients: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          sentAt: "2025-03-11T10:05:00Z"
        },
        {
          id: "cl-1",
          name: "Alex Rodriguez",
          email: "alex.rodriguez@retailinc.example.com",
          sentAt: "2025-03-11T10:05:00Z"
        }
      ]
    }
  ])

  // Handle creating a new template
  const handleCreateTemplate = () => {
    // Validate form
    if (!newTemplate.name || !newTemplate.description) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Find project if projectId is provided
    const project = newTemplate.projectId ? projects.find(p => p.id === newTemplate.projectId) : undefined
    
    // Create new template with properly typed sections
    const createdTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      projectId: newTemplate.projectId || undefined,
      projectName: project?.name,
      type: newTemplate.type as "project" | "team" | "client" | "executive" | "custom",
      format: newTemplate.format as "pdf" | "excel" | "web",
      status: "draft" as "draft",
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "System",
      lastModified: new Date().toISOString(),
      lastModifiedBy: user?.name || "System",
      sections: newTemplate.sections.map(section => ({
        id: section.id,
        name: section.name,
        type: section.type,
        enabled: section.enabled
      }))
    }
    
    // Add to templates
    setReportTemplates([createdTemplate, ...reportTemplates])
    setCreateTemplateDialogOpen(false)
    
    // Reset form
    setNewTemplate({
      name: "",
      description: "",
      projectId: "",
      type: "project",
      format: "pdf",
      sections: [
        { id: "progress", name: "Project Progress", type: "progress" as const, enabled: true },
        { id: "tasks", name: "Tasks Overview", type: "tasks" as const, enabled: true },
        { id: "time", name: "Timeline & Milestones", type: "time" as const, enabled: true },
        { id: "team", name: "Team Performance", type: "team" as const, enabled: true },
        { id: "issues", name: "Issues & Blockers", type: "issues" as const, enabled: false },
        { id: "risks", name: "Risks Assessment", type: "risks" as const, enabled: false },
        { id: "budget", name: "Budget vs. Actual", type: "budget" as const, enabled: false },
        { id: "kpis", name: "Key Metrics & KPIs", type: "kpis" as const, enabled: true }
      ]
    })
    
    toast.success(`Report template "${newTemplate.name}" created successfully`)
  }

  // Handle scheduling a report
  const handleScheduleReport = () => {
    if (!selectedTemplate) return
    
    // Validate form
    if (!schedule.frequency || !schedule.time) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Calculate next scheduled date
    const now = new Date()
    let nextScheduled = new Date(now)
    
    switch (schedule.frequency) {
      case "daily":
        nextScheduled.setDate(now.getDate() + 1)
        break
      case "weekly":
        // Get day of week index (0 = Sunday, 1 = Monday, etc.)
        const dayMap: Record<string, number> = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3, 
          thursday: 4, friday: 5, saturday: 6
        }
        const targetDay = dayMap[schedule.day]
        const currentDay = now.getDay()
        const daysUntilTarget = (targetDay + 7 - currentDay) % 7
        nextScheduled.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget))
        break
      case "biweekly":
        // Similar to weekly but add 14 days
        const biweeklyDayMap: Record<string, number> = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3, 
          thursday: 4, friday: 5, saturday: 6
        }
        const biweeklyTargetDay = biweeklyDayMap[schedule.day]
        const biweeklyCurrentDay = now.getDay()
        const biweeklyDaysUntilTarget = (biweeklyTargetDay + 7 - biweeklyCurrentDay) % 7
        nextScheduled.setDate(now.getDate() + (biweeklyDaysUntilTarget === 0 ? 14 : biweeklyDaysUntilTarget + 7))
        break
      case "monthly":
        // Set to next month, same day
        nextScheduled.setMonth(now.getMonth() + 1)
        nextScheduled.setDate(parseInt(schedule.day))
        break
      case "custom":
        // For custom, just set to tomorrow as a placeholder
        nextScheduled.setDate(now.getDate() + 1)
        break
      case "manual":
        // No scheduling for manual
        nextScheduled = new Date(0)
        break
    }
    
    // Set the time
    if (schedule.time && schedule.frequency !== "manual") {
      const [hours, minutes] = schedule.time.split(":").map(Number)
      nextScheduled.setHours(hours, minutes, 0, 0)
    }
    
    // Find recipients
    const scheduledRecipients = schedule.recipients.map(recipientId => {
      const member = teamMembers.find(m => m.id === recipientId)
      return {
        id: member?.id || "",
        name: member?.name || "",
        email: member?.email || "",
        role: member?.role || ""
      }
    }).filter(r => r.id !== "")
    
    // Update template with schedule
    const updatedTemplates = reportTemplates.map(template => {
      if (template.id === selectedTemplate.id) {
        // Create a properly typed updated template
        const updatedTemplate: ReportTemplate = {
          ...template,
          status: "active" as StatusType,
          lastModified: new Date().toISOString(),
          lastModifiedBy: user?.name || "System",
          schedule: schedule.frequency === "manual" ? undefined : {
            frequency: schedule.frequency as FrequencyType,
            day: schedule.day,
            time: schedule.time,
            nextScheduled: nextScheduled.toISOString()
          },
          recipients: scheduledRecipients.length > 0 ? scheduledRecipients : undefined
        }
        return updatedTemplate
      }
      return template
    })
    
    setReportTemplates(updatedTemplates)
    setScheduleDialogOpen(false)
    
    toast.success(schedule.frequency === "manual" 
      ? "Report unscheduled and set to manual generation"
      : `Report scheduled for ${schedule.frequency} generation`)
  }

  // Handle generating a report manually
  const handleGenerateReport = (template: ReportTemplate) => {
    // Create new report
    const newReport: GeneratedReport = {
      id: `report-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      projectId: template.projectId,
      projectName: template.projectName,
      format: template.format,
      generatedAt: new Date().toISOString(),
      generatedBy: user?.name || "Manual Generation",
      downloadUrl: "#",
      viewUrl: "#",
      shared: false,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      recipients: template.recipients
    }
    
    // Add to reports
    setGeneratedReports([newReport, ...generatedReports])
    
    // Update template lastGenerated
    const updatedTemplates = reportTemplates.map(t => {
      if (t.id === template.id) {
        return {
          ...t,
          lastGenerated: new Date().toISOString()
        }
      }
      return t
    })
    
    setReportTemplates(updatedTemplates)
    
    toast.success(`Report "${template.name}" generated successfully`)
  }

  // Handle sharing a report
  const handleShareReport = () => {
    if (!selectedReport) return
    
    // Validate form
    if (shareForm.recipients.length === 0) {
      toast.error("Please select at least one recipient")
      return
    }
    
    // Find recipients
    const reportRecipients = shareForm.recipients.map(recipientId => {
      const member = teamMembers.find(m => m.id === recipientId)
      return {
        id: member?.id || "",
        name: member?.name || "",
        email: member?.email || "",
        sentAt: new Date().toISOString()
      }
    }).filter(r => r.id !== "")
    
    // Update report with recipients
    const updatedReports = generatedReports.map(report => {
      if (report.id === selectedReport.id) {
        const existingRecipients = report.recipients || []
        const newRecipientIds = reportRecipients.map(r => r.id)
        
        // Filter out recipients that are already in the list
        const filteredExistingRecipients = existingRecipients.filter(
          r => !newRecipientIds.includes(r.id)
        )
        
        return {
          ...report,
          shared: true,
          recipients: [...filteredExistingRecipients, ...reportRecipients]
        }
      }
      return report
    })
    
    setGeneratedReports(updatedReports)
    setShareDialogOpen(false)
    
    // Reset form
    setShareForm({
      recipients: [],
      message: ""
    })
    
    toast.success(`Report shared with ${reportRecipients.length} recipient${reportRecipients.length !== 1 ? 's' : ''}`)
  }

  // Handle duplicating a template
  const handleDuplicateTemplate = (template: ReportTemplate) => {
    // Create a deep copy with proper typing
    const duplicatedTemplate: ReportTemplate = {
      ...JSON.parse(JSON.stringify(template)),
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      status: "draft" as "draft",
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "System",
      lastModified: new Date().toISOString(),
      lastModifiedBy: user?.name || "System",
      lastGenerated: undefined,
      schedule: undefined
    }
    
    setReportTemplates([duplicatedTemplate, ...reportTemplates])
    toast.success(`Template "${template.name}" duplicated successfully`)
  }

  // Handle archiving a template
  const handleArchiveTemplate = (templateId: string) => {
    const updatedTemplates = reportTemplates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          status: "archived" as "archived",
          lastModified: new Date().toISOString(),
          lastModifiedBy: user?.name || "System",
          schedule: undefined
        }
      }
      return template
    })
    
    setReportTemplates(updatedTemplates)
    toast.success("Template archived successfully")
  }

  // Handle activating a template
  const handleActivateTemplate = (templateId: string) => {
    const updatedTemplates = reportTemplates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          status: "active" as "active",
          lastModified: new Date().toISOString(),
          lastModifiedBy: user?.name || "System"
        }
      }
      return template
    })
    
    setReportTemplates(updatedTemplates)
    toast.success("Template activated successfully")
  }

  // Handle deleting a template
  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = reportTemplates.filter(template => template.id !== templateId)
    setReportTemplates(updatedTemplates)
    toast.success("Template deleted successfully")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automated Reporting</h1>
          <p className="text-muted-foreground">
            Create, schedule, and share customized reports
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={createTemplateDialogOpen} onOpenChange={setCreateTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Create Report Template</DialogTitle>
                <DialogDescription>
                  Design a new report template with customized sections
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-2">
                <div className="grid gap-2">
                  <Label htmlFor="template-name">Template Name*</Label>
                  <Input
                    id="template-name"
                    placeholder="Enter template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="template-description">Description*</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Enter template description"
                    rows={2}
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="template-type">Report Type</Label>
                    <Select 
                      value={newTemplate.type} 
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
                    >
                      <SelectTrigger id="template-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project">Project Report</SelectItem>
                        <SelectItem value="team">Team Report</SelectItem>
                        <SelectItem value="client">Client Report</SelectItem>
                        <SelectItem value="executive">Executive Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="template-format">Format</Label>
                    <Select 
                      value={newTemplate.format} 
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, format: value })}
                    >
                      <SelectTrigger id="template-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="web">Web Link (HTML)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newTemplate.type === "project" && (
                    <div className="grid gap-2">
                      <Label htmlFor="template-project">Project (Optional)</Label>
                      <Select 
                        value={newTemplate.projectId} 
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, projectId: value })}
                      >
                        <SelectTrigger id="template-project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Projects</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2 mt-2">
                  <Label>Report Sections</Label>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-3 bg-muted/30 rounded-t-md border-b">
                      <div className="col-span-2">Section Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="text-right">Include</div>
                    </div>
                    
                    <div className="p-2 divide-y">
                      {newTemplate.sections.map((section, index) => (
                        <div key={section.id} className="grid grid-cols-5 gap-4 p-2 items-center">
                          <div className="col-span-2 font-medium">{section.name}</div>
                          <div className="col-span-2 text-muted-foreground">
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                          </div>
                          <div className="text-right">
                            <Checkbox
                              checked={section.enabled}
                              onCheckedChange={(checked) => {
                                const updatedSections = [...newTemplate.sections]
                                updatedSections[index].enabled = checked === true
                                setNewTemplate({ ...newTemplate, sections: updatedSections })
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTemplates.filter(t => t.status !== "archived").map((template) => (
              <Card key={template.id} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {template.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleActivateTemplate(template.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate Template
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleGenerateReport(template)}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Generate Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedTemplate(template)
                          
                          // Set default schedule based on template
                          setSchedule({
                            frequency: template.schedule?.frequency || "weekly",
                            day: template.schedule?.day || "monday",
                            time: template.schedule?.time || "09:00",
                            recipients: template.recipients?.map(r => r.id) || []
                          })
                          
                          setScheduleDialogOpen(true)
                        }}>
                          <Clock className="mr-2 h-4 w-4" />
                          Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchiveTemplate(template.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="py-2 flex-grow">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {template.type === "project" ? "Project Report" :
                         template.type === "team" ? "Team Report" :
                         template.type === "client" ? "Client Report" :
                         template.type === "executive" ? "Executive Report" : "Custom Report"}
                      </Badge>
                      
                      <Badge variant="outline">
                        {template.format === "pdf" ? "PDF" :
                         template.format === "excel" ? "Excel" : "Web"}
                      </Badge>
                      
                      <Badge variant={
                        template.status === "active" ? "default" :
                        template.status === "draft" ? "outline" : "secondary"
                      }>
                        {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {template.projectName && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Project: </span>
                        {template.projectName}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Sections: </span>
                      {template.sections.filter(s => s.enabled).length} enabled
                    </div>
                    
                    {template.schedule && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Schedule: </span>
                        {template.schedule.frequency.charAt(0).toUpperCase() + template.schedule.frequency.slice(1)}
                        {template.schedule.frequency === "weekly" || template.schedule.frequency === "biweekly" ? 
                          ` (${template.schedule.day?.charAt(0).toUpperCase()}${template.schedule.day?.slice(1) || ''}s at ${template.schedule.time})` : 
                          template.schedule.frequency === "monthly" ?
                          ` (Day ${template.schedule.day} at ${template.schedule.time})` :
                          template.schedule.frequency === "daily" ?
                          ` (at ${template.schedule.time})` : ''
                        }
                      </div>
                    )}
                    
                    {template.lastGenerated && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last generated: </span>
                        {formatDate(template.lastGenerated)}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-xs text-muted-foreground">
                      Created {formatDate(template.createdAt)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleGenerateReport(template)}>
                        <FileDown className="mr-1 h-3 w-3" />
                        Generate
                      </Button>
                      
                      {template.status === "draft" ? (
                        <Button size="sm" onClick={() => handleActivateTemplate(template.id)}>
                          Activate
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => {
                          setSelectedTemplate(template)
                          
                          // Set default schedule based on template
                          setSchedule({
                            frequency: template.schedule?.frequency || "weekly",
                            day: template.schedule?.day || "monday",
                            time: template.schedule?.time || "09:00",
                            recipients: template.recipients?.map(r => r.id) || []
                          })
                          
                          setScheduleDialogOpen(true)
                        }}>
                          <Clock className="mr-1 h-3 w-3" />
                          Schedule
                        </Button>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {/* Create Template Card */}
            <Card className="flex flex-col h-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 flex-grow">
                <FileCog className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">Create New Template</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Design a custom report template with the sections you need
                </p>
                <Button onClick={() => setCreateTemplateDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Archived Templates Section */}
          {reportTemplates.filter(t => t.status === "archived").length > 0 && (
            <>
              <div className="flex items-center mt-8 mb-4">
                <div className="w-full h-px bg-border"></div>
                <span className="px-4 text-muted-foreground font-medium">Archived Templates</span>
                <div className="w-full h-px bg-border"></div>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Template Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Format</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Last Modified</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportTemplates.filter(t => t.status === "archived").map((template) => (
                      <tr key={template.id} className="border-t hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          {template.projectName && <div className="text-xs text-muted-foreground">{template.projectName}</div>}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {template.format.toUpperCase()}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {formatDate(template.lastModified)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleActivateTemplate(template.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Restore Template
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Generated Reports Tab */}
        <TabsContent value="generated">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>View and share reports generated from your templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Report</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Template</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Format</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Generated</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Shared With</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReports.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-muted-foreground">
                          No reports have been generated yet
                        </td>
                      </tr>
                    ) : (
                      generatedReports.map((report) => (
                        <tr key={report.id} className="border-t hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{report.templateName}</div>
                            {report.projectName && (
                              <div className="text-xs text-muted-foreground">{report.projectName}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            {report.templateName}
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <Badge variant="outline">
                              {report.format.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div>{formatDate(report.generatedAt)}</div>
                            <div className="text-xs text-muted-foreground">{report.generatedBy}</div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {report.recipients && report.recipients.length > 0 ? (
                              <div className="flex flex-col text-sm">
                                <div className="flex -space-x-2">
                                  {report.recipients.slice(0, 3).map((recipient, idx) => {
                                    const member = teamMembers.find(m => m.id === recipient.id)
                                    return (
                                      <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={member?.avatar} alt={recipient.name} />
                                        <AvatarFallback>{recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                    )
                                  })}
                                  {report.recipients.length > 3 && (
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
                                      +{report.recipients.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not shared</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download ({report.size})
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedReport(report)
                                    setShareForm({
                                      recipients: report.recipients?.map(r => r.id) || [],
                                      message: ""
                                    })
                                    setShareDialogOpen(true)
                                  }}>
                                    <Send className="mr-2 h-4 w-4" />
                                    {report.recipients && report.recipients.length > 0 ? "Share Again" : "Share"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Sharing Link
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Report
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTemplates.filter(t => t.schedule && t.status === "active").map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedTemplate(template)
                          
                          // Set default schedule based on template
                          setSchedule({
                            frequency: template.schedule?.frequency || "weekly",
                            day: template.schedule?.day || "monday",
                            time: template.schedule?.time || "09:00",
                            recipients: template.recipients?.map(r => r.id) || []
                          })
                          
                          setScheduleDialogOpen(true)
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGenerateReport(template)}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Generate Now
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedTemplate(template)
                          
                          // Set manual schedule
                          setSchedule({
                            frequency: "manual",
                            day: "",
                            time: "",
                            recipients: []
                          })
                          
                          setScheduleDialogOpen(true)
                        }}>
                          <Clock4 className="mr-2 h-4 w-4" />
                          Unschedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="py-2">
                  <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="font-medium">Frequency: </span>
                        {template.schedule?.frequency ? template.schedule.frequency.charAt(0).toUpperCase() + template.schedule.frequency.slice(1) : ''}
                        {template.schedule?.frequency === "weekly" || template.schedule?.frequency === "biweekly" ? 
                          ` (${template.schedule.day ? (template.schedule.day.charAt(0).toUpperCase() + template.schedule.day.slice(1)) : ''}s)` : 
                          template.schedule?.frequency === "monthly" ?
                          ` (Day ${template.schedule.day || ''})` : ''
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="font-medium">Time: </span>
                        {template.schedule?.time}
                      </div>
                    </div>
                    
                    {template.schedule?.nextScheduled && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div className="text-sm">
                          <span className="font-medium">Next Run: </span>
                          {formatDateTime(template.schedule.nextScheduled)}
                        </div>
                      </div>
                    )}
                    
                    {template.recipients && template.recipients.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <div className="text-sm font-medium mb-1">Recipients:</div>
                          <div className="flex flex-wrap gap-2">
                            {template.recipients.map((recipient) => (
                              <div key={recipient.id} className="flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={teamMembers.find(m => m.id === recipient.id)?.avatar} alt={recipient.name} />
                                  <AvatarFallback>{recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span>{recipient.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {template.lastGenerated && (
                      <div className="text-xs text-muted-foreground">
                        Last generated: {formatDateTime(template.lastGenerated)}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <div className="w-full flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedTemplate(template)
                      
                      // Set manual schedule
                      setSchedule({
                        frequency: "manual",
                        day: "",
                        time: "",
                        recipients: []
                      })
                      
                      setScheduleDialogOpen(true)
                    }}>
                      Unschedule
                    </Button>
                    
                    <Button size="sm" onClick={() => handleGenerateReport(template)}>
                      <FileDown className="mr-1 h-3 w-3" />
                      Generate Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {reportTemplates.filter(t => t.schedule && t.status === "active").length === 0 && (
              <Card className="col-span-1 md:col-span-3">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Scheduled Reports</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't scheduled any reports yet
                  </p>
                  <Button onClick={() => setCreateTemplateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {schedule.frequency === "manual" ? "Unschedule Report" : "Schedule Report"}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name}
              {schedule.frequency !== "manual" && " - Set the frequency and recipients for this report"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {schedule.frequency !== "manual" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={schedule.frequency}
                    onValueChange={(value) => setSchedule({ ...schedule, frequency: value })}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="manual">Manual Only (Unschedule)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(schedule.frequency === "weekly" || schedule.frequency === "biweekly") && (
                  <div className="grid gap-2">
                    <Label htmlFor="day">Day of Week</Label>
                    <Select
                      value={schedule.day}
                      onValueChange={(value) => setSchedule({ ...schedule, day: value })}
                    >
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {schedule.frequency === "monthly" && (
                  <div className="grid gap-2">
                    <Label htmlFor="day">Day of Month</Label>
                    <Select
                      value={schedule.day}
                      onValueChange={(value) => setSchedule({ ...schedule, day: value })}
                    >
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={schedule.time}
                    onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2 mb-2">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={schedule.recipients.includes(member.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSchedule({ 
                                ...schedule, 
                                recipients: [...schedule.recipients, member.id] 
                              })
                            } else {
                              setSchedule({ 
                                ...schedule, 
                                recipients: schedule.recipients.filter(id => id !== member.id) 
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-950 rounded-md p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-100">
                      Unschedule Report
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                      This will remove the automated schedule for this report. You can still generate it manually when needed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleScheduleReport}>
              {schedule.frequency === "manual" ? "Unschedule" : "Save Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Report Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              {selectedReport?.templateName}
              {selectedReport?.projectName && ` - ${selectedReport.projectName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipients">Recipients</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id={`share-${member.id}`}
                      checked={shareForm.recipients.includes(member.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setShareForm({ 
                            ...shareForm, 
                            recipients: [...shareForm.recipients, member.id] 
                          })
                        } else {
                          setShareForm({ 
                            ...shareForm, 
                            recipients: shareForm.recipients.filter(id => id !== member.id) 
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`share-${member.id}`} className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Include a message with the report..."
                rows={3}
                value={shareForm.message}
                onChange={(e) => setShareForm({ ...shareForm, message: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleShareReport}>
              <Send className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AutomatedReporting