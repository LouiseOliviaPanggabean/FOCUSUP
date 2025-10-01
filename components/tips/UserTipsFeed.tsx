import React, { useState } from 'react';
import { UserTip } from '../../types';
import { timeSince } from '../dashboard/helpers';
import { HeartIcon, HeartOutlineIcon } from '../icons/SidebarIcons';

interface UserTipsFeedProps {
    tips: UserTip[];
    onLike: (tipId: string) => void;
}

const UserTipsFeed: React.FC<UserTipsFeedProps> = ({ tips, onLike }) => {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    const handleLikeClick = (tipId: string) => {
        // Prevent liking system messages
        if (tipId.startsWith('system-')) return;

        onLike(tipId);
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            // This implementation doesn't allow unliking, just toggles visual state for feedback
            if (newSet.has(tipId)) {
                // In a real app, you might decrement the count here
                // newSet.delete(tipId);
            } else {
                newSet.add(tipId);
            }
            return newSet;
        });
    };

    if (tips.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-xl font-bold text-dark dark:text-dark-text mb-2">Community Feed</h3>
                <p className="text-muted dark:text-dark-muted">No community tips shared yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-4">
                {tips.map(tip => {
                    const isSystem = tip.authorId === 'system';
                    const isLiked = likedPosts.has(tip.id);

                    if (isSystem) {
                        return (
                            <div key={tip.id} className="bg-primary-light dark:bg-primary/20 p-4 rounded-lg shadow-md animate-fade-in flex items-start">
                                <span className="text-2xl mr-4">💡</span>
                                <div>
                                    <h4 className="font-bold text-primary">Pro Tip!</h4>
                                    <p className="text-muted dark:text-dark-muted italic">"{tip.content}"</p>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div key={tip.id} className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md animate-fade-in">
                            <div className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mr-3">
                                    {tip.authorName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-dark dark:text-dark-text">{tip.authorName}</p>
                                    <p className="text-xs text-muted dark:text-dark-muted">{timeSince(new Date(tip.timestamp))}</p>
                                </div>
                            </div>
                            <p className="text-dark dark:text-dark-text my-3 whitespace-pre-wrap">{tip.content}</p>
                            {tip.imageUrl && (
                                <img src={tip.imageUrl} alt="User tip attachment" className="mt-2 max-h-80 w-full object-cover rounded-lg border dark:border-gray-600" />
                            )}
                            <div className="border-t dark:border-gray-600 mt-4 pt-2 flex items-center">
                                <button
                                    onClick={() => handleLikeClick(tip.id)}
                                    className="flex items-center space-x-1 text-muted dark:text-dark-muted hover:text-red-500 transition-colors"
                                    disabled={isLiked}
                                >
                                    {isLiked ? <HeartIcon className="text-red-500 w-5 h-5" /> : <HeartOutlineIcon className="w-5 h-5" />}
                                    <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : ''}`}>{tip.likes}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserTipsFeed;