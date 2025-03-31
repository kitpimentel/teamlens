import { useState, useEffect } from 'react'
import { 
  Plus, 
  Filter, 
  Search, 
  Check, 
  AlertCircle, 
  FileText,
  MessagesSquare,
  Send
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription,  
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from 'sonner'

// Define types for data
interface Feedback {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: 'Submitted' | 'Acknowledged' | 'In Progress' | 'Implemented' | 'Declined';
  priority: 'Low' | 'Medium' | 'High';
  submittedBy: string;
  submittedDate: string;
  responseDate?: string;
  response?: string;
  category: 'Suggestion' | 'Issue' | 'Question' | 'Other';
}

interface Request {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  type: 'Feature' | 'Change' | 'Resource' | 'Access' | 'Other';
  submittedDate: string;
  approvedDate?: string;
  completedDate?: string;
  estimatedCompletion?: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  itemId: string; // ID of feedback or request
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

/**
 * Feedback & Requests Page Component
 * 
 * Allows clients to submit feedback, suggestions, and requests for their projects.
 * Also provides a way to track the status of submitted items.
 */
const FeedbackRequests = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const [newFeedbackTitle, setNewFeedbackTitle] = useState<string>('')
  const [newFeedbackDescription, setNewFeedbackDescription] = useState<string>('')
  const [newFeedbackProject, setNewFeedbackProject] = useState<string>('')
  const [newFeedbackCategory, setNewFeedbackCategory] = useState<string>('Suggestion')
  const [newFeedbackPriority, setNewFeedbackPriority] = useState<string>('Medium')
  
  const [newRequestTitle, setNewRequestTitle] = useState<string>('')
  const [newRequestDescription, setNewRequestDescription] = useState<string>('')
  const [newRequestProject, setNewRequestProject] = useState<string>('')
  const [newRequestType, setNewRequestType] = useState<string>('Feature')
  const [newRequestPriority, setNewRequestPriority] = useState<string>('Medium')
  
  const [newComment, setNewComment] = useState<string>('')
  const [activeItemId, setActiveItemId] = useState<string>('')
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isAddFeedbackOpen, setIsAddFeedbackOpen] = useState<boolean>(false)
  const [isAddRequestOpen, setIsAddRequestOpen] = useState<boolean>(false)

  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for projects
        const mockProjects: ProjectOption[] = [
          { id: 'proj-1', name: 'Website Redesign' },
          { id: 'proj-2', name: 'Mobile App Development' },
          { id: 'proj-3', name: 'Content Creation' },
        ]
        
        // Mock data for feedback
        const mockFeedback: Feedback[] = [
          {
            id: 'feedback-1',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Improve navigation on mobile devices',
            description: 'The navigation menu is difficult to use on mobile devices. It would be better if it was simplified for smaller screens.',
            status: 'In Progress',
            priority: 'High',
            submittedBy: 'Client User',
            submittedDate: '2025-03-15T10:30:00Z',
            responseDate: '2025-03-16T14:45:00Z',
            response: 'Thank you for your feedback. We agree that the mobile navigation needs improvement. Our UX team is currently working on a new design that should address these issues.',
            category: 'Suggestion'
          },
          {
            id: 'feedback-2',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Add dark mode support',
            description: 'It would be great if the website supported dark mode for better viewing experience in low-light environments.',
            status: 'Acknowledged',
            priority: 'Medium',
            submittedBy: 'Client User',
            submittedDate: '2025-03-20T09:15:00Z',
            responseDate: '2025-03-20T16:30:00Z',
            response: 'We appreciate your suggestion. We will consider adding dark mode support in a future update.',
            category: 'Suggestion'
          },
          {
            id: 'feedback-3',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Login process is confusing',
            description: 'The login process has too many steps and is confusing for users. Please simplify it.',
            status: 'Submitted',
            priority: 'High',
            submittedBy: 'Client User',
            submittedDate: '2025-03-25T11:45:00Z',
            category: 'Issue'
          },
          {
            id: 'feedback-4',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Battery usage concerns',
            description: 'The app seems to drain battery quickly even when running in the background. Can this be optimized?',
            status: 'Implemented',
            priority: 'High',
            submittedBy: 'Client User',
            submittedDate: '2025-03-10T14:20:00Z',
            responseDate: '2025-03-12T10:00:00Z',
            response: 'Weve identified and fixed the battery drain issue. The update will be included in the next release, scheduled for next week.',
            category: 'Issue'
          },
          {
            id: 'feedback-5',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            title: 'More video content needed',
            description: 'Our audience engages more with video content. Can we shift focus to create more videos instead of blog posts?',
            status: 'Acknowledged',
            priority: 'Medium',
            submittedBy: 'Client User',
            submittedDate: '2025-03-18T13:10:00Z',
            responseDate: '2025-03-19T09:45:00Z',
            response: 'Were evaluating this request and will discuss options during our next strategy meeting.',
            category: 'Suggestion'
          },
        ]
        
        // Mock data for requests
        const mockRequests: Request[] = [
          {
            id: 'request-1',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Add e-commerce functionality',
            description: 'We would like to add basic e-commerce functionality to the website to sell our new product line.',
            status: 'Approved',
            priority: 'High',
            type: 'Feature',
            submittedDate: '2025-03-05T11:30:00Z',
            approvedDate: '2025-03-08T14:20:00Z',
            estimatedCompletion: '2025-04-15'
          },
          {
            id: 'request-2',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            title: 'Change color scheme',
            description: 'We would like to update the color scheme to match our new branding guidelines.',
            status: 'Completed',
            priority: 'Medium',
            type: 'Change',
            submittedDate: '2025-03-10T09:45:00Z',
            approvedDate: '2025-03-11T13:15:00Z',
            completedDate: '2025-03-18T15:30:00Z'
          },
          {
            id: 'request-3',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Add social media integration',
            description: 'We would like to add social media sharing functionality to the app.',
            status: 'Pending',
            priority: 'Medium',
            type: 'Feature',
            submittedDate: '2025-03-22T10:15:00Z'
          },
          {
            id: 'request-4',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            title: 'Additional QA resources',
            description: 'Request for additional QA resources to expedite testing before launch.',
            status: 'Rejected',
            priority: 'Urgent',
            type: 'Resource',
            submittedDate: '2025-03-15T13:40:00Z'
          },
          {
            id: 'request-5',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            title: 'Localization for Spanish market',
            description: 'Request to create localized content for the Spanish market.',
            status: 'In Progress',
            priority: 'High',
            type: 'Feature',
            submittedDate: '2025-03-12T11:20:00Z',
            approvedDate: '2025-03-14T10:10:00Z',
            estimatedCompletion: '2025-04-10'
          },
        ]
        
        // Mock data for comments
        const mockComments: Comment[] = [
          {
            id: 'comment-1',
            itemId: 'feedback-1',
            author: {
              id: 'user-1',
              name: 'Alex Johnson',
              avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff'
            },
            content: 'Weve started working on the mobile navigation redesign. Ill share some preliminary mockups by tomorrow.',
            timestamp: '2025-03-17T09:45:00Z'
          },
          {
            id: 'comment-2',
            itemId: 'feedback-1',
            author: {
              id: 'user-2',
              name: 'Client User',
              avatar: 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff'
            },
            content: 'Great! Looking forward to seeing the mockups.',
            timestamp: '2025-03-17T10:30:00Z'
          },
          {
            id: 'comment-3',
            itemId: 'request-1',
            author: {
              id: 'user-3',
              name: 'Sam Taylor',
              avatar: 'https://ui-avatars.com/api/?name=Sam+Taylor&background=10b981&color=fff'
            },
            content: 'Well need to discuss the payment gateway options. Do you have any preferences',
            timestamp: '2025-03-09T13:15:00Z'
          },
          {
            id: 'comment-4',
            itemId: 'request-1',
            author: {
              id: 'user-2',
              name: 'Client User',
              avatar: 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff'
            },
            content: 'Wed prefer to use Stripe if possible.',
            timestamp: '2025-03-09T14:20:00Z'
          },
        ]
        
        setProjects(mockProjects)
        setFeedback(mockFeedback)
        setRequests(mockRequests)
        setComments(mockComments)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Helper function to filter feedback based on selected options
  const filteredFeedback = feedback.filter(item => {
    const matchesProject = selectedProject === 'all' || item.projectId === selectedProject
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesStatus && matchesSearch
  })
  
  // Helper function to filter requests based on selected options
  const filteredRequests = requests.filter(item => {
    const matchesProject = selectedProject === 'all' || item.projectId === selectedProject
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesStatus && matchesSearch
  })
  
  // Helper function to get comments for a specific item
  const getCommentsForItem = (itemId: string) => {
    return comments.filter(comment => comment.itemId === itemId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }
  
  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    let className = ''
    
    switch (status.toLowerCase()) {
      case 'submitted':
      case 'pending':
        className = 'bg-blue-500 hover:bg-blue-600'
        break
      case 'acknowledged':
        className = 'bg-purple-500 hover:bg-purple-600'
        break
      case 'in progress':
        className = 'bg-amber-500 hover:bg-amber-600'
        break
      case 'implemented':
      case 'completed':
      case 'approved':
        className = 'bg-emerald-500 hover:bg-emerald-600'
        break
      case 'declined':
      case 'rejected':
        className = 'bg-red-500 hover:bg-red-600'
        break
      default:
        className = 'bg-slate-500 hover:bg-slate-600'
    }
    
    return <Badge className={className}>{status}</Badge>
  }
  
  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    let className = 'border '
    
    switch (priority.toLowerCase()) {
      case 'low':
        className += 'border-blue-500 text-blue-500'
        break
      case 'medium':
        className += 'border-amber-500 text-amber-500'
        break
      case 'high':
      case 'urgent':
        className += 'border-red-500 text-red-500'
        break
      default:
        className += 'border-slate-500 text-slate-500'
    }
    
    return <Badge variant="outline" className={className}>{priority}</Badge>
  }
  
  // Helper function to get category/type badge
  const getCategoryBadge = (category: string) => {
    let className = 'border '
    
    switch (category.toLowerCase()) {
      case 'suggestion':
      case 'feature':
        className += 'border-emerald-500 text-emerald-500'
        break
      case 'issue':
      case 'change':
        className += 'border-amber-500 text-amber-500'
        break
      case 'question':
      case 'resource':
      case 'access':
        className += 'border-blue-500 text-blue-500'
        break
      default:
        className += 'border-slate-500 text-slate-500'
    }
    
    return <Badge variant="outline" className={className}>{category}</Badge>
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Handle dialog cancellation
  const handleCancelDialog = (type: 'feedback' | 'request') => {
    if (type === 'feedback') {
      setNewFeedbackTitle('')
      setNewFeedbackDescription('')
      setNewFeedbackProject('')
      setNewFeedbackCategory('Suggestion')
      setNewFeedbackPriority('Medium')
      setIsAddFeedbackOpen(false)
    } else {
      setNewRequestTitle('')
      setNewRequestDescription('')
      setNewRequestProject('')
      setNewRequestType('Feature')
      setNewRequestPriority('Medium')
      setIsAddRequestOpen(false)
    }
  }
  
  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    try {
      setIsSubmitting(true)
      
      // Validate input
      if (!newFeedbackTitle.trim()) {
        toast.error('Please enter a title')
        return
      }
      
      if (!newFeedbackDescription.trim()) {
        toast.error('Please enter a description')
        return
      }
      
      if (!newFeedbackProject) {
        toast.error('Please select a project')
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Create new feedback item
      const projectObj = projects.find(p => p.id === newFeedbackProject)
      
      const newItem: Feedback = {
        id: `feedback-${Date.now()}`,
        projectId: newFeedbackProject,
        projectName: projectObj?.name || 'Unknown Project',
        title: newFeedbackTitle,
        description: newFeedbackDescription,
        status: 'Submitted',
        priority: newFeedbackPriority as 'Low' | 'Medium' | 'High',
        submittedBy: 'Client User',
        submittedDate: new Date().toISOString(),
        category: newFeedbackCategory as 'Suggestion' | 'Issue' | 'Question' | 'Other'
      }
      
      setFeedback([newItem, ...feedback])
      
      // Reset form
      setNewFeedbackTitle('')
      setNewFeedbackDescription('')
      setNewFeedbackProject('')
      setNewFeedbackCategory('Suggestion')
      setNewFeedbackPriority('Medium')
      setIsAddFeedbackOpen(false)
      
      toast.success('Feedback submitted successfully')
      
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle request submission
  const handleSubmitRequest = async () => {
    try {
      setIsSubmitting(true)
      
      // Validate input
      if (!newRequestTitle.trim()) {
        toast.error('Please enter a title')
        return
      }
      
      if (!newRequestDescription.trim()) {
        toast.error('Please enter a description')
        return
      }
      
      if (!newRequestProject) {
        toast.error('Please select a project')
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Create new request item
      const projectObj = projects.find(p => p.id === newRequestProject)
      
      const newItem: Request = {
        id: `request-${Date.now()}`,
        projectId: newRequestProject,
        projectName: projectObj?.name || 'Unknown Project',
        title: newRequestTitle,
        description: newRequestDescription,
        status: 'Pending',
        priority: newRequestPriority as 'Low' | 'Medium' | 'High' | 'Urgent',
        type: newRequestType as 'Feature' | 'Change' | 'Resource' | 'Access' | 'Other',
        submittedDate: new Date().toISOString()
      }
      
      setRequests([newItem, ...requests])
      
      // Reset form
      setNewRequestTitle('')
      setNewRequestDescription('')
      setNewRequestProject('')
      setNewRequestType('Feature')
      setNewRequestPriority('Medium')
      setIsAddRequestOpen(false)
      
      toast.success('Request submitted successfully')
      
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle comment submission
  const handleSubmitComment = async () => {
    try {
      if (!newComment.trim() || !activeItemId) {
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Create new comment
      const newCommentItem: Comment = {
        id: `comment-${Date.now()}`,
        itemId: activeItemId,
        author: {
          id: 'user-2',
          name: 'Client User',
          avatar: 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff'
        },
        content: newComment,
        timestamp: new Date().toISOString()
      }
      
      setComments([...comments, newCommentItem])
      setNewComment('')
      
      toast.success('Comment added')
      
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to submit comment. Please try again.')
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback & Requests</h1>
          <p className="text-muted-foreground">
            Submit and track feedback, suggestions, and change requests
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddFeedbackOpen} onOpenChange={setIsAddFeedbackOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Submit New Feedback</DialogTitle>
                <DialogDescription>
                  Share your suggestions, report issues, or ask questions about your projects.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feedback-project" className="text-right">
                    Project
                  </Label>
                  <Select 
                    value={newFeedbackProject} 
                    onValueChange={setNewFeedbackProject}
                  >
                    <SelectTrigger id="feedback-project" className="col-span-3">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feedback-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="feedback-title"
                    placeholder="Enter a clear title"
                    className="col-span-3"
                    value={newFeedbackTitle}
                    onChange={(e) => setNewFeedbackTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feedback-category" className="text-right">
                    Category
                  </Label>
                  <Select 
                    value={newFeedbackCategory} 
                    onValueChange={setNewFeedbackCategory}
                  >
                    <SelectTrigger id="feedback-category" className="col-span-3">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suggestion">Suggestion</SelectItem>
                      <SelectItem value="Issue">Issue</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feedback-priority" className="text-right">
                    Priority
                  </Label>
                  <Select 
                    value={newFeedbackPriority} 
                    onValueChange={setNewFeedbackPriority}
                  >
                    <SelectTrigger id="feedback-priority" className="col-span-3">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="feedback-description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="feedback-description"
                    placeholder="Provide detailed information about your feedback"
                    className="col-span-3"
                    rows={5}
                    value={newFeedbackDescription}
                    onChange={(e) => setNewFeedbackDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleCancelDialog('feedback')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddRequestOpen} onOpenChange={setIsAddRequestOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Submit New Request</DialogTitle>
                <DialogDescription>
                  Request new features, changes, or resources for your projects.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="request-project" className="text-right">
                    Project
                  </Label>
                  <Select 
                    value={newRequestProject} 
                    onValueChange={setNewRequestProject}
                  >
                    <SelectTrigger id="request-project" className="col-span-3">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="request-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="request-title"
                    placeholder="Enter a clear title"
                    className="col-span-3"
                    value={newRequestTitle}
                    onChange={(e) => setNewRequestTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="request-type" className="text-right">
                    Type
                  </Label>
                  <Select 
                    value={newRequestType} 
                    onValueChange={setNewRequestType}
                  >
                    <SelectTrigger id="request-type" className="col-span-3">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Feature">Feature</SelectItem>
                      <SelectItem value="Change">Change</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                      <SelectItem value="Access">Access</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="request-priority" className="text-right">
                    Priority
                  </Label>
                  <Select 
                    value={newRequestPriority} 
                    onValueChange={setNewRequestPriority}
                  >
                    <SelectTrigger id="request-priority" className="col-span-3">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="request-description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="request-description"
                    placeholder="Provide detailed information about your request"
                    className="col-span-3"
                    rows={5}
                    value={newRequestDescription}
                    onChange={(e) => setNewRequestDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleCancelDialog('request')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-project">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="filter-project">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Implemented">Implemented</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-items">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-items"
                  placeholder="Search by title or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="feedback" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feedback">
            <FileText className="h-4 w-4 mr-2" />
            Feedback & Suggestions
          </TabsTrigger>
          <TabsTrigger value="requests">
            <AlertCircle className="h-4 w-4 mr-2" />
            Change Requests
          </TabsTrigger>
        </TabsList>
        
        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Suggestions</CardTitle>
              <CardDescription>
                View and track your submitted feedback, suggestions, and issues
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredFeedback.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFeedback.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="px-6">
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex flex-col sm:flex-row sm:items-center w-full text-left gap-2">
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.projectName} • Submitted: {formatDate(item.submittedDate)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                            {getCategoryBadge(item.category)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="font-medium">Description</div>
                            <p className="text-sm">{item.description}</p>
                          </div>
                          
                          {item.response && (
                            <div className="space-y-2 rounded-md border p-4 bg-accent/20">
                              <div className="font-medium flex items-center">
                                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                                Response
                              </div>
                              <p className="text-sm">{item.response}</p>
                              {item.responseDate && (
                                <p className="text-xs text-muted-foreground">
                                  Responded on: {formatDate(item.responseDate)}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Comments Section */}
                          <div className="space-y-3 mt-6">
                            <div className="font-medium flex items-center">
                              <MessagesSquare className="h-4 w-4 mr-2" />
                              Discussion
                            </div>
                            
                            <div className="space-y-3">
                              {getCommentsForItem(item.id).map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-medium text-sm">{comment.author.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDate(comment.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {/* New Comment Form */}
                              <div className="flex gap-3 mt-4">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff" alt="Client User" />
                                  <AvatarFallback>CU</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    className="min-h-10"
                                    value={activeItemId === item.id ? newComment : ''}
                                    onChange={(e) => {
                                      setActiveItemId(item.id)
                                      setNewComment(e.target.value)
                                    }}
                                  />
                                  <div className="flex justify-end">
                                    <Button 
                                      size="sm" 
                                      disabled={activeItemId !== item.id || !newComment.trim()}
                                      onClick={handleSubmitComment}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No feedback found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || selectedProject !== 'all' || selectedStatus !== 'all' ? 
                      'Try adjusting your filters to see more results.' : 
                      'Submit new feedback to get started.'}
                  </p>
                  {!filteredFeedback.length && !feedback.length && (
                    <Button className="mt-4" onClick={() => setIsAddFeedbackOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Feedback
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Change Requests</CardTitle>
              <CardDescription>
                View and track your submitted change requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredRequests.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredRequests.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="px-6">
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex flex-col sm:flex-row sm:items-center w-full text-left gap-2">
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.projectName} • Submitted: {formatDate(item.submittedDate)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                            {getCategoryBadge(item.type)}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="font-medium">Description</div>
                            <p className="text-sm">{item.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {item.approvedDate && (
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Approved Date</div>
                                <div className="text-sm font-medium">{formatDate(item.approvedDate)}</div>
                              </div>
                            )}
                            
                            {item.estimatedCompletion && (
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Estimated Completion</div>
                                <div className="text-sm font-medium">{formatDate(item.estimatedCompletion)}</div>
                              </div>
                            )}
                            
                            {item.completedDate && (
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Completed Date</div>
                                <div className="text-sm font-medium">{formatDate(item.completedDate)}</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Comments Section */}
                          <div className="space-y-3 mt-6">
                            <div className="font-medium flex items-center">
                              <MessagesSquare className="h-4 w-4 mr-2" />
                              Discussion
                            </div>
                            
                            <div className="space-y-3">
                              {getCommentsForItem(item.id).map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-medium text-sm">{comment.author.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDate(comment.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {/* New Comment Form */}
                              <div className="flex gap-3 mt-4">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff" alt="Client User" />
                                  <AvatarFallback>CU</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    className="min-h-10"
                                    value={activeItemId === item.id ? newComment : ''}
                                    onChange={(e) => {
                                      setActiveItemId(item.id)
                                      setNewComment(e.target.value)
                                    }}
                                  />
                                  <div className="flex justify-end">
                                    <Button 
                                      size="sm" 
                                      disabled={activeItemId !== item.id || !newComment.trim()}
                                      onClick={handleSubmitComment}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No requests found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || selectedProject !== 'all' || selectedStatus !== 'all' ? 
                      'Try adjusting your filters to see more results.' : 
                      'Submit new change requests to get started.'}
                  </p>
                  {!filteredRequests.length && !requests.length && (
                    <Button className="mt-4" onClick={() => setIsAddRequestOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FeedbackRequests