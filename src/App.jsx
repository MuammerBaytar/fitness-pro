import React, { useState, useEffect } from "react";
import WeeklySchedule from "./components/WeeklySchedule";
import DayView from "./components/DayView";
import WeightChart from "./components/WeightChart";
import { workoutSchedule } from "./data/workoutData";
import { FaTrash } from "react-icons/fa";
import "./App.css";

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [logs, setLogs] = useState({});
  const [weekDates, setWeekDates] = useState({});
  const [dailyStats, setDailyStats] = useState({});
  const [todayStats, setTodayStats] = useState({ weight: "", calories: "" });
  const [statsSaved, setStatsSaved] = useState(false);

  // Helper to get current day name key
  const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayKey = dayMap[new Date().getDay()];

  // Initialize: Load logs, Calculate Dates
  useEffect(() => {
    // 1. Load Logs & Stats
    const savedLogs = localStorage.getItem("workoutLogs");
    if (savedLogs) setLogs(JSON.parse(savedLogs));

    const savedStats = localStorage.getItem("dailyStats");
    let currentStats = { weight: "", calories: "" };

    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      setDailyStats(parsedStats);

      const todayKey = new Date().toISOString().split('T')[0];
      if (parsedStats[todayKey]) {
        currentStats = parsedStats[todayKey];
        setTodayStats(currentStats);
        setStatsSaved(true);
      }
    }

    // 2. Auto-Populate Estimated Calories if empty
    if (!currentStats.calories) {
      const todaysWorkout = workoutSchedule[currentDayKey];
      if (todaysWorkout && todaysWorkout.estCalories) {
        setTodayStats(prev => ({ ...prev, calories: todaysWorkout.estCalories }));
      }
    }

    // 3. Calculate Week Dates
    const getMonday = (d) => {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    const monday = getMonday(new Date());
    const dates = {};
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    dayMap.forEach((key, index) => {
      // Find Monday's index in our dayMap to align correctly? 
      // Actually dayMap is Sun-Sat. Monday is index 1.
      // It's safer to loop 0-6 and add to monday date.
      // But our keys need to match the map order?
      // Let's just loop 7 days starting from Monday
      const d = new Date(monday);
      d.setDate(monday.getDate() + index); // 0=Mon, 1=Tue...

      // We know Monday is index 0 in this loop, but map key needs to be "Monday"
      // Let's order keys manually to match the loop
      const orderedKeys = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      dates[orderedKeys[index]] = `${d.getDate()} ${months[d.getMonth()]}`;
    });
    setWeekDates(dates);

  }, []);

  const handleLogExercise = (exerciseId, logEntry) => {
    const updatedLogs = { ...logs };
    if (!updatedLogs[exerciseId]) {
      updatedLogs[exerciseId] = [];
    }

    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      ...logEntry,
      date: today,
      timestamp: Date.now()
    };

    updatedLogs[exerciseId].push(newEntry);

    setLogs(updatedLogs);
    localStorage.setItem("workoutLogs", JSON.stringify(updatedLogs));
  };

  const handleSaveStats = () => {
    const todayKey = new Date().toISOString().split('T')[0];
    const updatedStats = {
      ...dailyStats,
      [todayKey]: todayStats
    };
    setDailyStats(updatedStats);
    localStorage.setItem("dailyStats", JSON.stringify(updatedStats));
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm("DİKKAT: Tüm antrenman kayıtlarınız ve istatistikleriniz silinecek. Emin misiniz?")) {
      localStorage.removeItem("workoutLogs");
      localStorage.removeItem("dailyStats");
      setLogs({});
      setDailyStats({});
      setTodayStats({ weight: "", calories: "" });
      alert("Tüm veriler temizlendi.");
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      {!selectedDay ? (
        <>
          <header>
            <h1>FITNESS PRO</h1>
            <span className="subtitle">Haftalık Antrenman Programı</span>
          </header>

          {/* Daily Stats Section */}
          <div className="daily-stats-card">
            <h3>Bugünün Durumu ({new Date().toLocaleDateString('tr-TR')})</h3>
            <div className="stats-inputs">
              <div className="input-row">
                <label>Güncel Kilo:</label>
                <input
                  type="number"
                  placeholder="kg"
                  value={todayStats.weight}
                  onChange={(e) => setTodayStats({ ...todayStats, weight: e.target.value })}
                />
              </div>
              <div className="input-row">
                <label>Tahmini Kalori:</label>
                <input
                  type="text"
                  placeholder="kcal"
                  value={todayStats.calories}
                  onChange={(e) => setTodayStats({ ...todayStats, calories: e.target.value })}
                />
              </div>
              <button className={`save-stats-btn ${statsSaved ? 'saved' : ''}`} onClick={handleSaveStats}>
                {statsSaved ? "Kaydedildi ✓" : "Kaydet"}
              </button>
            </div>
            <WeightChart data={dailyStats} />
          </div>

          <WeeklySchedule
            currentDay={currentDayKey}
            selectedDay={null}
            onSelectDay={setSelectedDay}
            weekDates={weekDates}
          />

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button
              onClick={handleResetData}
              style={{ background: 'transparent', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }}
            >
              <FaTrash /> Verileri Sıfırla (Debug)
            </button>
          </div>
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
