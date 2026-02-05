import React, { useState, useEffect } from "react";
import WeeklySchedule from "./components/WeeklySchedule";
import DayView from "./components/DayView";
import "./App.css";

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [logs, setLogs] = useState({});

  // Initialize: Load logs from local storage & detect current day
  useEffect(() => {
    // 1. Load Logs
    const savedLogs = localStorage.getItem("workoutLogs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    // 2. Set Current Day
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = new Date().getDay();
    const todayName = days[todayIndex];

    // We auto-select today on first load (user can go back)
    // Actually, showing the schedule first might be better overview, 
    // but user wants to use it immediately. Let's start with schedule but highlight today.
    // If user wants to see today's workout, they click it. 
    // OR we can auto-select if it's a workout day?
    // Let's stick to showing Schedule first, but maybe auto-select if user prefers?
    // For now: Schedule View is default.
  }, []);

  const handleLogExercise = (exerciseId, logEntry) => {
    const updatedLogs = { ...logs };
    if (!updatedLogs[exerciseId]) {
      updatedLogs[exerciseId] = [];
    }
    updatedLogs[exerciseId].push(logEntry);

    setLogs(updatedLogs);
    localStorage.setItem("workoutLogs", JSON.stringify(updatedLogs));
  };

  // Helper to get current day name for highlighting
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = days[new Date().getDay()];

  return (
    <div className="app-container">
      {!selectedDay ? (
        <>
          <header>
            <h1>FITNESS TRACKER</h1>
            <span className="subtitle">Premium Workout Log</span>
          </header>
          <WeeklySchedule
            currentDay={currentDayName}
            selectedDay={null}
            onSelectDay={setSelectedDay}
          />
        </>
      ) : (
        <DayView
          dayId={selectedDay}
          onBack={() => setSelectedDay(null)}
          onLogExercise={handleLogExercise}
          logs={logs}
        />
      )}
    </div>
  );
}

export default App;
