import React, { useState } from 'react';
import { Play, Settings, Trophy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkoutView from './components/WorkoutView';
import AdminView from './components/AdminView';
import { useWorkouts } from './hooks/useWorkouts';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const { workouts, todayRecord, incrementTask } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showReward, setShowReward] = useState(false);
  
  const totalTasks = 3;
  const completedTasks = todayRecord?.completedTasks || 0;

  const startRandomWorkout = () => {
    if (workouts.length === 0) {
      alert('菜單庫目前是空的，請先到管理介面新增運動！');
      return;
    }
    const randomIdx = Math.floor(Math.random() * workouts.length);
    setSelectedWorkout(workouts[randomIdx]);
    setCurrentView('workout');
  };

  const finishWorkout = () => {
    if (completedTasks < totalTasks) {
      incrementTask();
    }
    setCurrentView('home');
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <div className="app-container">
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)'
            }}
          >
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
              transition={{ duration: 1, repeat: 2 }}
            >
              <Trophy size={120} color="#FFD166" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' }} />
            </motion.div>
            <h1 style={{ color: 'var(--primary-dark)', fontSize: '3rem', marginTop: '1rem' }}>太棒了！</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>您完成了一項運動！</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="header">
        <h1>樂齡運動助手</h1>
        <p>今天想做點什麼運動呢？</p>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card"
            >
              <button className="btn-primary" onClick={startRandomWorkout}>
                <Play size={40} fill="currentColor" />
                <span>開始今日運動</span>
              </button>

              <div className="daily-progress">
                <div className="progress-text">
                  今日任務進度 {completedTasks} / {totalTasks}
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.min((completedTasks / totalTasks) * 100, 100)}%` }}
                  ></div>
                </div>
                {completedTasks >= totalTasks && (
                  <div style={{ marginTop: '1rem', color: 'var(--primary-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 /> 今日達標！您真棒！
                  </div>
                )}
              </div>
              
              <button className="btn-secondary" onClick={() => setCurrentView('admin')}>
                <Settings size={24} />
                <span>管理菜單庫</span>
              </button>
            </motion.div>
          )}

          {currentView === 'workout' && selectedWorkout && (
            <motion.div 
              key="workout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ flex: 1 }}
            >
              <WorkoutView 
                workout={selectedWorkout} 
                onComplete={finishWorkout} 
                onBack={() => setCurrentView('home')} 
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminView onBack={() => setCurrentView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
