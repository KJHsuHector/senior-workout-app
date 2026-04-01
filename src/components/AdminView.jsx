import React, { useState } from 'react';
import { ArrowLeft, Trash2, Edit2, PlusCircle, CheckCircle, XCircle, CloudOff } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';

export default function AdminView({ onBack }) {
  const { workouts, addWorkout, deleteWorkout, updateWorkout, isFirebaseEnabled } = useWorkouts();

  const initialFormState = {
    name: '',
    description: '',
    videoUrl: '',
    duration: 60,
    type: 'cardio'
  };

  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async () => {
    if (!formState.name) return;
    
    if (editingId) {
      await updateWorkout(editingId, formState);
      setEditingId(null);
    } else {
      await addWorkout({ ...formState });
    }
    setFormState(initialFormState);
  };

  const startEdit = (workout) => {
    setEditingId(workout.id);
    setFormState({
      name: workout.name || '',
      description: workout.description || '',
      videoUrl: workout.videoUrl || '',
      duration: workout.duration || 0,
      type: workout.type || 'cardio'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormState(initialFormState);
  };

  const handleDelete = async (id) => {
    if (confirm('確定要刪除這個運動菜單嗎？')) {
      await deleteWorkout(id);
      if (editingId === id) cancelEdit();
    }
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
      
      <div style={{ background: editingId ? 'rgba(255,209,102,0.3)' : 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', transition: 'all 0.3s' }}>
        <h3>{editingId ? '編輯運動菜單' : '新增運動'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
            placeholder="運動名稱 (如: 手部伸展)" 
            value={formState.name}
            onChange={(e) => setFormState({...formState, name: e.target.value})}
          />
          <textarea 
            style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' }} 
            placeholder="步驟說明 (簡單易懂為主)"
            value={formState.description}
            onChange={(e) => setFormState({...formState, description: e.target.value})}
          />
          <input 
            style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
            placeholder="YouTube 影片網址 (選填)" 
            value={formState.videoUrl}
            onChange={(e) => setFormState({...formState, videoUrl: e.target.value})}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }}
              value={formState.type}
              onChange={(e) => setFormState({...formState, type: e.target.value})}
            >
              <option value="cardio">有氧運動 (Cardio)</option>
              <option value="strength">肌力訓練 (Strength)</option>
            </select>
            <input 
              type="number"
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', width: '130px' }} 
              placeholder="秒數 (0為無)"
              value={formState.duration}
              onChange={(e) => setFormState({...formState, duration: parseInt(e.target.value) || 0})}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: editingId ? 'linear-gradient(135deg, #4ECDC4 0%, #20B2AA 100%)' : '' }} onClick={handleSubmit}>
              {editingId ? <CheckCircle size={24} /> : <PlusCircle size={24} />} 
              {editingId ? '儲存修改' : '新增運動'}
            </button>
            {editingId && (
              <button onClick={cancelEdit} style={{ background: '#eee', color: '#555', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
                <XCircle size={24} /> 取消
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3>現有菜單列表</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {workouts.map(w => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', display: 'block' }}>
                  {w.name} <span style={{fontSize: '0.9rem', color: '#888'}}>({w.type === 'cardio' ? '有氧' : '肌力'})</span>
                </strong>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {w.duration ? `⏱ ${w.duration} 秒` : '無計時限制'} 
                  {w.videoUrl && ' 🎬 附影片'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => startEdit(w)} style={{ background: '#E3F2FD', color: '#1E88E5', padding: '0.75rem', borderRadius: '8px' }}>
                  <Edit2 size={24} />
                </button>
                <button onClick={() => handleDelete(w.id)} style={{ background: '#FFE3E3', color: '#E63946', padding: '0.75rem', borderRadius: '8px' }}>
                  <Trash2 size={24} />
                </button>
              </div>
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
