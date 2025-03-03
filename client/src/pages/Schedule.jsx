// src/pages/Schedule.jsx
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function Schedule() {
  const [currentMonth, setCurrentMonth] = useState("March 2025");
  const [viewMode, setViewMode] = useState("month");
  
  // Sample events data
  const events = [
    { id: 1, title: "Team Standup", date: "March 4", time: "09:00 AM", attendees: 8, type: "recurring" },
    { id: 2, title: "Project Alpha Review", date: "March 5", time: "02:00 PM", attendees: 5, type: "meeting" },
    { id: 3, title: "Client Presentation", date: "March 8", time: "11:00 AM", attendees: 3, type: "external" },
    { id: 4, title: "Sprint Planning", date: "March 10", time: "10:00 AM", attendees: 6, type: "planning" },
    { id: 5, title: "Quarterly Review", date: "March 15", time: "03:00 PM", attendees: 12, type: "review" },
    { id: 6, title: "Team Building", date: "March 25", time: "01:00 PM", attendees: 15, type: "event" }
  ];
  
  // Simplified calendar cells (just placeholders)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2; // Offset to start with correct day of week
    return { day: day > 0 && day <= 31 ? day : null, hasEvents: [5, 8, 10, 15, 25].includes(day) };
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Schedule" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Sergey Goldberg" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Schedule</h1>
            
            <div className="flex items-center space-x-3">
              <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
                <Plus size={16} /> Add Event
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Calendar</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="ghost" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-medium">{currentMonth}</h3>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-center text-xs text-gray-500 h-8 flex items-center justify-center font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, i) => (
                      <div 
                        key={i} 
                        className={`h-8 flex items-center justify-center text-sm relative ${
                          day.day ? 'hover:bg-gray-100 cursor-pointer' : 'text-gray-300'
                        } ${day.day === 4 ? 'bg-teal-50 text-teal-600 font-medium' : ''}`}
                      >
                        {day.day}
                        {day.hasEvents && day.day && (
                          <span className="absolute bottom-1 w-1 h-1 bg-teal-500 rounded-full"></span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium">Upcoming Events</h4>
                    {events.slice(0, 3).map(event => (
                      <div key={event.id} className="border-l-2 border-teal-500 pl-3 py-1">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500">{event.date}, {event.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main calendar display */}
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <Button variant="ghost" size="sm">
                        Today
                      </Button>
                      <Button variant="ghost" size="sm">
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <Tabs 
                      defaultValue="month" 
                      value={viewMode}
                      onValueChange={setViewMode}
                      className="w-auto"
                    >
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                      <p className="text-gray-500">
                        {viewMode === "month" && "Showing monthly calendar view"}
                        {viewMode === "week" && "Showing weekly calendar view"}
                        {viewMode === "day" && "Showing daily calendar view"}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Full calendar integration coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex-shrink-0 w-16 text-center mr-4">
                          <div className="bg-gray-100 rounded-lg p-2">
                            <div className="text-xs text-gray-500">{event.date.split(' ')[0]}</div>
                            <div className="text-xl font-bold">{event.date.split(' ')[1]}</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="text-sm text-gray-500">{event.time} • {event.attendees} attendees</div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}