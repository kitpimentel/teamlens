import { useState } from 'react'
import {
  Search,
  HelpCircle,
  FileText,
  Users,
  Settings,
  Calendar,
  MessageSquare,
  Bell,
  Laptop,
  Bug,
  Mail,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Define types for help center data
interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastUpdated: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface TutorialStep {
  title: string
  description: string
}

interface Tutorial {
  id: string
  title: string
  description: string
  category: string
  steps: TutorialStep[]
  videoUrl?: string
}

/**
 * Help Center Page Component
 * 
 * Provides users with documentation, tutorials, FAQs, and support resources.
 */
const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Mock data for help articles
  const helpArticles: HelpArticle[] = [
    {
      id: 'article-1',
      title: 'Getting Started with Team Lens',
      content: 'Learn the basics of Team Lens and how to set up your workspace for success.',
      category: 'getting-started',
      tags: ['beginner', 'setup', 'onboarding'],
      lastUpdated: '2025-03-15'
    },
    {
      id: 'article-2',
      title: 'Managing Projects and Teams',
      content: 'Discover how to create and manage projects, assign team members, and track progress.',
      category: 'projects',
      tags: ['projects', 'teams', 'management'],
      lastUpdated: '2025-03-10'
    },
    {
      id: 'article-3',
      title: 'Integrating with External Tools',
      content: 'Learn how to connect Team Lens with your existing tools like JIRA, ClickUp, and more.',
      category: 'integrations',
      tags: ['integrations', 'jira', 'clickup', 'asana'],
      lastUpdated: '2025-03-05'
    },
    {
      id: 'article-4',
      title: 'Understanding Reports and Analytics',
      content: 'Get insights into how to use the reporting and analytics features to track project performance.',
      category: 'reports',
      tags: ['reports', 'analytics', 'dashboards'],
      lastUpdated: '2025-02-28'
    },
    {
      id: 'article-5',
      title: 'Customizing Your Workspace',
      content: 'Personalize your Team Lens experience with custom settings and preferences.',
      category: 'settings',
      tags: ['customization', 'settings', 'preferences'],
      lastUpdated: '2025-02-20'
    },
    {
      id: 'article-6',
      title: 'Using the Chat System',
      content: 'Learn how to effectively use the built-in chat system for team and client communication.',
      category: 'communication',
      tags: ['chat', 'communication', 'messaging'],
      lastUpdated: '2025-02-15'
    }
  ]
  
  // Mock data for FAQs
  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click on the "Forgot Password" link. Enter your email address, and you will receive instructions to reset your password.',
      category: 'account'
    },
    {
      id: 'faq-2',
      question: 'Can I invite clients to specific projects only?',
      answer: 'Yes, you can invite clients to specific projects. When sending an invitation, you can select which projects the client will have access to. Clients will only see the projects they have been granted access to.',
      category: 'projects'
    },
    {
      id: 'faq-3',
      question: 'How do I connect Team Lens with JIRA?',
      answer: 'To connect Team Lens with JIRA, go to the Integrations page, select JIRA from the list of available integrations, and follow the authentication steps. You will need to provide your JIRA API credentials.',
      category: 'integrations'
    },
    {
      id: 'faq-4',
      question: 'Can I export reports to PDF or Excel?',
      answer: 'Yes, all reports in Team Lens can be exported to PDF, Excel, or CSV formats. Look for the export button in the top-right corner of any report page.',
      category: 'reports'
    },
    {
      id: 'faq-5',
      question: 'How do I enable dark mode?',
      answer: 'To enable dark mode, go to your profile settings and select "Appearance". From there, you can choose between light mode, dark mode, or system default.',
      category: 'settings'
    },
    {
      id: 'faq-6',
      question: 'Is there a mobile app for Team Lens?',
      answer: 'Yes, Team Lens offers mobile apps for both iOS and Android. You can download them from the App Store or Google Play Store.',
      category: 'general'
    },
    {
      id: 'faq-7',
      question: 'How do I set up two-factor authentication?',
      answer: 'To set up two-factor authentication, go to your Profile Settings, navigate to the Security tab, and click on "Enable" next to Two-Factor Authentication. Follow the instructions to complete the setup.',
      category: 'account'
    },
    {
      id: 'faq-8',
      question: 'Can I customize notification settings?',
      answer: 'Yes, you can customize your notification preferences. Go to your Profile Settings, navigate to the Notifications tab, and choose which notifications you want to receive and how you want to receive them.',
      category: 'settings'
    }
  ]
  
  // Mock data for tutorials
  const tutorials: Tutorial[] = [
    {
      id: 'tutorial-1',
      title: 'Setting Up Your First Project',
      description: 'Learn how to create and configure your first project in Team Lens.',
      category: 'getting-started',
      steps: [
        {
          title: 'Create a new project',
          description: 'Navigate to the Projects page and click on the "New Project" button. Enter the project name, description, and select a template if needed.'
        },
        {
          title: 'Configure project settings',
          description: 'Set up project-specific settings such as start and end dates, priority, and project owner.'
        },
        {
          title: 'Add team members',
          description: 'Invite team members to join the project by clicking on the "Team" tab and then "Add Member".'
        },
        {
          title: 'Set up milestones',
          description: 'Create project milestones to track key deliverables and deadlines.'
        },
        {
          title: 'Integrate with external tools',
          description: 'Connect your project with external tools like JIRA, ClickUp, or Asana if needed.'
        }
      ]
    },
    {
      id: 'tutorial-2',
      title: 'Creating and Assigning Tasks',
      description: 'Learn how to create tasks and assign them to team members.',
      category: 'projects',
      steps: [
        {
          title: 'Navigate to tasks',
          description: 'Go to your project and select the "Tasks" tab to view all project tasks.'
        },
        {
          title: 'Create a new task',
          description: 'Click on the "New Task" button and fill in the task details, including title, description, and due date.'
        },
        {
          title: 'Assign the task',
          description: 'Select a team member from the dropdown to assign the task to them.'
        },
        {
          title: 'Set task priority',
          description: 'Choose the appropriate priority level for the task.'
        },
        {
          title: 'Add task dependencies',
          description: 'If applicable, set up dependencies between tasks to establish the correct workflow.'
        }
      ]
    },
    {
      id: 'tutorial-3',
      title: 'Generating Reports',
      description: 'Learn how to create and customize reports for your projects.',
      category: 'reports',
      steps: [
        {
          title: 'Access the reports section',
          description: 'Navigate to the Reports page from the main navigation menu.'
        },
        {
          title: 'Select report type',
          description: 'Choose the type of report you want to generate, such as Project Status, Team Performance, or Budget vs. Actual.'
        },
        {
          title: 'Configure report parameters',
          description: 'Set the date range, projects to include, and other filtering options.'
        },
        {
          title: 'Customize visualizations',
          description: 'Select the charts and graphs that best represent your data.'
        },
        {
          title: 'Save and share',
          description: 'Save the report configuration for future use and share it with stakeholders.'
        }
      ],
      videoUrl: 'https://example.com/videos/generating-reports'
    }
  ]
  
  // Filter articles based on search query and category
  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  // Filter FAQs based on search query and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  // Filter tutorials based on search query and category
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.steps.some(step => 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        step.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started':
        return <HelpCircle className="h-5 w-5" />
      case 'projects':
        return <FileText className="h-5 w-5" />
      case 'integrations':
        return <Laptop className="h-5 w-5" />
      case 'reports':
        return <FileText className="h-5 w-5" />
      case 'settings':
        return <Settings className="h-5 w-5" />
      case 'communication':
        return <MessageSquare className="h-5 w-5" />
      case 'account':
        return <Users className="h-5 w-5" />
      case 'general':
        return <HelpCircle className="h-5 w-5" />
      default:
        return <HelpCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Help Center</h1>
        <p className="text-muted-foreground mb-6">
          Find answers, tutorials, and resources to help you get the most out of Team Lens
        </p>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help articles, tutorials, and FAQs..."
            className="pl-10 py-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Browse our detailed documentation
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Tutorials</h3>
            <p className="text-sm text-muted-foreground">
              Step-by-step guides and videos
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Community</h3>
            <p className="text-sm text-muted-foreground">
              Join the Team Lens community
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Support</h3>
            <p className="text-sm text-muted-foreground">
              Contact our support team
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter By Category */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge 
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </Badge>
        <Badge 
          variant={selectedCategory === 'getting-started' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('getting-started')}
        >
          Getting Started
        </Badge>
        <Badge 
          variant={selectedCategory === 'projects' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('projects')}
        >
          Projects
        </Badge>
        <Badge 
          variant={selectedCategory === 'integrations' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('integrations')}
        >
          Integrations
        </Badge>
        <Badge 
          variant={selectedCategory === 'reports' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('reports')}
        >
          Reports
        </Badge>
        <Badge 
          variant={selectedCategory === 'settings' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('settings')}
        >
          Settings
        </Badge>
        <Badge 
          variant={selectedCategory === 'communication' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('communication')}
        >
          Communication
        </Badge>
        <Badge 
          variant={selectedCategory === 'account' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('account')}
        >
          Account
        </Badge>
      </div>
      
      {/* Help Content Tabs */}
      <Tabs defaultValue="articles" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Articles Tab */}
        <TabsContent value="articles">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => (
                <Card key={article.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(article.category)}
                      <Badge variant="outline" className="capitalize">
                        {article.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{article.content}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(article.lastUpdated)}
                    </p>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      Read More
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto rounded-full bg-accent w-16 h-16 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or category filters
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Tutorials Tab */}
        <TabsContent value="tutorials">
          {filteredTutorials.length > 0 ? (
            <div className="space-y-6">
              {filteredTutorials.map(tutorial => (
                <Card key={tutorial.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5" />
                      <Badge variant="outline" className="capitalize">
                        {tutorial.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardTitle>{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="steps">
                        <AccordionTrigger>
                          View Step-by-Step Tutorial
                        </AccordionTrigger>
                        <AccordionContent>
                          <ol className="space-y-4 mt-2">
                            {tutorial.steps.map((step, index) => (
                              <li key={index} className="border-l-2 border-primary pl-4 py-1">
                                <h4 className="font-medium">Step {index + 1}: {step.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                              </li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {tutorial.videoUrl ? (
                      <Button variant="outline" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Watch Video Tutorial
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    <Button>
                      Start Tutorial
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto rounded-full bg-accent w-16 h-16 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tutorials found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or category filters
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faqs">
          {filteredFAQs.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about Team Lens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map(faq => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3 text-left">
                          <Badge variant="outline" className="capitalize">
                            {faq.category}
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground pl-1 border-l-2 border-primary">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto rounded-full bg-accent w-16 h-16 flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No FAQs found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or category filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Contact Support */}
      <Card className="mt-8 bg-accent/50">
        <CardHeader>
          <CardTitle className="text-center">Need More Help?</CardTitle>
          <CardDescription className="text-center">
            Contact our support team if you couldn't find what you were looking for
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Live Chat
          </Button>
          <Button className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Support
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Report a Bug
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Support hours: Monday - Friday, 9:00 AM - 6:00 PM ET
        </CardFooter>
      </Card>
    </div>
  )
}

export default HelpCenter