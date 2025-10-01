import React, { useState, useEffect, useCallback } from 'react';
import { SessionSettings } from '../types';
import { PlayIcon, PauseIcon, StopIcon } from './icons/TimerIcons';
import MotivationalMessage from './MotivationalMessage';
import { MOTIVATIONAL_MESSAGES } from '../constants';

interface TimerProps {
  settings: SessionSettings;
  onEndSession: (focusedMinutes: number) => void;
}

type TimerMode = 'focus' | 'break';

const Timer: React.FC<TimerProps> = ({ settings, onEndSession }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(settings.focusMinutes * 60);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);

  const switchMode = useCallback(() => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setSecondsLeft(
      (nextMode === 'focus' ? settings.focusMinutes : settings.breakMinutes) * 60
    );
  }, [mode, settings.focusMinutes, settings.breakMinutes]);

  useEffect(() => {
    if (!isActive) return;

    if (secondsLeft <= 0) {
      new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3').play().catch(e => console.error("Audio play failed", e));
      switchMode();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
      if (mode === 'focus') {
        setTotalFocusSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, switchMode]);

  const handleStop = () => {
    setIsActive(false);
    onEndSession(Math.floor(totalFocusSeconds / 60));
  };
  
  const handleToggle = () => {
    setIsActive(!isActive);
  };
  
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  
  const totalFocusMinutes = Math.floor(totalFocusSeconds / 60);
  const progressPercentage = Math.min((totalFocusMinutes / settings.targetMinutes) * 100, 100);

  return (
    <div className="flex flex-col items-center p-4">
      <div className={`text-xl font-semibold mb-4 px-4 py-1 rounded-full uppercase tracking-widest ${mode === 'focus' ? 'bg-primary text-white' : 'bg-success text-white'}`}>
        {mode}
      </div>
      <div className="text-8xl font-mono font-bold text-dark dark:text-dark-text mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <div className="w-full max-w-md mb-6">
          <p className="text-center text-muted dark:text-dark-muted mb-2">Total Focus: {totalFocusMinutes} min / {settings.targetMinutes} min</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                  className="bg-primary h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}>
              </div>
          </div>
      </div>

      <div className="flex space-x-6 mb-8">
        <button onClick={handleToggle} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full text-primary hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          {isActive ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={handleStop} className="p-4 bg-danger rounded-full text-white hover:bg-opacity-90 transition-colors">
          <StopIcon />
        </button>
      </div>
      
      <MotivationalMessage messages={MOTIVATIONAL_MESSAGES} />
    </div>
  );
};

export default Timer;