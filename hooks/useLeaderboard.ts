import { useMemo } from 'react';
import { User, UserProgress, LeaderboardEntry, SessionRecord } from '../types';
import { MOCK_LEADERBOARD_DATA } from '../constants';

const getWeeklyMinutes = (sessions: SessionRecord[]): number => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sessions
        .filter(s => new Date(s.date) >= sevenDaysAgo)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
};

export const useLeaderboard = (currentUser: User | null, userProgress: UserProgress) => {

  const sortedLeaderboard = useMemo(() => {
    if (!currentUser) return MOCK_LEADERBOARD_DATA.sort((a, b) => b.totalMinutes - a.totalMinutes);
    
    const weeklyMinutes = getWeeklyMinutes(userProgress.sessions);

    const combinedData: LeaderboardEntry[] = [
      ...MOCK_LEADERBOARD_DATA,
      {
        id: currentUser.id,
        name: `${currentUser.name} (Anda)`,
        totalMinutes: weeklyMinutes, // Use weekly minutes for ranking
        isCurrentUser: true,
      },
    ];
    // Remove duplicates, keeping the one with higher minutes (or the current user's)
    const uniqueData = Array.from(new Map(combinedData.map(item => [item.id, item])).values());
    
    return uniqueData.sort((a, b) => b.totalMinutes - a.totalMinutes);
  }, [currentUser, userProgress.sessions]);

  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;
    const rank = sortedLeaderboard.findIndex(u => u.id === currentUser.id);
    return rank !== -1 ? rank + 1 : null;
  }, [sortedLeaderboard, currentUser]);

  return { sortedLeaderboard, currentUserRank };
};