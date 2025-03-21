// src/components/schedule/AddEventModal.jsx
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock, Users, Tag } from "lucide-react";

export default function AddEventModal({ 
  isOpen, 
  onClose, 
  onAddEvent 
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "meeting",
    attendees: [],
    location: ""
  });
  
  const [errors, setErrors] = useState({});
  
  // Event types
  const eventTypes = [
    { value: "meeting", label: "Meeting" },
    { value: "recurring", label: "Recurring Meeting" },
    { value: "external", label: "External Meeting" },
    { value: "planning", label: "Planning Session" },
    { value: "review", label: "Review" },
    { value: "event", label: "Team Event" }
  ];
  
  // Attendees
  const availableAttendees = [
    { id: 1, name: "Sergey Goldberg" },
    { id: 2, name: "Emily Chen" },
    { id: 3, name: "Michael Brown" },
    { id: 4, name: "Jane Smith" },
    { id: 5, name: "Robert Johnson" },
    { id: 6, name: "David Patel" }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleAttendeeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => ({
      id: parseInt(option.value),
      name: option.text
    }));
    
    setFormData(prev => ({ ...prev, attendees: selectedOptions }));
    
    if (errors.attendees) {
      setErrors(prev => ({ ...prev, attendees: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = "End time must be after start time";
    }
    
    if (!formData.type) {
      newErrors.type = "Event type is required";
    }
    
    if (formData.attendees.length === 0) {
      newErrors.attendees = "At least one attendee is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Get date parts
      const dateParts = new Date(formData.date).toLocaleDateString('en-US', {
        month: 'long', 
        day: 'numeric'
      }).split(' ');
      
      // Create a new event object
      const newEvent = {
        id: Date.now(), // Generate unique ID
        title: formData.title,
        description: formData.description || "",
        date: `${dateParts[0]} ${dateParts[1]}`,
        time: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
        attendees: formData.attendees.length,
        attendeesList: formData.attendees,
        type: formData.type,
        location: formData.location || "Virtual"
      };
      
      onAddEvent(newEvent);
      
      // Reset form and close modal
      resetForm();
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "meeting",
      attendees: [],
      location: ""
    });
    setErrors({});
    onClose();
  };
  
  // Format time from 24h to 12h
  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${suffix}`;
  };
  
  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">Add New Event</DialogTitle>
          <DialogDescription className="text-sm">
            Schedule a new event or meeting in your calendar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Event Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the event"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-sm font-medium flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-500" /> Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                className={`${errors.date ? "border-red-500" : ""} h-9 text-sm`}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-sm font-medium flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1 text-gray-500" /> Event Type
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className={`${errors.type ? "border-red-500" : ""} h-9 text-sm`}>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-sm">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-red-500">{errors.type}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-sm font-medium flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" /> Start Time
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className={`${errors.startTime ? "border-red-500" : ""} h-9 text-sm`}
              />
              {errors.startTime && (
                <p className="text-xs text-red-500">{errors.startTime}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-sm font-medium flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" /> End Time
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className={`${errors.endTime ? "border-red-500" : ""} h-9 text-sm`}
              />
              {errors.endTime && (
                <p className="text-xs text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm font-medium">
              Location (Optional)
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter location or meeting link"
              value={formData.location}
              onChange={handleChange}
              className="h-9 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="attendees" className="text-sm font-medium flex items-center">
              <Users className="h-3.5 w-3.5 mr-1 text-gray-500" /> Attendees
            </Label>
            <select
              id="attendees"
              name="attendees"
              multiple
              value={formData.attendees.map(a => a.id)}
              onChange={handleAttendeeChange}
              className={`w-full rounded-md border ${errors.attendees ? "border-red-500" : "border-gray-300"} p-2 text-sm h-28`}
            >
              {availableAttendees.map((attendee) => (
                <option key={attendee.id} value={attendee.id}>
                  {attendee.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple attendees</p>
            {errors.attendees && (
              <p className="text-xs text-red-500">{errors.attendees}</p>
            )}
          </div>
          
          <DialogFooter className="pt-2 sm:pt-3">
            <Button type="button" variant="outline" onClick={resetForm} className="mr-2 h-8 text-xs sm:text-sm">
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 h-8 text-xs sm:text-sm">
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}