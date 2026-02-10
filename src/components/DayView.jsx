import React from "react";
import PropTypes from "prop-types";
import ExerciseCard from "./ExerciseCard";
import { FaArrowLeft, FaBed } from "react-icons/fa";
import { workoutSchedule } from "../data/workoutData";

const DayView = ({ dayId, onBack, onLogExercise, logs }) => {
    const dayData = workoutSchedule[dayId];

    if (!dayData) return <div>Gün Bulunamadı</div>;

    const isRestDay = dayData.restDay;

    return (
        <div className="daily-view fade-in">
            <div className="section-title">
                <button onClick={onBack} className="back-btn">
                    <FaArrowLeft /> Program
                </button>
                <span className="subtitle">{dayData.dayName}</span>
            </div>

            <header>
                <h1>{dayData.focus}</h1>
            </header>

            {/* Supplement Guide Overlay */}
            {dayData.supplements && dayData.supplements.length > 0 && (
                <div className="supplement-card">
                    <h4>Supplement Rehberi</h4>
                    <ul>
                        {dayData.supplements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {isRestDay ? (
                <div className="rest-day-message" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    <FaBed size={48} style={{ marginBottom: "16px", color: "#333" }} />
                    <h2>Dinlenme Günü</h2>
                    <p>Kasların büyümek için dinlenmeye ihtiyacı var. İyi uykular!</p>
                </div>
            ) : (
                <div className="exercises-list">
                    {dayData.exercises.map((exercise) => (
                        <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onLog={(logData) => onLogExercise(exercise.id, logData)}
                            history={logs[exercise.id] || []}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

DayView.propTypes = {
    dayId: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    onLogExercise: PropTypes.func.isRequired,
    logs: PropTypes.object.isRequired,
};

export default DayView;
