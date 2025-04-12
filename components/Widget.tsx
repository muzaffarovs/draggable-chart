import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface WidgetProps {
  id: string;
  removeWidget: (id: string) => void;
  isDarkMode: boolean; // Receive isDarkMode
}

const Widget: React.FC<WidgetProps> = ({ id, removeWidget, isDarkMode }) => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Data Points",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: isDarkMode
          ? "rgba(129, 140, 248, 1)"
          : "rgb(59, 130, 246)", // Theme-aware color
        backgroundColor: isDarkMode
          ? "rgba(129, 140, 248, 0.2)"
          : "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-md p-4 h-full ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <button
        onClick={() => removeWidget(id)}
        className={`absolute top-2 right-2 text-gray-400 hover:text-red-500 transition duration-200 focus:outline-none ${
          isDarkMode ? "hover:text-red-500" : "hover:text-red-700"
        }`}
        title="Remove widget"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h3 className="font-semibold text-lg mb-3">Chart</h3>

      <div className="rounded-md flex-grow w-full">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default Widget;
