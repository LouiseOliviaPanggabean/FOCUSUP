import React, { useMemo } from 'react';
import { UserProgress } from '../types';
import { TrophyIcon, ChartBarIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, FireIcon } from './icons/StatIcons';
import { ChartIcon } from './icons/SidebarIcons';
import SessionChart from './stats/SessionChart';

interface ProgressProps {
  userProgress: UserProgress;
}

const Progress: React.FC<ProgressProps> = ({ userProgress }) => {
  const { highestTracker, dailyTracker, targetsMet, targetsMissed } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const highest = userProgress.sessions.length > 0
      ? Math.max(...userProgress.sessions.map(s => s.durationMinutes))
      : 0;
      
    const daily = userProgress.sessions
      .filter(s => s.date.startsWith(today))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
      
    const met = userProgress.sessions.filter(s => s.targetMet).length;
    const missed = userProgress.sessions.length - met;

    return { highestTracker: highest, dailyTracker: daily, targetsMet: met, targetsMissed: missed };
  }, [userProgress]);

  const weeklyStats = useMemo(() => {
    const today = new Date();
    const weeklySessions = userProgress.sessions.filter(s => {
        const sessionDate = new Date(s.date);
        const diffDays = (today.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24);
        return diffDays < 7;
    });

    const totalWeeklyMinutes = weeklySessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    const minutesByDay: { [key: string]: number } = { 'Minggu': 0, 'Senin': 0, 'Selasa': 0, 'Rabu': 0, 'Kamis': 0, 'Jumat': 0, 'Sabtu': 0 };
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    weeklySessions.forEach(s => {
        const dayName = days[new Date(s.date).getDay()];
        minutesByDay[dayName] += s.durationMinutes;
    });

    let mostFocusedDay = 'N/A';
    let maxMinutes = 0;
    for (const day in minutesByDay) {
        if (minutesByDay[day] > maxMinutes) {
            maxMinutes = minutesByDay[day];
            mostFocusedDay = day;
        }
    }
    
    return {
        totalWeeklyMinutes,
        mostFocusedDay,
    };
}, [userProgress.sessions]);


  return (
    <div className="animate-fade-in">
        <div className="flex items-center mb-8">
            <ChartIcon className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-dark dark:text-dark-text">Statistik</h1>
        </div>
      <div className="space-y-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Ringkasan Mingguan</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-light dark:bg-dark-bg p-4 rounded-md">
                <CalendarIcon className="w-8 h-8 text-primary mr-4" />
                <div>
                  <p className="text-sm text-muted dark:text-dark-muted">Total Fokus Minggu Ini</p>
                  <p className="text-2xl font-bold text-dark dark:text-dark-text">{(weeklyStats.totalWeeklyMinutes / 60).toFixed(1)} <span className="text-base font-normal">jam</span></p>
                </div>
              </div>
              <div className="flex items-center bg-light dark:bg-dark-bg p-4 rounded-md">
                <FireIcon className="w-8 h-8 text-primary mr-4" />
                <div>
                  <p className="text-sm text-muted dark:text-dark-muted">Hari Paling Produktif</p>
                  <p className="text-2xl font-bold text-dark dark:text-dark-text">{weeklyStats.mostFocusedDay}</p>
                </div>
              </div>
            </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Statistik Total</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center bg-light dark:bg-dark-bg p-4 rounded-md">
              <TrophyIcon className="w-8 h-8 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted dark:text-dark-muted">Sesi Terlama</p>
                <p className="text-2xl font-bold text-dark dark:text-dark-text">{highestTracker} <span className="text-base font-normal">min</span></p>
              </div>
            </div>
            <div className="flex items-center bg-light dark:bg-dark-bg p-4 rounded-md">
              <ChartBarIcon className="w-8 h-8 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted dark:text-dark-muted">Fokus Hari Ini</p>
                <p className="text-2xl font-bold text-dark dark:text-dark-text">{dailyTracker} <span className="text-base font-normal">min</span></p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-bold text-dark dark:text-dark-text mb-3">Ringkasan Sesi</h4>
            <div className="space-y-3">
              <div className="flex items-center bg-light dark:bg-dark-bg p-3 rounded-md">
                <CheckCircleIcon className="w-6 h-6 text-success mr-3" />
                <p className="text-muted dark:text-dark-muted">Target Tercapai: <span className="font-bold text-dark dark:text-dark-text">{targetsMet}</span></p>
              </div>
              <div className="flex items-center bg-light dark:bg-dark-bg p-3 rounded-md">
                <XCircleIcon className="w-6 h-6 text-danger mr-3" />
                <p className="text-muted dark:text-dark-muted">Target Gagal: <span className="font-bold text-dark dark:text-dark-text">{targetsMissed}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Riwayat Fokus 7 Hari</h3>
            <SessionChart sessions={userProgress.sessions} />
        </div>
      </div>
    </div>
  );
};

export default Progress;