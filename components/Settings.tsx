import React, { useState } from 'react';
import { SessionSettings, TimePattern } from '../types';
import { PlayOutlineIcon } from './icons/SidebarIcons';

interface SettingsProps {
  onStart: (settings: SessionSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ onStart }) => {
  const [targetMinutes, setTargetMinutes] = useState(120);
  const [timePattern, setTimePattern] = useState<TimePattern>('pomodoro');
  
  const [customFocus, setCustomFocus] = useState(45);
  const [customBreak, setCustomBreak] = useState(15);

  const getPatternConfig = (pattern: TimePattern) => {
    switch (pattern) {
      case 'pomodoro': return { focus: 25, break: 5 };
      case 'deep-work': return { focus: 50, break: 10 };
      case 'custom': return { focus: customFocus, break: customBreak };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = getPatternConfig(timePattern);
    onStart({
      targetMinutes,
      timePattern,
      focusMinutes: config.focus,
      breakMinutes: config.break,
    });
  };
  
  const PatternButton: React.FC<{
    pattern: TimePattern,
    title: string,
    description: string
  }> = ({ pattern, title, description }) => (
    <button
      type="button"
      onClick={() => setTimePattern(pattern)}
      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
        timePattern === pattern
          ? 'bg-primary text-white border-primary'
          : 'bg-white dark:bg-dark-card dark:text-dark-text dark:border-gray-600 hover:bg-primary-light dark:hover:bg-primary/20 hover:border-primary-light'
      }`}
    >
      <p className="font-bold">{title}</p>
      <p className={`text-sm ${timePattern === pattern ? 'text-white/80' : 'text-muted dark:text-dark-muted'}`}>{description}</p>
    </button>
  );

  return (
    <div className="animate-fade-in">
        <div className="flex items-center mb-8">
            <PlayOutlineIcon className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-dark dark:text-dark-text">Focus Tracker</h1>
        </div>
      
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col items-center">
            <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md w-full mb-8">
                <label htmlFor="target-minutes" className="block text-center text-lg font-medium text-muted dark:text-dark-muted mb-4">
                    Input Target Waktu Belajar (Total)
                </label>
                <input
                    type="number"
                    id="target-minutes"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(Math.max(30, parseInt(e.target.value, 10)))}
                    min="30"
                    className="w-full text-center text-7xl font-bold border-0 border-b-2 border-primary bg-transparent text-dark dark:text-dark-text focus:ring-0 focus:border-primary-dark"
                />
                <p className="text-center text-muted dark:text-dark-muted mt-2">Menit (Misal: 120 menit = 2 jam)</p>

                <h3 className="text-center text-lg font-medium text-muted dark:text-dark-muted mt-8 mb-4">Opsi Pola Waktu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PatternButton pattern="pomodoro" title="Pomodoro" description="25m Fokus + 5m Istirahat" />
                    <PatternButton pattern="deep-work" title="Deep Work" description="50m Fokus + 10m Istirahat" />
                    <PatternButton pattern="custom" title="Custom" description="Atur Manual" />
                </div>
                
                {timePattern === 'custom' && (
                    <div className="grid grid-cols-2 gap-4 mt-4 animate-fade-in bg-primary-light dark:bg-primary/20 p-4 rounded-lg">
                        <div>
                            <label htmlFor="custom-focus" className="block text-sm font-medium text-muted dark:text-dark-muted mb-1">Fokus (menit)</label>
                            <input type="number" id="custom-focus" value={customFocus} onChange={e => setCustomFocus(parseInt(e.target.value))} min="1" className="w-full rounded-md border-gray-300 dark:bg-dark-card dark:border-gray-600 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="custom-break" className="block text-sm font-medium text-muted dark:text-dark-muted mb-1">Istirahat (menit)</label>
                            <input type="number" id="custom-break" value={customBreak} onChange={e => setCustomBreak(parseInt(e.target.value))} min="1" className="w-full rounded-md border-gray-300 dark:bg-dark-card dark:border-gray-600 shadow-sm" />
                        </div>
                    </div>
                )}
            </div>
            
            <button type="submit" className="w-full max-w-sm bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300">
              Mulai Tracker
            </button>
        </form>
    </div>
  );
};

export default Settings;