import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, ArrowLeft } from 'lucide-react';
import '../App.css';

export default function WorkoutView({ workout, onComplete, onBack }) {
  const [timeLeft, setTimeLeft] = useState(workout.duration || 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card" style={{ textAlign: 'center' }}>
      <button className="btn-secondary" style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', boxShadow: 'none', padding: 0 }} onClick={onBack}>
        <ArrowLeft size={32} color="var(--text-main)" />
      </button>

      <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', margin: '1rem 0' }}>{workout.name}</h2>
      <p style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '2rem' }}>
        {workout.description}
      </p>

      {workout.duration > 0 ? (
        <div style={{ margin: '2rem 0' }}>
          <div style={{ fontSize: '6rem', fontWeight: '800', lineHeight: 1, color: 'var(--primary)', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {formatTime(timeLeft)}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
            <button className="btn-primary" onClick={toggleTimer} style={{ padding: '1.5rem 3rem', fontSize: '1.8rem', borderRadius: '50px' }}>
              {isActive ? <Pause size={40} /> : <Play size={40} />}
              <span>{isActive ? '暫停' : '開始計時'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '3rem' }}>
          <button className="btn-primary" onClick={onComplete} style={{ width: '100%' }}>
            <CheckCircle size={40} />
            <span>我做完了！</span>
          </button>
        </div>
      )}
    </div>
  );
}
