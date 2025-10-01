import React, { useState, useMemo } from 'react';
import { SessionSettings, UserProgress, User, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Settings from './components/Settings';
import Timer from './components/Timer';
import Progress from './components/Progress';
import Leaderboard from './components/Leaderboard';
import Auth from './components/auth/Auth';
import TipsAndTricks from './components/TipsAndTricks';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  useTheme(); // Initialize and apply theme from local storage
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('focusup-currentUser', null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const userProgressKey = useMemo(() => 
    currentUser ? `userProgress_${currentUser.id}` : 'userProgress_guest',
    [currentUser]
  );
  
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>(
    userProgressKey,
    { sessions: [], totalFocusMinutes: 0, dailyTargetMinutes: 180 }
  );
  
  const [settings, setSettings] = useState<SessionSettings | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const handleLogout = () => {
    setCurrentUser(null);
    setIsSessionActive(false);
    setSettings(null);
    setActiveView('dashboard');
  };

  const startSession = (newSettings: SessionSettings) => {
    setSettings(newSettings);
    setUserProgress(prev => ({
      ...prev,
      dailyTargetMinutes: newSettings.targetMinutes,
    }));
    setIsSessionActive(true);
  };

  const endSession = (focusMinutes: number) => {
    if (settings) {
      const targetMinutes = settings.targetMinutes;
      const newSession = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        durationMinutes: focusMinutes,
        targetMet: focusMinutes >= targetMinutes,
      };

      setUserProgress(prev => ({
        ...prev,
        sessions: [...prev.sessions, newSession],
        totalFocusMinutes: prev.totalFocusMinutes + focusMinutes,
      }));
    }
    setIsSessionActive(false);
    setSettings(null);
    setActiveView('dashboard'); // Return to dashboard after session
  };
  
  const currentUserTotalMinutes = userProgress.totalFocusMinutes;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={currentUser!} progress={userProgress} setActiveView={setActiveView} />;
      case 'start-focus':
        return <Settings onStart={startSession} />;
      case 'statistics':
        return <Progress userProgress={userProgress} />;
      case 'leaderboard':
        return <Leaderboard currentUser={currentUser!} userProgress={userProgress} />;
      case 'tips-tricks':
        return <TipsAndTricks currentUser={currentUser!} userProgress={userProgress} />;
      default:
        return <Dashboard user={currentUser!} progress={userProgress} setActiveView={setActiveView} />;
    }
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-dark-text font-sans p-4 sm:p-8 flex items-center justify-center">
        <Auth onLoginSuccess={setCurrentUser} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark-bg text-dark dark:text-dark-text font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {isSessionActive && settings ? (
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <Timer settings={settings} onEndSession={endSession} />
          </div>
        ) : (
          renderView()
        )}
      </main>
    </div>
  );
};

export default App;