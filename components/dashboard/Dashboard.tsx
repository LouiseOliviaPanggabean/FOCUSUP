import React, { useMemo } from 'react';
import { User, UserProgress, LeaderboardEntry, View } from '../../types';
import { MOCK_LEADERBOARD_DATA } from '../../constants';
import { timeSince } from './helpers';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import RankTitle from '../RankTitle';
import { CheckCircleIcon, XCircleIcon } from '../icons/StatIcons';

interface DashboardProps {
    user: User;
    progress: UserProgress;
    setActiveView: (view: View) => void;
}

const ProfileSummary: React.FC<{ user: User, progress: UserProgress }> = ({ user, progress }) => {
    const totalHours = (progress.totalFocusMinutes / 60).toFixed(0);
    const { currentUserRank } = useLeaderboard(user, progress);

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md h-full">
            <h3 className="font-bold text-lg mb-4">Ringkasan Profil</h3>
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mr-4">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-dark dark:text-dark-text">{user.name}</p>
                    <p className="text-sm text-muted dark:text-dark-muted">Bergabung {timeSince(new Date(user.joinDate))}</p>
                </div>
            </div>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                    <span className="text-muted dark:text-dark-muted">⏱️ Total Fokus:</span>
                    <span className="font-bold text-dark dark:text-dark-text">{totalHours} Jam</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-muted dark:text-dark-muted">🏆 Peringkat Mingguan:</span>
                    {currentUserRank !== null ? (
                        <div className="flex items-center space-x-2">
                             <span className="font-bold text-dark dark:text-dark-text">#{currentUserRank}</span>
                             <RankTitle rank={currentUserRank} />
                        </div>
                    ) : (
                         <span className="font-bold text-dark dark:text-dark-text">N/A</span>
                    )}
                </li>
            </ul>
        </div>
    );
};

const DailyProgress: React.FC<{ progress: UserProgress }> = ({ progress }) => {
    const { dailyMinutes } = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const daily = progress.sessions
            .filter(s => s.date.startsWith(today))
            .reduce((sum, s) => sum + s.durationMinutes, 0);
        return { dailyMinutes: daily };
    }, [progress]);

    const targetMinutes = progress.dailyTargetMinutes || 180; // Use dynamic target, fallback to 180
    const remainingMinutes = Math.max(0, targetMinutes - dailyMinutes);
    const percentage = targetMinutes > 0 ? Math.min((dailyMinutes / targetMinutes) * 100, 100) : 0;

    const hours = Math.floor(dailyMinutes / 60);
    const minutes = dailyMinutes % 60;

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md h-full">
            <h3 className="font-bold text-lg mb-4">Progress Harian</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-muted dark:text-dark-muted">Sudah Fokus</p>
                    <p className="font-bold text-success">
                        <span className="text-3xl">{hours}</span> Jam <span className="text-3xl">{minutes}</span> Menit
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted dark:text-dark-muted">Sisa Target</p>
                     <p className="font-bold text-danger">
                        <span className="text-3xl">{remainingMinutes}</span> Menit
                    </p>
                </div>
            </div>
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted dark:text-dark-muted">Status:</span>
                    <span className="font-bold text-dark dark:text-dark-text">{percentage.toFixed(0)}% Tercapai</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const CommunityTracker: React.FC<{ user: User, progress: UserProgress, setActiveView: (view: View) => void }> = ({ user, progress, setActiveView }) => {
    const { sortedLeaderboard } = useLeaderboard(user, progress);

    const hours = (minutes: number) => (minutes / 60).toFixed(1);

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Tracker Komunitas</h3>
                <button onClick={() => setActiveView('leaderboard')} className="text-sm text-primary font-medium hover:underline">Lihat Semua</button>
            </div>
            <ul className="space-y-3">
                {sortedLeaderboard.slice(0, 3).map((u, index) => (
                    <li key={u.id} className="flex items-center">
                        <span className="font-bold text-muted dark:text-dark-muted w-6">{index + 1}.</span>
                        <span className="flex-grow text-dark dark:text-dark-text">{u.name.replace(' (Anda)','')}</span>
                        <span className="font-bold text-primary">{hours(u.totalMinutes)}J</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const RecentActivity: React.FC<{ progress: UserProgress }> = ({ progress }) => {
    const recentSessions = progress.sessions.slice(0, 4);

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">Aktivitas Terkini</h3>
            {recentSessions.length === 0 ? (
                 <p className="text-muted dark:text-dark-muted text-center py-4">Anda belum memiliki sesi fokus. Mulai sesi pertama Anda sekarang!</p>
            ) : (
                <ul className="space-y-3">
                    {recentSessions.map(session => (
                        <li key={session.id} className="flex items-center justify-between p-3 bg-light dark:bg-dark-bg rounded-md">
                            <div className="flex items-center">
                                {session.targetMet ? (
                                    <CheckCircleIcon className="w-6 h-6 text-success mr-4 flex-shrink-0" />
                                ) : (
                                    <XCircleIcon className="w-6 h-6 text-danger mr-4 flex-shrink-0" />
                                )}
                                <div>
                                    <p className="font-semibold text-dark dark:text-dark-text">
                                        {new Date(session.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                    </p>
                                    <p className="text-sm text-muted dark:text-dark-muted">
                                        Fokus {session.targetMet ? 'mencapai target' : 'tidak mencapai target'}
                                    </p>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-primary">{session.durationMinutes}m</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ user, progress, setActiveView }) => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-dark dark:text-dark-text mb-8">Dashboard Utama</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <ProfileSummary user={user} progress={progress} />
                <DailyProgress progress={progress} />
                <CommunityTracker user={user} progress={progress} setActiveView={setActiveView} />
            </div>

            <div className="mb-8">
                <RecentActivity progress={progress} />
            </div>

            <div className="text-center">
                <button 
                    onClick={() => setActiveView('start-focus')}
                    className="w-full max-w-lg bg-primary text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 text-lg"
                >
                    Mulai Sesi Fokus Baru Sekarang
                </button>
            </div>
        </div>
    );
};

export default Dashboard;