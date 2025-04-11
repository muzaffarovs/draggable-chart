import React, { useState } from "react";

interface WidgetProps {
  type: string;
  id: string;
  removeWidget: (id: string) => void;
}

const Widget: React.FC<WidgetProps> = ({ type, id, removeWidget }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border relative overflow-hidden">
      <button
        onClick={() => removeWidget(id)}
        className="absolute z-50 top-2 right-2 text-red-500 hover:text-red-700 transition duration-200"
        title="Remove widget"
      >
        ❌
      </button>
      <h3 className="font-semibold text-lg mb-4">{type}</h3>
      {type === "Chart" && (
        <div className="bg-gray-200 h-24 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">Chart goes here</span>
        </div>
      )}
      {type === "ToDo" && <ToDoWidget />}
      {type === "Note" && (
        <div className="bg-gray-200 h-24 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">Note goes here</span>
        </div>
      )}
    </div>
  );
};

const ToDoWidget = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [task, setTask] = useState<string>("");

  const addTask = () => {
    if (task) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        placeholder="Add new task"
      />
      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Add Task
      </button>
      <ul className="mt-2 space-y-2">
        {tasks.map((t, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
          >
            <span>{t}</span>
            <button
              onClick={() => removeTask(index)}
              className="text-red-500 hover:text-red-700 transition duration-200 absolute z-50"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Widget;
