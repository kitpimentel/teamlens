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
    { id: 1, title: "Task title", priority: "High", date: "13/04/2020", progress: 75, assignee: { initials: "JD", image: "https://github.com/shadcn.png" } },
    { id: 2, title: "Task title", priority: "High", date: "25/09/2020", progress: 50, assignee: { initials: "AS", image: "https://github.com/shadcn.png" } },
    { id: 3, title: "Task title", priority: "High", date: "30/11/2021", progress: 22, assignee: { initials: "MK", image: "https://github.com/shadcn.png" } },
    { id: 4, title: "Task title", priority: "Low", date: "21/03/2020", progress: 25, assignee: { initials: "SJ", image: "https://github.com/shadcn.png" } },
    { id: 5, title: "Task title", priority: "Medium", date: "25/04/2020", progress: 100, assignee: { initials: "JP", image: "https://github.com/shadcn.png" } },
    { id: 6, title: "Task title", priority: "Medium", date: "16/05/2022", progress: 75, assignee: { initials: "RB", image: "https://github.com/shadcn.png" } },
    { id: 7, title: "Task title", priority: "Medium", date: "27/05/2020", progress: 25, assignee: { initials: "LT", image: "https://github.com/shadcn.png" } }
  ];