// src/components/team/OptimizeAllocationModal.jsx
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Activity,
  UserCheck,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OptimizeAllocationModal({ 
  isOpen, 
  onClose, 
  teamMembers, 
  onApplyChanges 
}) {
  const [activeTab, setActiveTab] = useState("visualization");
  const [optimizationInProgress, setOptimizationInProgress] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState({
    balanceFactor: [50], // 0-100 scale where 0 is individual focus, 100 is team balance
    projectPriority: "equal", // equal, deadline, or importance
    preventOverallocation: true,
    maintainExpertise: true
  });
  const [optimizedTeam, setOptimizedTeam] = useState([]);
  const [changes, setChanges] = useState([]);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("visualization");
      setOptimizationInProgress(false);
      setOptimizationComplete(false);
      setOptimizedTeam([]);
      setChanges([]);
    }
  }, [isOpen]);
  
  // Function to determine color based on availability
  const getAvailabilityColor = (availability) => {
    if (availability >= 70) return "bg-green-500";
    if (availability >= 40) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getAvailabilityText = (availability) => {
    if (availability >= 70) return "Available";
    if (availability >= 40) return "Partially Available";
    return "At Capacity";
  };
  
  // Function to handle optimization process
  const handleOptimize = () => {
    setOptimizationInProgress(true);
    
    // Simulate optimization processing time
    setTimeout(() => {
      // Clone team members to create optimized version
      const optimized = teamMembers.map(member => ({...member}));
      
      // Apply optimization logic
      // This is a simplified example that redistributes workload
      // In a real app, you would use a more sophisticated algorithm
      optimized.forEach(member => {
        const adjustmentFactor = (optimizationSettings.balanceFactor[0] / 100) * 0.3;
        
        if (member.availability < 50) {
          // Decrease workload for overallocated members
          member.availability += Math.floor(Math.random() * 20) + 10;
          if (member.tasks.active > 1) {
            member.tasks.active -= 1;
          }
        } else if (member.availability > 80) {
          // Increase workload for underutilized members
          member.availability -= Math.floor(Math.random() * 15) + 5;
          member.tasks.active += 1;
        }
        
        // Ensure values stay in valid ranges
        member.availability = Math.max(20, Math.min(95, member.availability));
      });
      
      // Generate list of changes made
      const changesDetected = [];
      teamMembers.forEach((original, index) => {
        const optimized = optimized[index];
        if (original.availability !== optimized.availability || 
            original.tasks.active !== optimized.tasks.active) {
          changesDetected.push({
            memberId: original.id,
            name: original.name,
            before: {
              availability: original.availability,
              activeTasks: original.tasks.active
            },
            after: {
              availability: optimized.availability,
              activeTasks: optimized.tasks.active
            },
            type: original.availability > optimized.availability ? "increased" : "decreased"
          });
        }
      });
      
      setOptimizedTeam(optimized);
      setChanges(changesDetected);
      setOptimizationInProgress(false);
      setOptimizationComplete(true);
    }, 1500);
  };
  
  const handleApplyChanges = () => {
    onApplyChanges(optimizedTeam);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-4 border-b bg-gray-50">
          <DialogTitle className="flex items-center text-lg">
            <Activity className="w-5 h-5 mr-2 text-teal-500" />
            Resource Allocation Optimizer
          </DialogTitle>
          <DialogDescription>
            Automatically balance workload and optimize team resource allocation
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="visualization" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-4 pt-3 border-b">
            <TabsList className="grid grid-cols-2 mb-3">
              <TabsTrigger value="visualization" disabled={optimizationInProgress}>
                <BarChart className="w-4 h-4 mr-2" />
                Current Allocation
              </TabsTrigger>
              <TabsTrigger value="settings" disabled={optimizationInProgress}>
                <UserCheck className="w-4 h-4 mr-2" />
                Optimization Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="visualization" className="p-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
              {optimizationInProgress ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">Optimizing Resource Allocation</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Our algorithm is analyzing team workload and redistributing tasks for optimal efficiency...
                  </p>
                </div>
              ) : optimizationComplete ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Optimization Complete</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        We've identified {changes.length} changes that will help balance your team's workload.
                      </p>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleApplyChanges}
                      >
                        Apply These Changes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-500" />
                      Recommended Changes
                    </h3>
                    
                    {changes.map((change, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-center mb-2">
                          <Badge 
                            className={`mr-2 ${change.type === 'increased' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                          >
                            {change.type === 'increased' ? 'Workload Increased' : 'Workload Decreased'}
                          </Badge>
                          <h4 className="font-medium">{change.name}</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Current</p>
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${getAvailabilityColor(change.before.availability)}`} 
                                  style={{ width: `${change.before.availability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{change.before.availability}% available</span>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{change.before.activeTasks}</span> active tasks
                            </p>
                          </div>
                          
                          <div className="flex items-center">
                            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Optimized</p>
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${getAvailabilityColor(change.after.availability)}`} 
                                  style={{ width: `${change.after.availability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{change.after.availability}% available</span>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">{change.after.activeTasks}</span> active tasks
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">Team Availability Comparison</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-500">Current Allocation</h4>
                          <div className="space-y-3">
                            {teamMembers.map(member => (
                              <div key={member.id} className="flex items-center space-x-3">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm truncate">{member.name}</p>
                                  <Progress 
                                    value={100 - member.availability}
                                    className="h-2"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-500">Optimized Allocation</h4>
                          <div className="space-y-3">
                            {optimizedTeam.map(member => (
                              <div key={member.id} className="flex items-center space-x-3">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm truncate">{member.name}</p>
                                  <Progress 
                                    value={100 - member.availability}
                                    className="h-2"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                    <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Current Team Allocation</h3>
                      <p className="text-sm text-gray-600">
                        Review your team's current workload before optimization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Team Member</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Availability</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Current Tasks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {teamMembers.map(member => (
                          <tr key={member.id}>
                            <td className="p-3">
                              <div className="flex items-center">
                                <Avatar className="h-7 w-7 mr-2">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge 
                                className={`
                                  ${member.availability >= 70 ? 'bg-green-100 text-green-800' : 
                                    member.availability >= 40 ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'}
                                `}
                              >
                                {getAvailabilityText(member.availability)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getAvailabilityColor(member.availability)}`} 
                                    style={{ width: `${member.availability}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{member.availability}%</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <p className="text-sm">
                                <span className="font-medium">{member.tasks.active}</span> active / 
                                <span className="text-gray-500"> {member.tasks.completed} completed</span>
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <Button 
                      className="bg-teal-500 hover:bg-teal-600 w-full"
                      onClick={handleOptimize}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Start Optimization Process
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="p-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Optimization Settings</h3>
                    <p className="text-sm text-gray-600">
                      Adjust these parameters to control how the optimization algorithm balances workload.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Balance Factor</h3>
                      <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                        {optimizationSettings.balanceFactor}%
                      </span>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Individual Efficiency</span>
                        <span>Team Balance</span>
                      </div>
                      <Slider
                        value={optimizationSettings.balanceFactor}
                        onValueChange={(value) => setOptimizationSettings({
                          ...optimizationSettings,
                          balanceFactor: value
                        })}
                        max={100}
                        step={5}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Determines whether to prioritize individual team member efficiency or overall team workload balance.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Project Priority</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={optimizationSettings.projectPriority === "equal" ? "default" : "outline"}
                        size="sm"
                        className={optimizationSettings.projectPriority === "equal" ? "bg-teal-500 hover:bg-teal-600" : ""}
                        onClick={() => setOptimizationSettings({
                          ...optimizationSettings,
                          projectPriority: "equal"
                        })}
                      >
                        Equal
                      </Button>
                      <Button
                        variant={optimizationSettings.projectPriority === "deadline" ? "default" : "outline"}
                        size="sm"
                        className={optimizationSettings.projectPriority === "deadline" ? "bg-teal-500 hover:bg-teal-600" : ""}
                        onClick={() => setOptimizationSettings({
                          ...optimizationSettings,
                          projectPriority: "deadline"
                        })}
                      >
                        Deadline
                      </Button>
                      <Button
                        variant={optimizationSettings.projectPriority === "importance" ? "default" : "outline"}
                        size="sm"
                        className={optimizationSettings.projectPriority === "importance" ? "bg-teal-500 hover:bg-teal-600" : ""}
                        onClick={() => setOptimizationSettings({
                          ...optimizationSettings,
                          projectPriority: "importance"
                        })}
                      >
                        Importance
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Determines how tasks are prioritized across projects when redistributing workload.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Additional Settings</h3>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Prevent Overallocation</p>
                        <p className="text-xs text-gray-500">Do not assign more than 80% capacity to any team member</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={optimizationSettings.preventOverallocation}
                          onChange={() => setOptimizationSettings({
                            ...optimizationSettings,
                            preventOverallocation: !optimizationSettings.preventOverallocation
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Maintain Expertise Areas</p>
                        <p className="text-xs text-gray-500">Keep team members within their primary skill areas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={optimizationSettings.maintainExpertise}
                          onChange={() => setOptimizationSettings({
                            ...optimizationSettings,
                            maintainExpertise: !optimizationSettings.maintainExpertise
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="bg-teal-500 hover:bg-teal-600 w-full"
                  onClick={() => {
                    setActiveTab("visualization");
                    handleOptimize();
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Run Optimization with These Settings
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="p-3 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {optimizationComplete && (
            <Button
              className="bg-teal-500 hover:bg-teal-600 ml-2"
              onClick={handleApplyChanges}
            >
              Apply Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}