import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/context/ThemeContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Moon,
  Sun,
  Laptop,
  FileText,
  Copy,
  Trash,
  Upload
} from "lucide-react"

/**
 * Form schema for organization profile
 */
const organizationFormSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters."),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  industry: z.string().min(1, "Please select an industry"),
  size: z.string().min(1, "Please select a company size"),
  timezone: z.string().min(1, "Please select a timezone"),
  logo: z.instanceof(File).optional().or(z.string().optional()),
  contactEmail: z.string().email("Please enter a valid email").or(z.string().length(0)),
  contactPhone: z.string().optional(),
})

/**
 * Form schema for notification settings
 */
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  projectUpdates: z.boolean(),
  taskAssignments: z.boolean(),
  teamChanges: z.boolean(),
  deadlineReminders: z.boolean(),
  dailyDigest: z.boolean(),
  weeklyReport: z.boolean(),
})

/**
 * Form schema for security settings
 */
const securitySchema = z.object({
  twoFactorAuth: z.boolean(),
  passwordExpiry: z.string(),
  sessionTimeout: z.string(),
  allowFileSharing: z.boolean(),
  allowExternalLinks: z.boolean(),
  loginAttempts: z.string(),
})

/**
 * Form schema for appearance settings
 */
const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  colorScheme: z.string(),
  compactMode: z.boolean(),
  showAvatars: z.boolean(),
  animationsEnabled: z.boolean(),
})

/**
 * Settings component for Organization Admin
 */
