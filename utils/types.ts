enum WidgetType {
  CHART = "chart",
  SUMMARY = "summary",
  INSTRUCTIONS = "instructions",
}

interface Widget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DraggableWidgetProps {
  id: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onRemove: (id: string) => void;
  children: React.ReactNode;
  title: string;
  description: string | null;
}

export type { WidgetType, Widget, DraggableWidgetProps };
