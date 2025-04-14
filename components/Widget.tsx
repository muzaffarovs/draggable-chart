import React from "react";
import { Line, Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { chartData, DoughnutData, PolarData } from "./dataset";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface WidgetProps {
  id: string;
  removeWidget: (id: string) => void;
  isDarkMode: boolean; // Receive isDarkMode
  type: string;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const chartStyle = { width: "100%", height: "100%" };

const Widget: React.FC<WidgetProps> = ({
  id,
  removeWidget,
  isDarkMode,
  type,
}) => {
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
        {type == "chartData" && (
          <Line data={chartData} options={chartOptions} style={chartStyle} />
        )}
        {type == "DoughnutData" && (
          <Doughnut
            data={DoughnutData}
            options={chartOptions}
            style={chartStyle}
          />
        )}
        {type == "PolarData" && (
          <PolarArea
            data={PolarData}
            options={chartOptions}
            style={chartStyle}
          />
        )}
      </div>
    </div>
  );
};

export default Widget;
