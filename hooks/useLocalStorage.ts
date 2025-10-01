import { useState, useEffect } from 'react';
import { User, UserProgress, SessionRecord, UserTip } from '../types';
import { MOCK_USER_TIPS } from '../constants';

// --- Start of Data Seeding and Migration Logic ---

const STORAGE_VERSION_KEY = 'focusup-storage-version';
const CURRENT_STORAGE_VERSION = '5.0'; // Increment this version to trigger a data reset

const seedProUserData = () => {
  const users: User[] = [
    {
      id: 'pro-user-001',
      name: 'Jordan K.',
      email: 'pro@focusup.app',
      password: 'password123',
      joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 500).toISOString(), // Joined ~1.5 years ago
    },
  ];

  // This weekly score of 2400 minutes guarantees Rank #2.
  // It's higher than Dewi L. (2250) and lower than Rizky S. (2430).
  const weeklyDistribution = [350, 350, 350, 350, 350, 325, 325]; // Sum = 2400
  
  const recentSessions: SessionRecord[] = weeklyDistribution.map((duration, i) => ({
      id: `session-recent-${Date.now()}-${i}`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString(),
      durationMinutes: duration,
      targetMet: duration >= 240,
  }));
  
  // Create a rich history of older sessions
  const olderSessions: SessionRecord[] = Array.from({ length: 350 }).map((_, i) => ({
    id: `session-old-${Date.now()}-${i}`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 7)).toISOString(), // Start from 8 days ago
    durationMinutes: Math.floor(Math.random() * 200) + 60, // 60 to 260 minutes
    targetMet: Math.random() > 0.4,
  }));

  const proUserProgress: UserProgress = {
    totalFocusMinutes: 72000, // Even higher total focus time
    dailyTargetMinutes: 240,
    sessions: [...recentSessions, ...olderSessions],
  };

  localStorage.setItem('focusup-users', JSON.stringify(users));
  localStorage.setItem('userProgress_pro-user-001', JSON.stringify(proUserProgress));
  localStorage.setItem('focusup-userTips', JSON.stringify(MOCK_USER_TIPS));
};


// --- ARCHITECTURAL FIX FOR SEEDING ---
// This code runs ONCE when the module is first imported by the app.
try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_STORAGE_VERSION) {
        console.log(`[FocusUp Module Load] Storage version mismatch. Forcing a full reset. Old: ${storedVersion}, New: ${CURRENT_STORAGE_VERSION}`);
        localStorage.clear();
        seedProUserData();
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
        console.log("[FocusUp Module Load] Storage has been reset and seeded with 'pro@focusup.app'.");
    }
} catch (error) {
    console.error("Failed to run storage migration on module load. This can happen in restricted environments like private browsing.", error);
}
// --- End of Seeding Logic ---


function getStorageValue<T,>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch (error) {
        console.error('Error parsing JSON from localStorage', error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  // This effect ensures that if the key changes (e.g., user logs in/out),
  // the state is updated to reflect the data for the new key. This fixes the
  // core architectural bug where progress data wasn't loaded after login.
  useEffect(() => {
    setValue(getStorageValue(key, defaultValue));
  }, [key]);

  useEffect(() => {
    // This effect writes the current state to localStorage whenever it changes.
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