const Settings = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isUploading, setIsUploading] = useState(false)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiKey, setApiKey] = useState("sk_org_1234567890abcdefghijklmn")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Organization form setup
  const organizationForm = useForm<z.infer<typeof organizationFormSchema>>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "Acme Corporation",
      description: "Leading provider of innovative solutions for businesses.",
      website: "https://acme-example.com",
      industry: "technology",
      size: "medium",
      timezone: "America/New_York",
      contactEmail: "contact@acme-example.com",
      contactPhone: "+1 (555) 123-4567",
    },
  })

  // Notification form setup
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      projectUpdates: true,
      taskAssignments: true,
      teamChanges: true,
      deadlineReminders: true,
      dailyDigest: false,
      weeklyReport: true,
    },
  })

  // Security form setup
  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      twoFactorAuth: false,
      passwordExpiry: "90days",
      sessionTimeout: "30min",
      allowFileSharing: true,
      allowExternalLinks: true,
      loginAttempts: "5",
    },
  })

  // Appearance form setup
  const appearanceForm = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: theme as "light" | "dark" | "system",
      colorScheme: "default",
      compactMode: false,
      showAvatars: true,
      animationsEnabled: true,
    },
  })

  /**
   * Handle organization profile form submission
   */
  const onSubmitOrganization = (data: z.infer<typeof organizationFormSchema>) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Organization settings updated:", data)
      toast.success("Organization settings updated successfully!")
      setIsSubmitting(false)
    }, 1000)
  }

  /**
   * Handle notification settings form submission
   */
  const onSubmitNotifications = (data: z.infer<typeof notificationSchema>) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Notification settings updated:", data)
      toast.success("Notification preferences updated successfully!")
      setIsSubmitting(false)
    }, 1000)
  }

  /**
   * Handle security settings form submission
   */
  const onSubmitSecurity = (data: z.infer<typeof securitySchema>) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Security settings updated:", data)
      toast.success("Security settings updated successfully!")
      setIsSubmitting(false)
    }, 1000)
  }

  /**
   * Handle appearance settings form submission
   */
  const onSubmitAppearance = (data: z.infer<typeof appearanceSchema>) => {
    setIsSubmitting(true)
    
    // Update theme from form data
    setTheme(data.theme)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Appearance settings updated:", data)
      toast.success("Appearance settings updated successfully!")
      setIsSubmitting(false)
    }, 1000)
  }

  /**
   * Handle logo file change
   */
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      organizationForm.setValue("logo", file)
      
      // Create a preview URL for the image
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewLogo(event.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Copy API key to clipboard
   */
  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast.success("API key copied to clipboard!")
  }

  /**
   * Regenerate API key
   */
  const regenerateApiKey = () => {
    // In a real application, this would make an API call to regenerate the key
    const newKey = "sk_org_" + Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    setApiKey(newKey)
    toast.success("API key regenerated successfully!")
  }

  /**
   * Delete organization (simulated)
   */
  const deleteOrganization = () => {
    // Simulate API call
    setTimeout(() => {
      toast.error("Organization deletion is disabled in the demo")
      setShowDeleteDialog(false)
    }, 1000)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization profile, preferences, security, and appearance settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Organization Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2">
            <Trash className="h-4 w-4" />
            <span>Danger Zone</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Organization Profile Tab */}
        <TabsContent value="profile">
          <Form {...organizationForm}>
            <form onSubmit={organizationForm.handleSubmit(onSubmitOrganization)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Profile</CardTitle>
                  <CardDescription>
                    Manage your organization details and information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        {previewLogo ? (
                          <div className="h-32 w-32 rounded-lg overflow-hidden">
                            <img 
                              src={previewLogo} 
                              alt="Organization Logo"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                            <Building className="h-16 w-16 text-muted-foreground/60" />
                          </div>
                        )}
                        <Input 
                          type="file" 
                          id="logo-upload" 
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                        <Label 
                          htmlFor="logo-upload"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground text-center max-w-[12rem]">
                        Upload a company logo (PNG, JPG, SVG, 1:1 ratio recommended)
                      </p>
                    </div>

                    <div className="flex-1 grid gap-4 md:grid-cols-2">
                      <FormField
                        control={organizationForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter organization name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={organizationForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={organizationForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief description of your organization" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={organizationForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={organizationForm.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="small">1-50 employees</SelectItem>
                              <SelectItem value="medium">51-200 employees</SelectItem>
                              <SelectItem value="large">201-1000 employees</SelectItem>
                              <SelectItem value="enterprise">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={organizationForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                              <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col space-y-4">
                      <FormField
                        control={organizationForm.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={organizationForm.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage which notifications you and your team members receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">General Notifications</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notification emails for important updates
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Project Notifications</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={notificationForm.control}
                        name="projectUpdates"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Project Updates</FormLabel>
                              <FormDescription>
                                Notify when project details change
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="taskAssignments"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Task Assignments</FormLabel>
                              <FormDescription>
                                Notify when tasks are assigned
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="teamChanges"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Team Changes</FormLabel>
                              <FormDescription>
                                Notify when team members change
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="deadlineReminders"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Deadline Reminders</FormLabel>
                              <FormDescription>
                                Send reminders before deadlines
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Summary Reports</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={notificationForm.control}
                        name="dailyDigest"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Daily Digest</FormLabel>
                              <FormDescription>
                                Receive daily summary of activities
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="weeklyReport"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Weekly Report</FormLabel>
                              <FormDescription>
                                Receive weekly project progress report
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Form {...securityForm}>
            <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security settings for your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Authentication</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={securityForm.control}
                        name="twoFactorAuth"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                              <FormDescription>
                                Require two-factor authentication for all users
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="passwordExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password Expiry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select password expiry period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="never">Never</SelectItem>
                                <SelectItem value="30days">30 Days</SelectItem>
                                <SelectItem value="60days">60 Days</SelectItem>
                                <SelectItem value="90days">90 Days</SelectItem>
                                <SelectItem value="180days">180 Days</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often users must change their password
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="loginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Failed Login Attempts</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select maximum login attempts" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3">3 Attempts</SelectItem>
                                <SelectItem value="5">5 Attempts</SelectItem>
                                <SelectItem value="10">10 Attempts</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Number of failed login attempts before account lockout
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Security</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select session timeout" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="15min">15 Minutes</SelectItem>
                                <SelectItem value="30min">30 Minutes</SelectItem>
                                <SelectItem value="1hour">1 Hour</SelectItem>
                                <SelectItem value="4hours">4 Hours</SelectItem>
                                <SelectItem value="8hours">8 Hours</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How long until inactive sessions are automatically logged out
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Content Security</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={securityForm.control}
                        name="allowFileSharing"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">File Sharing</FormLabel>
                              <FormDescription>
                                Allow users to share files with clients
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="allowExternalLinks"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">External Links</FormLabel>
                              <FormDescription>
                                Allow external links in chat and comments
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Security Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Form {...appearanceForm}>
            <form onSubmit={appearanceForm.handleSubmit(onSubmitAppearance)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the appearance of Team Lens for your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <FormField
                      control={appearanceForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-3 gap-4">
                            <label
                              htmlFor="theme-light"
                              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                                field.value === "light" ? "border-primary" : "border-transparent"
                              }`}
                              onClick={() => field.onChange("light")}
                            >
                              <FormControl>
                                <input
                                  type="radio"
                                  id="theme-light"
                                  checked={field.value === "light"}
                                  className="sr-only"
                                  onChange={() => field.onChange("light")}
                                />
                              </FormControl>
                              <Sun className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <FormLabel className="text-base">Light</FormLabel>
                              </div>
                            </label>
                            <label
                              htmlFor="theme-dark"
                              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                                field.value === "dark" ? "border-primary" : "border-transparent"
                              }`}
                              onClick={() => field.onChange("dark")}
                            >
                              <FormControl>
                                <input
                                  type="radio"
                                  id="theme-dark"
                                  checked={field.value === "dark"}
                                  className="sr-only"
                                  onChange={() => field.onChange("dark")}
                                />
                              </FormControl>
                              <Moon className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <FormLabel className="text-base">Dark</FormLabel>
                              </div>
                            </label>
                            <label
                              htmlFor="theme-system"
                              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                                field.value === "system" ? "border-primary" : "border-transparent"
                              }`}
                              onClick={() => field.onChange("system")}
                            >
                              <FormControl>
                                <input
                                  type="radio"
                                  id="theme-system"
                                  checked={field.value === "system"}
                                  className="sr-only"
                                  onChange={() => field.onChange("system")}
                                />
                              </FormControl>
                              <Laptop className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <FormLabel className="text-base">System</FormLabel>
                              </div>
                            </label>
                          </div>
                          <FormDescription>
                            Select a theme preference for all users in your organization. System theme follows your device settings.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Interface Preferences</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={appearanceForm.control}
                        name="colorScheme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color Scheme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color scheme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The primary color scheme for the interface
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={appearanceForm.control}
                        name="compactMode"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Compact Mode</FormLabel>
                              <FormDescription>
                                Use a more compact layout to fit more content
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Options</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={appearanceForm.control}
                        name="showAvatars"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show Avatars</FormLabel>
                              <FormDescription>
                                Display user avatars throughout the interface
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={appearanceForm.control}
                        name="animationsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable Animations</FormLabel>
                              <FormDescription>
                                Use animations for transitions and feedback
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Appearance Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* API Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API keys and integrations for Team Lens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Use this API key to authenticate with the Team Lens API. Keep this key secure and do not share it publicly.
                </p>
                
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Input 
                      value={apiKey} 
                      readOnly 
                      className="pr-24 font-mono text-sm" 
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      onClick={copyApiKey}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <Button variant="outline" onClick={regenerateApiKey}>
                    Regenerate
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our API documentation to integrate Team Lens with your existing tools and workflows.
                </p>
                
                <Button variant="outline">
                  View API Documentation
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Configure webhooks to receive real-time updates about events in your Team Lens instance.
                </p>
                
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-muted px-4 py-3 flex items-center justify-between">
                    <h4 className="font-medium">Active Webhooks</h4>
                    <Button variant="outline" size="sm">
                      Add Webhook
                    </Button>
                  </div>
                  
                  <div className="p-4 text-center text-muted-foreground">
                    No webhooks configured yet.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Danger Zone Tab */}
        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                These actions are destructive and cannot be undone. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-destructive/20 p-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Reset Organization Data</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This will permanently delete all projects, tasks, and other data from your organization. Users and settings will be preserved.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="destructive" onClick={() => toast.error("This action is disabled in the demo")}>
                      Reset Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-destructive/20 p-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Delete Organization</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This will permanently delete your organization, all associated data, users, and settings. This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Organization</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your organization and all associated data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={deleteOrganization}
                          >
                            Delete Organization
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings