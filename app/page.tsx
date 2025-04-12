"use client";
import React, { useState, useEffect } from "react";
import DashboardGrid from "@/components/DashboardGrid";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    if (storedTheme === "true") {
      setIsDarkMode(true);
    } else if (storedTheme === "false") {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    document.documentElement.classList.toggle("dark", isDarkMode); // Apply dark class to root
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">My Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-800 shadow-sm hover:bg-gray-100 border border-gray-200"
            }`}
            aria-label={
              isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {isDarkMode ? (
              <MoonIcon className="w-6 h-6" />
            ) : (
              <SunIcon className="w-6 h-6" />
            )}
          </button>
        </header>

        <DashboardGrid isDarkMode={isDarkMode} />
      </main>
    </div>
  );
}