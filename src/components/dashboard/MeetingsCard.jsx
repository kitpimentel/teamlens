import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function MeetingsCard({ 
  meetings = [],
  title = "Today's Meetings",
  onJoinMeeting = () => {},
  emptyMessage = "No meetings scheduled"
}) {
  if (!meetings.length) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2">
          <h3 className="font-medium">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <h3 className="font-medium">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border-l-4 border-teal-500 bg-teal-50 p-2 sm:p-3 rounded-r">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <p className="font-medium text-sm sm:text-base">{meeting.title}</p>
                {meeting.description && <p className="text-xs text-gray-500">{meeting.description}</p>}
                <div className="flex mt-2">
                  {meeting.attendees?.map((attendee, index) => (
                    <Avatar key={index} className="w-6 h-6 -ml-1 first:ml-0 border-2 border-white">
                      <AvatarFallback className="text-xs">{typeof attendee === 'string' ? attendee : attendee.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              <div className="text-xs text-right mt-2 sm:mt-0">
                <div className={`${meeting.status === 'Confirmed' ? 'text-green-500' : 'text-amber-500'} mb-1`}>
                  {meeting.status}
                </div>
                <div className="flex items-center justify-end">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {meeting.time}
                </div>
              </div>
            </div>
            {meeting.status === 'Confirmed' && (
              <Button 
                className="bg-teal-500 hover:bg-teal-600 text-xs mt-2 h-7 sm:h-8 px-2"
                onClick={() => onJoinMeeting(meeting)}
              >
                Join call
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}