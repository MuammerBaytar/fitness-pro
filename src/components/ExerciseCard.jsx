import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { FaDumbbell, FaClock, FaInfoCircle, FaCheckCircle, FaHistory, FaPlus, FaStopwatch } from "react-icons/fa";

const ExerciseCard = ({ exercise, onLog, history }) => {
    const { id, name, sets, reps, rpe, rest, note } = exercise;
    const [weight, setWeight] = useState(""); // Default empty
    const [currentReps, setCurrentReps] = useState("");
    const [isLogged, setIsLogged] = useState(false);

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let interval = null;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
            if (timerActive) {
                // Play sound or vibrate could go here
                // alert("Dinlenme bitti!"); // Too intrusive?
            }
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const startTimer = () => {
        // Parse rest string e.g. "3-5 dk" -> take average or min? Let's take lower bound * 60
        // "3-5 dk" -> 3 * 60 = 180s
        // "2 dk" -> 120s
        try {
            const numbers = rest.match(/\d+/g);
            if (numbers && numbers.length > 0) {
                const minutes = parseInt(numbers[0]);
                setTimeLeft(minutes * 60);
                setTimerActive(true);
            }
        } catch (e) {
            console.error("Timer parse error", e);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // 1. Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // 2. Filter history for today's logs
    const todaysSets = useMemo(() => {
        return history ? history.filter(h => h.date === today) : [];
    }, [history, today]);

    // 3. Get last session's logs (excluding today)
    const lastSessionSets = useMemo(() => {
        if (!history || history.length === 0) return [];
        // Sort by timestamp desc
        const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
        // Find the most recent date that is NOT today
        const lastEntry = sorted.find(h => h.date !== today);
        if (!lastEntry) return [];
        const lastDate = lastEntry.date;
        return sorted.filter(h => h.date === lastDate).reverse(); // Show in order 1,2,3
    }, [history, today]);

    // 4. Calculate progress
    // Target sets: "3-4 Set" -> take 3 as min, 4 as max
    // Let's assume max for the progress bar
    const targetSetCount = parseInt(sets.split('-').pop()) || 3;
    const progressPercent = Math.min((todaysSets.length / targetSetCount) * 100, 100);


    const handleLog = (e) => {
        e.preventDefault();
        if (!weight || !currentReps) return;

        onLog({
            weight,
            reps: currentReps
        });
        setIsLogged(true);

        // Auto-fill next set with same values for convenience
        // But maybe user wants empty? Let's keep values.

        setTimeout(() => setIsLogged(false), 2000);
    };

    return (
        <div className="exercise-card">
            <div className="card-header">
                <h3>{name}</h3>
                <div className="badges">
                    <span className="badge set-badge">{sets} Set</span>
                    <span className="badge rep-badge">{reps} Rep</span>
                </div>
            </div>

            <div className="exercise-info">
                <div className="info-item">
                    <FaDumbbell className="icon" /> <span>RPE: {rpe}</span>
                </div>
                <div
                    className="info-item"
                    onClick={startTimer}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    title="Zamanlayıcıyı başlatmak için tıkla"
                >
                    {timerActive ? (
                        <span style={{ color: '#2dd4bf', fontWeight: 'bold' }}>
                            <FaStopwatch className="icon" /> {formatTime(timeLeft)}
                        </span>
                    ) : (
                        <>
                            <FaClock className="icon" /> <span>Dinlenme: {rest}</span>
                        </>
                    )}
                </div>
            </div>

            {note && (
                <div className="note">
                    <FaInfoCircle className="note-icon" /> {note}
                </div>
            )}

            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>

            {/* Today's Sets */}
            {todaysSets.length > 0 && (
                <div className="sets-history">
                    <h4 style={{ color: '#2dd4bf', marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bugünün Setleri</h4>
                    {todaysSets.map((set, idx) => (
                        <div key={idx} className="set-row completed">
                            <span className="set-number">Set {idx + 1}</span>
                            <span className="set-data">{set.weight} kg x {set.reps}</span>
                            <FaCheckCircle className="check-icon" />
                        </div>
                    ))}
                </div>
            )}

            {/* Last Session History */}
            {lastSessionSets.length > 0 && (
                <div className="sets-history prev-session">
                    <h4 style={{ color: '#94a3b8', marginBottom: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaHistory /> Son Antrenman ({new Date(lastSessionSets[0].date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })})
                    </h4>
                    {lastSessionSets.map((set, idx) => (
                        <div key={idx} className="set-row prev">
                            <span className="set-number">Set {idx + 1}</span>
                            <span className="set-data">{set.weight} kg x {set.reps}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleLog} className="log-form">
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Ağırlık"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="weight-input"
                    />
                    <span className="unit">kg</span>
                </div>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Tekrar"
                        value={currentReps}
                        onChange={(e) => setCurrentReps(e.target.value)}
                        className="reps-input"
                    />
                    <span className="unit">tkr</span>
                </div>
                <button type="submit" className={`log-btn ${isLogged ? 'logged' : ''}`}>
                    {isLogged ? <FaCheckCircle /> : <><FaPlus /> Ekle</>}
                </button>
            </form>
        </div>
    );
};

ExerciseCard.propTypes = {
    exercise: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        sets: PropTypes.string.isRequired,
        reps: PropTypes.string.isRequired,
        rpe: PropTypes.string.isRequired,
        rest: PropTypes.string.isRequired,
        note: PropTypes.string,
    }).isRequired,
    onLog: PropTypes.func.isRequired,
    history: PropTypes.array
};

export default ExerciseCard;
