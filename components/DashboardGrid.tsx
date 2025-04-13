"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { saveLayout, loadLayout } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import Widget from "./Widget";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetDefinition {
  id: string;
  layout: Layout;
}

interface DashboardGridProps {
  isDarkMode: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ isDarkMode }) => {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>([]);

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updated = widgets.map((w) => {
        const layout = newLayout.find((l) => l.i === w.layout.i); // Use layout.i for matching
        return layout ? { ...w, layout: { ...w.layout, ...layout } } : w; // Merge existing layout
      });
      setWidgets(updated);
      saveLayout(updated);
    },
    [widgets]
  );

  useEffect(() => {
    const stored = loadLayout();
    if (stored) {
      setWidgets(stored);
    } else {
      setWidgets([
        {
          id: uuidv4(),
          layout: { i: uuidv4(), x: 0, y: 0, w: 2, h: 2 },
        },
      ]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //dependency yo'qligi uchun eslint build vaqtida warning berishi munkun

  const addWidget = () => {
    const id = uuidv4();
    const newWidget: WidgetDefinition = {
      id,
      layout: { i: id, x: 0, y: Infinity, w: 2, h: 2 },
    };
    const updated = [...widgets, newWidget];
    setWidgets(updated);
    saveLayout(updated);
  };

  const removeWidget = (id: string) => {
    const updated = widgets.filter((w) => w.id !== id);
    setWidgets(updated);
    saveLayout(updated);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800" // Subtle shadow
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <label htmlFor="widgetType" className="text-lg font-medium">
            Add Widget:
          </label>
          <button
            onClick={addWidget}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 inline-block mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add
          </button>
        </div>
        {/* Optional: Add a "Reset Layout" button here if needed */}
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets.map((w) => w.layout) }}
        breakpoints={{ lg: 1200, md: 992, sm: 768, xs: 480, xxs: 0 }} // More common breakpoints
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // More flexible columns
        rowHeight={100} // Adjust as needed
        isResizable
        isDraggable
        onLayoutChange={handleLayoutChange}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`rounded-md shadow-sm overflow-hidden ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            style={{
              border: "1px solid",
              borderColor: isDarkMode ? "#4a5568" : "#e2e8f0",
            }}
          >
            <Widget
              id={widget.id}
              removeWidget={removeWidget}
              isDarkMode={isDarkMode}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardGrid;
