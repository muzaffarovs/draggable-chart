export const saveLayout = (widgets: any[]) => {
  localStorage.setItem("dashboardLayout", JSON.stringify(widgets));
};

export const loadLayout = () => {
  const stored = localStorage.getItem("dashboardLayout");
  return stored ? JSON.parse(stored) : null;
};

export const saveTasks = (widgetId: string, tasks: string[]) => {
  localStorage.setItem(`tasks-${widgetId}`, JSON.stringify(tasks));
};

export const loadTasks = (widgetId: string) => {
  const storedTasks = localStorage.getItem(`tasks-${widgetId}`);
  return storedTasks ? JSON.parse(storedTasks) : [];
};
