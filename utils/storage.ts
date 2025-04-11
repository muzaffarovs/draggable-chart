const STORAGE_KEY = "dashboard-layout";

export function saveLayout(layout: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }
}

export function loadLayout(): any | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}
