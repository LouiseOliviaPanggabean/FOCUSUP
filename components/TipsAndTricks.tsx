import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LEARNING_TIPS, MOTIVATIONAL_MESSAGES } from '../constants';
import { LightbulbIcon, RefreshIcon } from './icons/SidebarIcons';
import { User, UserProgress, UserTip } from '../types';
import { useLeaderboard } from '../hooks/useLeaderboard';
import SubmitTipForm from './tips/SubmitTipForm';
import UserTipsFeed from './tips/UserTipsFeed';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getRankDetails } from './RankTitle';

interface TipsAndTricksProps {
    currentUser: User;
    userProgress: UserProgress;
}

const PULL_THRESHOLD = 80;
const REFRESH_DURATION = 1500;

const TipsAndTricks: React.FC<TipsAndTricksProps> = ({ currentUser, userProgress }) => {
    const { currentUserRank } = useLeaderboard(currentUser, userProgress);
    const [userTips, setUserTips] = useLocalStorage<UserTip[]>('focusup-userTips', []);

    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [pullDelta, setPullDelta] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const mainScrollRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        mainScrollRef.current = document.querySelector('main');
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isRefreshing) return;
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartY || isRefreshing) return;

        if (mainScrollRef.current && mainScrollRef.current.scrollTop > 0) {
            setTouchStartY(null);
            return;
        }

        const delta = e.touches[0].clientY - touchStartY;
        if (delta > 0) {
            setPullDelta(delta);
        }
    };

    const handleTouchEnd = () => {
        if (isRefreshing || !touchStartY) return;

        if (pullDelta > PULL_THRESHOLD) {
            setIsRefreshing(true);
            setTimeout(() => {
                setIsRefreshing(false);
            }, REFRESH_DURATION);
        }

        setTouchStartY(null);
        setPullDelta(0);
    };

    const isTopContributor = currentUserRank !== null && currentUserRank <= 50;
    
    const rankDetails = useMemo(() => {
        if (currentUserRank === null) return null;
        return getRankDetails(currentUserRank);
    }, [currentUserRank]);

    const handleAddTip = (content: string, imageUrl?: string) => {
        const newTip: UserTip = {
            id: new Date().toISOString(),
            authorId: currentUser.id,
            authorName: currentUser.name,
            content,
            imageUrl,
            timestamp: new Date().toISOString(),
            likes: 0,
        };
        setUserTips(prevTips => [newTip, ...prevTips]);
    };
    
    const handleLike = (tipId: string) => {
        setUserTips(prevTips => 
            prevTips.map(tip => 
                tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip
            )
        );
    };

    const combinedFeed = useMemo(() => {
        const systemTips: UserTip[] = MOTIVATIONAL_MESSAGES.map((msg, index) => ({
            id: `system-${index}`,
            authorId: 'system',
            authorName: 'FocusUp Bot',
            content: msg,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4 * index).toISOString(),
            likes: 0,
        }));
        
        const allPosts = [...userTips, ...systemTips];
        return allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
    }, [userTips]);

    const rotation = isRefreshing ? 0 : Math.min(pullDelta / PULL_THRESHOLD, 1) * 360;
    const opacity = isRefreshing ? 1 : Math.min(pullDelta / (PULL_THRESHOLD / 1.5), 1);
    const contentTransform = isRefreshing 
        ? `translateY(${PULL_THRESHOLD / 2}px)` 
        : `translateY(${pullDelta}px)`;
    const contentTransition = isRefreshing || touchStartY === null ? 'transform 0.3s ease' : 'none';


    return (
        <div 
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className="absolute top-[-50px] left-0 right-0 flex items-center justify-center p-4"
                style={{ opacity: opacity, transition: 'opacity 0.2s ease' }}
            >
                {isRefreshing ? (
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <RefreshIcon className="w-6 h-6 text-primary" style={{ transform: `rotate(${rotation}deg)` }} />
                )}
            </div>

            <div 
                className="animate-fade-in"
                style={{ transform: contentTransform, transition: contentTransition }}
            >
                <div className="flex items-center mb-8">
                    <LightbulbIcon className="w-8 h-8 text-primary mr-3" />
                    <h1 className="text-3xl font-bold text-dark dark:text-dark-text">Community Feed</h1>
                </div>

                <div className="space-y-8 max-w-2xl mx-auto">
                    {isTopContributor && rankDetails && (
                        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-primary mb-3">Share Your Wisdom, {rankDetails.title}! {rankDetails.icon}</h3>
                            <p className="text-muted dark:text-dark-muted mb-4">You're a top performer! Inspire the community with your focus secrets.</p>
                            <SubmitTipForm onAddTip={handleAddTip} />
                        </div>
                    )}
                    
                    <UserTipsFeed tips={combinedFeed} onLike={handleLike} />
                </div>
            </div>
        </div>
    );
};

export default TipsAndTricks;