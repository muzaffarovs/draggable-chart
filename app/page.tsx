"use client";
import React, { useState } from "react";
import DashboardGrid from "@/components/DashboardGrid";

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-md p-4 flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "block" : "hidden"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Home
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-gray-800 hover:text-blue-800 transition duration-300"
              >
                Analytics
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-gray-800 hover:text-blue-800 transition duration-300"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white rounded-lg shadow-lg ml-4 mr-4 mt-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome to your dashboard
          </h1>
          {/* Sidebar toggle button */}
          <button
            onClick={toggleSidebar}
            className="text-blue-600 hover:text-blue-800 transition duration-300"
            aria-label="Toggle Sidebar"
          >
            {isSidebarVisible ? "❌ Close Sidebar" : "➡ Open Sidebar"}
          </button>
        </div>

        <DashboardGrid />
      </main>
    </div>
  );
}
