import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { 
  Settings, 
  Shield, 
  Mail, 
  BellRing, 
  Database, 
  Lock, 
  Save,
  Cpu,
  Globe,
  FileKey,
  CalendarClock,
  Smartphone,
  Upload,
  FolderOpen,
  FileEdit
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'

/**
 * PlatformSettings component for Super Admin
 * Allows configuration of platform-wide settings
 */
const PlatformSettings: React.FC = () => {
  // State for general settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Team Lens',
    supportEmail: 'support@teamlens.com',
    contactNumber: '+1 (555) 123-4567',
    maxFileUploadSize: 25, // in MB
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    defaultLanguage: 'en',
    maintenanceMode: false,
    allowUserRegistration: true,
    allowPasswordReset: true,
  })
  
  // State for security settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30, // in minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: true,
    passwordExpiryDays: 90,
    twoFactorAuthDefault: 'optional',
    apiRateLimit: 100, // requests per minute
    allowConcurrentSessions: false,
  })
  
  // State for email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.teamlens.com',
    smtpPort: 587,
    smtpUsername: 'notifications@teamlens.com',
    smtpPassword: '********',
    emailFromName: 'Team Lens',
    emailFromAddress: 'notifications@teamlens.com',
    emailTemplateFooter: 'Team Lens - Your Project Management Hub',
    sendWelcomeEmail: true,
    sendPasswordResetEmail: true,
    sendInvitationEmails: true,
  })
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    taskAssignmentNotification: true,
    taskDueDateNotification: true,
    projectCreationNotification: true,
    mentionNotification: true,
    systemUpdatesNotification: true,
    marketingNotifications: false,
    notificationDigestFrequency: 'daily',
  })
  
  // State for storage settings
  const [storageSettings, setStorageSettings] = useState({
    storageProvider: 'aws',
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    maxStoragePerOrg: 10, // in GB
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv',
    compressUploads: true,
    scanUploadsForMalware: true,
  })
  
  // Handler for saving settings
  const handleSaveSettings = (settingType: string) => {
    // In a real app, this would call an API to save the settings
    // For now, just show success message
    toast.success(`${settingType} settings saved successfully`)
  }
  
  // Handler for general settings form
  const handleGeneralSettingChange = (field: string, value: any) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value
    })
  }
  
  // Handler for security settings form
  const handleSecuritySettingChange = (field: string, value: any) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    })
  }
  
  // Handler for email settings form
  const handleEmailSettingChange = (field: string, value: any) => {
    setEmailSettings({
      ...emailSettings,
      [field]: value
    })
  }
  
  // Handler for notification settings form
  const handleNotificationSettingChange = (field: string, value: any) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    })
  }
  
  // Handler for storage settings form
  const handleStorageSettingChange = (field: string, value: any) => {
    setStorageSettings({
      ...storageSettings,
      [field]: value
    })
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure platform-wide settings and defaults.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="flex items-center space-x-2 py-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2 py-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2 py-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 py-2">
            <BellRing className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center space-x-2 py-2">
            <Database className="h-4 w-4" />
            <span>Storage</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings and defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Platform Information
                </h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={generalSettings.platformName}
                      onChange={(e) => handleGeneralSettingChange('platformName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => handleGeneralSettingChange('supportEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={generalSettings.contactNumber}
                      onChange={(e) => handleGeneralSettingChange('contactNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                    <Input
                      id="maxFileUploadSize"
                      type="number"
                      min="1"
                      max="100"
                      value={generalSettings.maxFileUploadSize}
                      onChange={(e) => handleGeneralSettingChange('maxFileUploadSize', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Localization
                </h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select 
                      value={generalSettings.timezone} 
                      onValueChange={(value) => handleGeneralSettingChange('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select 
                      value={generalSettings.dateFormat} 
                      onValueChange={(value) => handleGeneralSettingChange('dateFormat', value)}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select 
                      value={generalSettings.timeFormat} 
                      onValueChange={(value) => handleGeneralSettingChange('timeFormat', value)}
                    >
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Select 
                      value={generalSettings.defaultLanguage} 
                      onValueChange={(value) => handleGeneralSettingChange('defaultLanguage', value)}
                    >
                      <SelectTrigger id="defaultLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <Cpu className="mr-2 h-5 w-5" />
                  System
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Put the site in maintenance mode for all users except super admins
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleGeneralSettingChange('maintenanceMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowUserRegistration">Allow User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to register without an invitation
                      </p>
                    </div>
                    <Switch
                      id="allowUserRegistration"
                      checked={generalSettings.allowUserRegistration}
                      onCheckedChange={(checked) => handleGeneralSettingChange('allowUserRegistration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowPasswordReset">Allow Password Reset</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to reset their passwords via email
                      </p>
                    </div>
                    <Switch
                      id="allowPasswordReset"
                      checked={generalSettings.allowPasswordReset}
                      onCheckedChange={(checked) => handleGeneralSettingChange('allowPasswordReset', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings('General')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Authentication
                </h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="480" // 8 hours
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Time before an inactive session is logged out
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of failed attempts before account is locked
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiryDays"
                      type="number"
                      min="30"
                      max="365"
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) => handleSecuritySettingChange('passwordExpiryDays', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before users need to change their password
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorAuthDefault">Two-Factor Authentication</Label>
                    <Select 
                      value={securitySettings.twoFactorAuthDefault} 
                      onValueChange={(value) => handleSecuritySettingChange('twoFactorAuthDefault', value)}
                    >
                      <SelectTrigger id="twoFactorAuthDefault">
                        <SelectValue placeholder="Select 2FA policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="required">Required</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Default two-factor authentication policy
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <FileKey className="mr-2 h-5 w-5" />
                  Password Policy
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Slider
                      id="passwordMinLength"
                      min={6}
                      max={16}
                      step={1}
                      value={[securitySettings.passwordMinLength]}
                      onValueChange={(value) => handleSecuritySettingChange('passwordMinLength', value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>6</span>
                      <span>Current: {securitySettings.passwordMinLength}</span>
                      <span>16</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="passwordRequireUppercase"
                        checked={securitySettings.passwordRequireUppercase}
                        onCheckedChange={(checked) => 
                          handleSecuritySettingChange('passwordRequireUppercase', checked === true)
                        }
                      />
                      <Label htmlFor="passwordRequireUppercase">
                        Require at least one uppercase letter
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="passwordRequireNumber"
                        checked={securitySettings.passwordRequireNumber}
                        onCheckedChange={(checked) => 
                          handleSecuritySettingChange('passwordRequireNumber', checked === true)
                        }
                      />
                      <Label htmlFor="passwordRequireNumber">
                        Require at least one number
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="passwordRequireSymbol"
                        checked={securitySettings.passwordRequireSymbol}
                        onCheckedChange={(checked) => 
                          handleSecuritySettingChange('passwordRequireSymbol', checked === true)
                        }
                      />
                      <Label htmlFor="passwordRequireSymbol">
                        Require at least one special character
                      </Label>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Sessions & API
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">API Rate Limit (requests per minute)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      min="10"
                      max="1000"
                      value={securitySettings.apiRateLimit}
                      onChange={(e) => handleSecuritySettingChange('apiRateLimit', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowConcurrentSessions">Allow Concurrent Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to be logged in on multiple devices simultaneously
                      </p>
                    </div>
                    <Switch
                      id="allowConcurrentSessions"
                      checked={securitySettings.allowConcurrentSessions}
                      onCheckedChange={(checked) => handleSecuritySettingChange('allowConcurrentSessions', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Security')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email server and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  SMTP Configuration
                </h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => handleEmailSettingChange('smtpHost', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => handleEmailSettingChange('smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => handleEmailSettingChange('smtpUsername', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => handleEmailSettingChange('smtpPassword', e.target.value)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <FileEdit className="mr-2 h-5 w-5" />
                  Email Templates
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailFromName">From Name</Label>
                      <Input
                        id="emailFromName"
                        value={emailSettings.emailFromName}
                        onChange={(e) => handleEmailSettingChange('emailFromName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailFromAddress">From Email Address</Label>
                      <Input
                        id="emailFromAddress"
                        type="email"
                        value={emailSettings.emailFromAddress}
                        onChange={(e) => handleEmailSettingChange('emailFromAddress', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailTemplateFooter">Email Template Footer</Label>
                    <Textarea
                      id="emailTemplateFooter"
                      value={emailSettings.emailTemplateFooter}
                      onChange={(e) => handleEmailSettingChange('emailTemplateFooter', e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      This text will appear at the bottom of all system emails
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <BellRing className="mr-2 h-5 w-5" />
                  Email Notifications
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sendWelcomeEmail">Welcome Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send welcome email to new users
                      </p>
                    </div>
                    <Switch
                      id="sendWelcomeEmail"
                      checked={emailSettings.sendWelcomeEmail}
                      onCheckedChange={(checked) => handleEmailSettingChange('sendWelcomeEmail', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sendPasswordResetEmail">Password Reset Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email for password reset requests
                      </p>
                    </div>
                    <Switch
                      id="sendPasswordResetEmail"
                      checked={emailSettings.sendPasswordResetEmail}
                      onCheckedChange={(checked) => handleEmailSettingChange('sendPasswordResetEmail', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sendInvitationEmails">Invitation Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email invitations to new users
                      </p>
                    </div>
                    <Switch
                      id="sendInvitationEmails"
                      checked={emailSettings.sendInvitationEmails}
                      onCheckedChange={(checked) => handleEmailSettingChange('sendInvitationEmails', checked)}
                    />
                  </div>
                  
                  {/* Add email test button */}
                  <Button 
                    variant="outline"
                    onClick={() => toast.success('Test email sent successfully')}
                    className="mt-2"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Email')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure notification preferences and defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <BellRing className="mr-2 h-5 w-5" />
                  General Notification Settings
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable email notifications platform-wide
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable in-app notifications platform-wide
                      </p>
                    </div>
                    <Switch
                      id="inAppNotifications"
                      checked={notificationSettings.inAppNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('inAppNotifications', checked)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <FileEdit className="mr-2 h-5 w-5" />
                  Notification Types
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="taskAssignmentNotification">Task Assignment</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify users when they are assigned a task
                      </p>
                    </div>
                    <Switch
                      id="taskAssignmentNotification"
                      checked={notificationSettings.taskAssignmentNotification}
                      onCheckedChange={(checked) => handleNotificationSettingChange('taskAssignmentNotification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="taskDueDateNotification">Task Due Date</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify users about upcoming task deadlines
                      </p>
                    </div>
                    <Switch
                      id="taskDueDateNotification"
                      checked={notificationSettings.taskDueDateNotification}
                      onCheckedChange={(checked) => handleNotificationSettingChange('taskDueDateNotification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="projectCreationNotification">Project Creation</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify organization admins when new projects are created
                      </p>
                    </div>
                    <Switch
                      id="projectCreationNotification"
                      checked={notificationSettings.projectCreationNotification}
                      onCheckedChange={(checked) => handleNotificationSettingChange('projectCreationNotification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mentionNotification">Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify users when they are mentioned in comments
                      </p>
                    </div>
                    <Switch
                      id="mentionNotification"
                      checked={notificationSettings.mentionNotification}
                      onCheckedChange={(checked) => handleNotificationSettingChange('mentionNotification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdatesNotification">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify users about platform updates and maintenance
                      </p>
                    </div>
                    <Switch
                      id="systemUpdatesNotification"
                      checked={notificationSettings.systemUpdatesNotification}
                      onCheckedChange={(checked) => handleNotificationSettingChange('systemUpdatesNotification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingNotifications">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Send marketing and promotional content
                      </p>
                    </div>
                    <Switch
                      id="marketingNotifications"
                      checked={notificationSettings.marketingNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('marketingNotifications', checked)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Notification Frequency
                </h3>
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="notificationDigestFrequency">Notification Digest Frequency</Label>
                  <Select 
                    value={notificationSettings.notificationDigestFrequency} 
                    onValueChange={(value) => handleNotificationSettingChange('notificationDigestFrequency', value)}
                  >
                    <SelectTrigger id="notificationDigestFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Default frequency for notification digests
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Notification')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Storage Settings */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure storage providers and backup settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Storage Provider
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <RadioGroup 
                    value={storageSettings.storageProvider}
                    onValueChange={(value) => handleStorageSettingChange('storageProvider', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aws" id="aws" />
                      <Label htmlFor="aws">Amazon S3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="azure" id="azure" />
                      <Label htmlFor="azure">Azure Blob Storage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gcp" id="gcp" />
                      <Label htmlFor="gcp">Google Cloud Storage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" id="local" />
                      <Label htmlFor="local">Local Storage</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="pt-2">
                    <Button variant="outline">
                      Configure Provider Settings
                    </Button>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Storage Limits
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStoragePerOrg">
                      Max Storage Per Organization (GB)
                    </Label>
                    <Input
                      id="maxStoragePerOrg"
                      type="number"
                      min="1"
                      max="1000"
                      value={storageSettings.maxStoragePerOrg}
                      onChange={(e) => handleStorageSettingChange('maxStoragePerOrg', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Textarea
                      id="allowedFileTypes"
                      value={storageSettings.allowedFileTypes}
                      onChange={(e) => handleStorageSettingChange('allowedFileTypes', e.target.value)}
                      rows={3}
                      placeholder="comma-separated file extensions"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of allowed file extensions
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Settings
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compressUploads">Compress Uploads</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically compress image uploads to save storage
                      </p>
                    </div>
                    <Switch
                      id="compressUploads"
                      checked={storageSettings.compressUploads}
                      onCheckedChange={(checked) => handleStorageSettingChange('compressUploads', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scanUploadsForMalware">Malware Scanning</Label>
                      <p className="text-sm text-muted-foreground">
                        Scan uploaded files for malware and viruses
                      </p>
                    </div>
                    <Switch
                      id="scanUploadsForMalware"
                      checked={storageSettings.scanUploadsForMalware}
                      onCheckedChange={(checked) => handleStorageSettingChange('scanUploadsForMalware', checked)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6 flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Backup Settings
                </h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select 
                      value={storageSettings.backupFrequency} 
                      onValueChange={(value) => handleStorageSettingChange('backupFrequency', value)}
                    >
                      <SelectTrigger id="backupFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupRetentionDays">Backup Retention (days)</Label>
                    <Input
                      id="backupRetentionDays"
                      type="number"
                      min="1"
                      max="365"
                      value={storageSettings.backupRetentionDays}
                      onChange={(e) => handleStorageSettingChange('backupRetentionDays', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days to retain backups before deletion
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline">
                      Run Manual Backup Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Storage')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PlatformSettings