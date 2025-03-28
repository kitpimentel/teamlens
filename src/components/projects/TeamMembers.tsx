import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, Phone, ExternalLink } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  avatar: string
  email: string
  role: string
}

interface TeamMembersProps {
  team: TeamMember[]
}

/**
 * Team members component for project team
 */
function TeamMembers({ team }: TeamMembersProps) {
  /**
   * Get initials from name for avatar fallback
   */
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {team.map((member) => (
        <Card key={member.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{member.email}</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{member.name}</DialogTitle>
                    <DialogDescription>
                      Team member information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-4 py-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xl">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                      <Badge variant="outline" className="mt-2">Team Member</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">UI Design</Badge>
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Figma</Badge>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button variant="outline">Send Message</Button>
                    <Button>View Full Profile</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TeamMembers