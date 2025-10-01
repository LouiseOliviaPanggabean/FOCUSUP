import React from 'react';

interface RankTitleProps {
    rank: number;
    isTextOnly?: boolean;
}

export const getRankDetails = (rank: number): { title: string; icon: string; color: string } => {
    if (rank === 1) return { title: 'King', icon: '👑', color: 'text-yellow-400' };
    if (rank === 2) return { title: 'Duke', icon: '🥈', color: 'text-gray-400' };
    if (rank === 3) return { title: 'Marquis', icon: '🥉', color: 'text-amber-600' };
    if (rank <= 50) return { title: 'Master', icon: '⚔️', color: 'text-red-500' };
    if (rank <= 100) return { title: 'Knight', icon: '🛡️', color: 'text-blue-500' };
    if (rank <= 150) return { title: 'Virtuoso', icon: '🧠', color: 'text-purple-500' };
    return { title: 'Newbie', icon: '🌱', color: 'text-green-500' };
};

const RankTitle: React.FC<RankTitleProps> = ({ rank, isTextOnly = false }) => {
    const { title, icon, color } = getRankDetails(rank);

    if (isTextOnly) {
        return <span className={`text-xs font-bold ${color}`}>({title})</span>
    }

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')} ${color}`}>
            {icon} {title}
        </span>
    );
};

export default RankTitle;