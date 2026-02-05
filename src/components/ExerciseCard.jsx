import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaDumbbell, FaClock, FaInfoCircle, FaCheckCircle, FaHistory } from "react-icons/fa";

const ExerciseCard = ({ exercise, onLog, history }) => {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [isLogged, setIsLogged] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Load last session's data if available to pre-fill or show hint
    const lastLog = history && history.length > 0 ? history[history.length - 1] : null;

    const handleLog = (e) => {
        e.preventDefault();
        if (!weight || !reps) return;

        onLog({
            date: new Date().toISOString(),
            weight,
            reps
        });
        setIsLogged(true);

        // Reset success state after 2 seconds
        setTimeout(() => setIsLogged(false), 2000);
    };

    return (
        <div className="exercise-card">
            <div className="card-header">
                <h3>{exercise.name}</h3>
                <div className="badges">
                    <span className="badge sets">{exercise.sets} Set</span>
                    <span className="badge reps">{exercise.reps} Rep</span>
                </div>
            </div>

            <div className="card-meta">
                <div className="meta-item">
                    <FaDumbbell className="icon" />
                    <span>RPE: {exercise.rpe}</span>
                </div>
                <div className="meta-item">
                    <FaClock className="icon" />
                    <span>Rest: {exercise.rest}</span>
                </div>
            </div>

            <div className="card-note">
                <FaInfoCircle className="icon-sm" />
                <p>{exercise.note}</p>
            </div>

            <div className="log-section">
                {lastLog && (
                    <div className="last-log" onClick={() => setShowHistory(!showHistory)}>
                        <FaHistory className="icon-xs" />
                        <span>Last: {lastLog.weight}kg x {lastLog.reps}</span>
                    </div>
                )}

                <form onSubmit={handleLog} className="log-form">
                    <div className="input-group">
                        <input
                            type="number"
                            placeholder={lastLog ? `${lastLog.weight}` : "kg"}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="log-input"
                        />
                        <span className="unit">kg</span>
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            placeholder={lastLog ? `${lastLog.reps}` : "reps"}
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="log-input"
                        />
                        <span className="unit">reps</span>
                    </div>
                    <button type="submit" className={`log-btn ${isLogged ? "success" : ""}`}>
                        {isLogged ? <FaCheckCircle /> : "+ Log"}
                    </button>
                </form>
            </div>
        </div>
    );
};

ExerciseCard.propTypes = {
    exercise: PropTypes.object.isRequired,
    onLog: PropTypes.func.isRequired,
    history: PropTypes.array,
};

export default ExerciseCard;
