import React, { useState } from 'react';
import { ArrowLeft, Trash2, PlusCircle, CloudOff } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';

export default function AdminView({ onBack }) {
  const { workouts, addWorkout, deleteWorkout, isFirebaseEnabled } = useWorkouts();

  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    duration: 60,
    type: 'cardio'
  });

  const handleAdd = async () => {
    if (!newWorkout.name) return;
    await addWorkout({ ...newWorkout });
    setNewWorkout({ name: '', description: '', duration: 60, type: 'cardio' });
  };

  const handleDelete = async (id) => {
    await deleteWorkout(id);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <button className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', marginBottom: '1rem' }} onClick={onBack}>
        <ArrowLeft size={20} /> 返回首頁
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>菜單庫管理</h2>
        {!isFirebaseEnabled && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E63946', fontSize: '0.9rem', background: '#FFE3E3', padding: '0.5rem 1rem', borderRadius: '20px' }}>
            <CloudOff size={16} /> 本地模式
          </span>
        )}
      </div>
      
      <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h3>新增運動</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
            placeholder="運動名稱 (如: 手部伸展)" 
            value={newWorkout.name}
            onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
          />
          <textarea 
            style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' }} 
            placeholder="步驟說明 (簡單易懂為主)"
            value={newWorkout.description}
            onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }}
              value={newWorkout.type}
              onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
            >
              <option value="cardio">有氧運動 (Cardio)</option>
              <option value="strength">肌力訓練 (Strength)</option>
            </select>
            <input 
              type="number"
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', width: '130px' }} 
              placeholder="秒數 (0為無)"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({...newWorkout, duration: parseInt(e.target.value) || 0})}
            />
          </div>
          <button className="btn-primary" style={{ padding: '1rem', borderRadius: '8px' }} onClick={handleAdd}>
            <PlusCircle size={24} /> 新增運動
          </button>
        </div>
      </div>

      <div>
        <h3>現有菜單列表</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {workouts.map(w => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', display: 'block' }}>{w.name} <span style={{fontSize: '0.9rem', color: '#888'}}>({w.type === 'cardio' ? '有氧' : '肌力'})</span></strong>
                <span style={{ color: 'var(--text-muted)' }}>{w.duration ? `${w.duration} 秒` : '無計時限制'}</span>
              </div>
              <button onClick={() => handleDelete(w.id)} style={{ background: '#FFE3E3', color: '#E63946', padding: '0.75rem', borderRadius: '8px' }}>
                <Trash2 size={24} />
              </button>
            </div>
          ))}
          {workouts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>目前沒有任何菜單。</p>
          )}
        </div>
      </div>
    </div>
  );
}
