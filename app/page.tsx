"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import DraggableChart from "@/components/draggable-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Move, LayoutGrid, Maximize2 } from "lucide-react";

// Define available widget types
const WIDGET_TYPES = {
  CHART: "chart",
  SUMMARY: "summary",
  INSTRUCTIONS: "instructions",
} as const;

type WidgetType = (typeof WIDGET_TYPES)[keyof typeof WIDGET_TYPES];

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Widget {
  id: string;
  type: WidgetType;
  position: Position;
  size: Size;
}

interface DraggableWidgetProps {
  id: string;
  initialPosition: Position;
  initialSize: Size;
  onRemove: (id: string) => void;
  children: React.ReactNode;
  title: string;
  description: string | null;
}

// Widget component that can be dragged and resized
function DraggableWidget({
  id,
  initialPosition,
  initialSize,
  onRemove,
  children,
  title,
  description,
}: DraggableWidgetProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const sizeRef = useRef(size);

  // Update refs when state changes to avoid dependency issues
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // Handle mouse down for dragging
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest(".resize-handle") ||
      (e.target as HTMLElement).closest(".widget-action")
    ) {
      return;
    }

    setIsDragging(true);
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle mouse down for resizing
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  // Handle mouse move for both dragging and resizing
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!widgetRef.current) return;

      const containerRect =
        widgetRef.current.parentElement?.getBoundingClientRect();
      if (!containerRect) return;

      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(
            e.clientX - containerRect.left - dragOffset.x,
            containerRect.width - sizeRef.current.width
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            e.clientY - containerRect.top - dragOffset.y,
            containerRect.height - sizeRef.current.height
          )
        );

        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const widgetRect = widgetRef.current.getBoundingClientRect();

        const newWidth = Math.max(
          200,
          Math.min(
            e.clientX - widgetRect.left,
            containerRect.width - positionRef.current.x
          )
        );
        const newHeight = Math.max(
          150,
          Math.min(
            e.clientY - widgetRect.top,
            containerRect.height - positionRef.current.y
          )
        );

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset]); // Removed position and size from dependencies

  return (
    <div
      ref={widgetRef}
      className="absolute shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isDragging || isResizing ? 10 : 1,
      }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader
          className="cursor-move p-4 select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 widget-action"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className="overflow-auto"
          style={{ height: "calc(100% - 80px)" }}
        >
          {children}
        </CardContent>
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center resize-handle"
          onMouseDown={handleResizeStart}
        >
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 600 });
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "chart",
      type: WIDGET_TYPES.CHART,
      position: { x: 20, y: 20 },
      size: { width: 600, height: 400 },
    },
    {
      id: "summary",
      type: WIDGET_TYPES.SUMMARY,
      position: { x: 640, y: 20 },
      size: { width: 300, height: 200 },
    },
    {
      id: "instructions",
      type: WIDGET_TYPES.INSTRUCTIONS,
      position: { x: 640, y: 240 },
      size: { width: 300, height: 180 },
    },
  ]);

  // Update container size on window resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: Math.max(600, containerRef.current.offsetHeight),
        });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  // Memoize the addWidget function to prevent unnecessary re-renders
  const addWidget = useCallback(
    (type: WidgetType) => {
      setWidgets((prevWidgets) => {
        const existingWidget = prevWidgets.find(
          (widget) => widget.type === type
        );
        if (existingWidget) return prevWidgets;

        // Find a position that doesn't overlap with existing widgets
        let newX = 20;
        let newY = 20;

        // Simple algorithm to find an empty spot
        const occupied = new Set<string>();
        prevWidgets.forEach((widget) => {
          // Mark the occupied grid cells for each widget
          for (
            let x = widget.position.x;
            x < widget.position.x + widget.size.width;
            x += 50
          ) {
            for (
              let y = widget.position.y;
              y < widget.position.y + widget.size.height;
              y += 50
            ) {
              occupied.add(`${Math.floor(x / 50)},${Math.floor(y / 50)}`);
            }
          }
        });

        // Find first unoccupied cell by testing several positions
        let found = false;
        for (let y = 0; y < containerSize.height; y += 50) {
          for (let x = 0; x < containerSize.width; x += 50) {
            // Check if any part of the new widget would overlap
            const newWidgetCells = [];
            for (let i = 0; i < Math.ceil(300 / 50); i++) {
              for (let j = 0; j < Math.ceil(200 / 50); j++) {
                newWidgetCells.push(
                  `${Math.floor((x + i * 50) / 50)},${Math.floor(
                    (y + j * 50) / 50
                  )}`
                );
              }
            }

            if (!newWidgetCells.some((cell) => occupied.has(cell))) {
              newX = x;
              newY = y;
              found = true;
              break;
            }
          }
          if (found) break;
        }

        const newWidget = {
          id: `${type}-${Date.now()}`,
          type,
          position: { x: newX, y: newY },
          size: { width: 300, height: 200 },
        };

        return [...prevWidgets, newWidget];
      });
    },
    [containerSize]
  );

  // Memoize the removeWidget function
  const removeWidget = useCallback((id: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.id !== id)
    );
  }, []);

  // Render widget content based on type
  const renderWidgetContent = useCallback((type: WidgetType) => {
    switch (type) {
      case WIDGET_TYPES.CHART:
        return <DraggableChart />;

      case WIDGET_TYPES.SUMMARY:
        return (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Average</div>
              <div className="text-2xl font-bold">$12,450</div>
              <div className="mt-1 flex items-center text-sm text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                +14.2% from last period
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">
                Projected Growth
              </div>
              <div className="text-2xl font-bold">23.5%</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Target</div>
              <div className="text-2xl font-bold">$18,000</div>
            </div>
          </div>
        );

      case WIDGET_TYPES.INSTRUCTIONS:
        return (
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">
                1
              </span>
              Click and drag any point on the chart
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">
                2
              </span>
              The data will update in real-time
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">
                3
              </span>
              Release to set the new value
            </li>
          </ul>
        );

      default:
        return <p>This is a new customizable widget</p>;
    }
  }, []);

  // Get widget title and description - memoize this to prevent unnecessary recalculations
  const getWidgetInfo = useCallback((type: WidgetType) => {
    switch (type) {
      case WIDGET_TYPES.CHART:
        return {
          title: "Revenue Forecast",
          description: "Drag any point to adjust the forecast values",
        };
      case WIDGET_TYPES.SUMMARY:
        return {
          title: "Summary",
          description: "Key metrics from your data",
        };
      case WIDGET_TYPES.INSTRUCTIONS:
        return {
          title: "Instructions",
          description: null,
        };
      default:
        return {
          title: "New Widget",
          description: null,
        };
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Interactive Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Drag, resize, add or remove widgets to customize your dashboard
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => addWidget(WIDGET_TYPES.CHART)}
              disabled={widgets.some((w) => w.type === WIDGET_TYPES.CHART)}
            >
              <PlusCircle className="h-4 w-4" />
              Add Chart
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => addWidget(WIDGET_TYPES.SUMMARY)}
              disabled={widgets.some((w) => w.type === WIDGET_TYPES.SUMMARY)}
            >
              <PlusCircle className="h-4 w-4" />
              Add Summary
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => addWidget(WIDGET_TYPES.INSTRUCTIONS)}
              disabled={widgets.some(
                (w) => w.type === WIDGET_TYPES.INSTRUCTIONS
              )}
            >
              <PlusCircle className="h-4 w-4" />
              Add Instructions
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200 p-2 shadow-sm relative"
          style={{ minHeight: "600px" }}
        >
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500 p-2">
            <LayoutGrid className="h-4 w-4" />
            <span>
              Drag widgets by their headers and resize from the bottom-right
              corner
            </span>
          </div>

          {widgets.map((widget) => {
            const { title, description } = getWidgetInfo(widget.type);
            return (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                initialPosition={widget.position}
                initialSize={widget.size}
                onRemove={removeWidget}
                title={title}
                description={description}
              >
                {renderWidgetContent(widget.type)}
              </DraggableWidget>
            );
          })}
        </div>
      </div>
    </main>
  );
}
