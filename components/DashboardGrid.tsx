"use client";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useEffect, useState } from "react";
import { saveLayout, loadLayout } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import Widget from "./Widget";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  layout: Layout;
  type: string;
}

export default function DashboardGrid() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetType, setWidgetType] = useState<string>("Chart");

  useEffect(() => {
    const stored = loadLayout();
    if (stored) {
      setWidgets(stored);
    } else {
      setWidgets([
        { id: "1", layout: { i: "1", x: 0, y: 0, w: 2, h: 2 }, type: "Chart" },
        { id: "2", layout: { i: "2", x: 2, y: 0, w: 2, h: 2 }, type: "ToDo" },
        { id: "3", layout: { i: "3", x: 4, y: 0, w: 2, h: 2 }, type: "Note" },
      ]);
    }
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updated = widgets.map((w) => {
      const layout = newLayout.find((l) => l.i === w.id);
      return layout ? { ...w, layout } : w;
    });
    setWidgets(updated);
    saveLayout(updated);
  };

  const addWidget = () => {
    const id = uuidv4();
    const newWidget: Widget = {
      id,
      layout: { i: id, x: 0, y: Infinity, w: 2, h: 2 },
      type: widgetType,
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
        My Dashboard
      </h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label htmlFor="widgetType" className="mr-2 text-lg font-medium">
            Select Widget Type:
          </label>
          <select
            id="widgetType"
            value={widgetType}
            onChange={(e) => setWidgetType(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="Chart">Chart</option>
            <option value="ToDo">ToDo List</option>
            <option value="Note">Note</option>
          </select>
        </div>

        <button
          onClick={addWidget}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ➕ Add Widget
        </button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets.map((w) => w.layout) }}
        breakpoints={{ lg: 1024, md: 768, sm: 480 }}
        cols={{ lg: 6, md: 4, sm: 2 }}
        rowHeight={120}
        isResizable
        isDraggable
        onLayoutChange={handleLayoutChange}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition"
          >
            <Widget
              type={widget.type}
              id={widget.id}
              removeWidget={removeWidget}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
