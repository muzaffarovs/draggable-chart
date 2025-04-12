"use client";

import { useRef, useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  DotProps, // Import DotProps for the correct typing
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Initial data for the chart
const initialData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 4000 },
  { name: "Sep", value: 5000 },
  { name: "Oct", value: 6000 },
  { name: "Nov", value: 7000 },
  { name: "Dec", value: 8000 },
];

const chartConfig = {
  value: {
    label: "Monthly Revenue",
    color: "hsl(var(--chart-1))",
  },
};

export default function DraggableChart() {
  const [data, setData] = useState(initialData);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const chartRef = useRef<any>(null);

  const handleMouseDown = (index: number) => {
    setActiveIndex(index);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && activeIndex !== null && chartRef.current) {
      // Ensure chartRef.current is a valid DOM element
      const chartElement = chartRef.current?.container?.querySelector("svg");

      if (chartElement) {
        const svgRect = chartElement.getBoundingClientRect();
        const svgHeight = svgRect.height;
        const mouseY = e.clientY - svgRect.top;

        const ratio = 1 - mouseY / svgHeight;
        const minValue = 0;
        const maxValue = 10000;
        const newValue = Math.round(minValue + ratio * (maxValue - minValue));

        const newData = [...data];
        newData[activeIndex] = {
          ...newData[activeIndex],
          value: Math.max(minValue, Math.min(maxValue, newValue)),
        };

        setData(newData); // Update chart data
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveIndex(null);
  };

  // Add event listeners for dragging behavior
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, activeIndex, data]);

  // Update the CustomDot component with proper types
  const CustomDot = (props: DotProps) => {
    const { cx, cy, index } = props;
    const isActive = activeIndex === index;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={isActive ? 8 : 6}
        fill={isActive ? "var(--chart-1-active)" : "var(--chart-1)"}
        stroke="white"
        strokeWidth={2}
        style={{
          cursor: "grab",
          filter: isActive
            ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            : "none",
          transition: "r 0.2s ease-in-out, fill 0.2s ease-in-out",
        }}
        onMouseDown={() => handleMouseDown(index)} // Activate the dot for dragging
      />
    );
  };

  return (
    <div className="h-full w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            ref={chartRef}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={<CustomDot />} // CustomDot will now work correctly
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
