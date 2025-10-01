import React from 'react';
import { TrophyIcon } from './icons/StatIcons';
import { TrophyOutlineIcon } from './icons/SidebarIcons';
import { User, UserProgress } from '../types';
import { useLeaderboard } from '../hooks/useLeaderboard';
import RankTitle from './RankTitle';

interface LeaderboardProps {
  currentUser: User;
  userProgress: UserProgress;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, userProgress }) => {
  const { sortedLeaderboard } = useLeaderboard(currentUser, userProgress);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-500';
    if (rank === 1) return 'text-gray-500 dark:text-gray-400';
    if (rank === 2) return 'text-yellow-700 dark:text-yellow-600';
    return 'text-primary';
  };

  const hours = (minutes: number) => (minutes / 60).toFixed(1);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <TrophyOutlineIcon className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-dark dark:text-dark-text">Leaderboard Mingguan</h1>
      </div>
      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
        <p className="text-sm text-muted dark:text-dark-muted mb-4">Lihat perbandingan total fokusmu dengan pengguna lain dalam 7 hari terakhir!</p>
        <ul className="space-y-3">
          {sortedLeaderboard.map((user, index) => (
            <li key={user.id} className={`flex items-center p-3 rounded-md transition-all ${user.isCurrentUser ? 'bg-primary-light dark:bg-primary/20 border-l-4 border-primary' : 'bg-light dark:bg-dark-bg'}`}>
              <div className="flex items-center w-8">
                {index < 3 ? <TrophyIcon className={`w-6 h-6 ${getRankColor(index)}`} /> : <span className={`text-lg font-bold w-6 text-center text-primary`}>{index + 1}</span>}
              </div>
              <div className="flex-grow font-medium ml-4 flex items-center space-x-2">
                 <span className={`${user.isCurrentUser ? 'text-primary' : 'text-dark dark:text-dark-text'}`}>{user.name}</span>
                 <RankTitle rank={index + 1} isTextOnly />
              </div>
              <span className="font-semibold text-dark dark:text-dark-text">{hours(user.totalMinutes)}j</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;