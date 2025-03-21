// src/data/projectData.js
export const projectData = {
  name: "Project Alpha",
  tasks: {
    sprint: { count: 5, trend: "-2%" },
    progress: { count: 2, trend: "+2%" },
    qa: { count: 2, trend: "-6%" },
    done: { count: 6, trend: "+26%" }
  },
  completion: {
    percentage: 72,
    completed: 13,
    total: 15
  },
  kpi: {
    percentage: 72,
    current: "$16k",
    target: "$22k"
  }
};
   
export const taskData = [
  { 
    id: 1, 
    title: "Implement user authentication flow", 
    priority: "High", 
    date: "04/15/2025", 
    progress: 75, 
    assignee: { 
      initials: "SG", 
      image: "https://github.com/shadcn.png",
      name: "Sergey Goldberg" 
    } 
  },
  { 
    id: 2, 
    title: "Create dashboard analytics charts", 
    priority: "High", 
    date: "04/10/2025", 
    progress: 50, 
    assignee: { 
      initials: "AM", 
      image: "https://github.com/shadcn.png",
      name: "Ava Mitchell" 
    } 
  },
  { 
    id: 3, 
    title: "Optimize database queries for performance", 
    priority: "High", 
    date: "04/18/2025", 
    progress: 22, 
    assignee: { 
      initials: "JL", 
      image: "https://github.com/shadcn.png",
      name: "Jason Lee" 
    } 
  },
  { 
    id: 4, 
    title: "Update responsive layout for mobile", 
    priority: "Low", 
    date: "04/25/2025", 
    progress: 25, 
    assignee: { 
      initials: "RK", 
      image: "https://github.com/shadcn.png",
      name: "Rachel Kim" 
    } 
  },
  { 
    id: 5, 
    title: "Fix cross-browser compatibility issues", 
    priority: "Medium", 
    date: "04/08/2025", 
    progress: 100, 
    assignee: { 
      initials: "DP", 
      image: "https://github.com/shadcn.png",
      name: "David Patel" 
    } 
  },
  { 
    id: 6, 
    title: "Implement real-time notifications", 
    priority: "Medium", 
    date: "04/20/2025", 
    progress: 75, 
    assignee: { 
      initials: "LZ", 
      image: "https://github.com/shadcn.png",
      name: "Lin Zhang" 
    } 
  },
  { 
    id: 7, 
    title: "Write end-to-end integration tests", 
    priority: "Medium", 
    date: "04/12/2025", 
    progress: 25, 
    assignee: { 
      initials: "MC", 
      image: "https://github.com/shadcn.png",
      name: "Marcus Carter" 
    } 
  }
];