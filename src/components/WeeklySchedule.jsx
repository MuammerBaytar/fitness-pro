import React from "react";
import PropTypes from "prop-types";
import { workoutSchedule } from "../data/workoutData";

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeeklySchedule = ({ currentDay, selectedDay, onSelectDay, weekDates }) => {
    return (
        <div className="weekly-schedule">
            <h2>Haftalık Program</h2>
            <div className="days-grid">
                {daysOrder.map((dayKey) => {
                    const dayData = workoutSchedule[dayKey];
                    const isToday = currentDay === dayKey;
                    const isSelected = selectedDay === dayKey;
                    const isRest = dayData.restDay;
                    const dateStr = weekDates ? weekDates[dayKey] : "";

                    return (
                        <button
                            key={dayKey}
                            className={`day-card ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${isRest ? "rest-day" : ""}`}
                            onClick={() => onSelectDay(dayKey)}
                        >
                            <span className="day-name">{dayData.dayName}</span>
                            <span className="day-date">{dateStr}</span>
                            <span className="day-focus">{dayData.focus}</span>
                            {isToday && <span className="today-badge">Bugün</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

WeeklySchedule.propTypes = {
    currentDay: PropTypes.string,
    selectedDay: PropTypes.string,
    onSelectDay: PropTypes.func.isRequired,
};

export default WeeklySchedule;
