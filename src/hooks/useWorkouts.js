import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const INITIAL_WORKOUTS = [
  { id: '1', name: '大字步走', description: '原地大幅度跨步走，雙手自然擺動。', duration: 30, type: 'cardio' },
  { id: '2', name: '椅子深蹲', description: '利用椅子輔助進行起立坐下。慢慢坐下，再慢慢起立。', duration: 0, type: 'strength' },
  { id: '3', name: '毛巾伸展', description: '雙手抓緊毛巾兩端，向上伸直後向後帶，伸展肩膀。', duration: 45, type: 'cardio' }
];

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [todayRecord, setTodayRecord] = useState({ completedTasks: 0, date: new Date().toLocaleDateString() });
  const isFirebaseEnabled = !!db;

  useEffect(() => {
    if (!isFirebaseEnabled) return;

    const q = collection(db, 'workouts');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (wks.length > 0) setWorkouts(wks);
    });
    
    const loadTodayRecord = async () => {
      const today = new Date().toLocaleDateString().replace(/\//g, '-');
      const recordRef = doc(db, 'daily_records', today);
      const docSnap = await getDoc(recordRef);
      if (docSnap.exists()) {
        setTodayRecord(docSnap.data());
      } else {
        await setDoc(recordRef, { completedTasks: 0, date: today });
      }
    };
    loadTodayRecord();

    return () => unsubscribe();
  }, [isFirebaseEnabled]);

  const addWorkout = async (workout) => {
    if(!isFirebaseEnabled) {
      setWorkouts(w => [...w, { id: Date.now().toString(), ...workout }]);
      return;
    }
    await addDoc(collection(db, 'workouts'), workout);
  };

  const deleteWorkout = async (id) => {
    if(!isFirebaseEnabled) {
      setWorkouts(w => w.filter(x => x.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'workouts', id));
  };

  const updateWorkout = async (id, updatedData) => {
    if(!isFirebaseEnabled) {
      setWorkouts(w => w.map(x => x.id === id ? { ...x, ...updatedData } : x));
      return;
    }
    await updateDoc(doc(db, 'workouts', id), updatedData);
  };

  const incrementTask = async () => {
    const newCount = todayRecord.completedTasks + 1;
    setTodayRecord({ ...todayRecord, completedTasks: newCount });
    if(isFirebaseEnabled) {
      const today = new Date().toLocaleDateString().replace(/\//g, '-');
      await updateDoc(doc(db, 'daily_records', today), { completedTasks: newCount });
    }
  };

  return { workouts, addWorkout, deleteWorkout, updateWorkout, todayRecord, incrementTask, isFirebaseEnabled };
}
