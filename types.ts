export enum SessionMode {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

export type TimePattern = 'pomodoro' | 'deep-work' | 'custom';

export type View = 'dashboard' | 'start-focus' | 'statistics' | 'leaderboard' | 'tips-tricks';

export interface SessionSettings {
  targetMinutes: number;
  timePattern: TimePattern;
  focusMinutes: number;
  breakMinutes: number;
}

export interface SessionRecord {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  targetMet: boolean;
}

export interface UserProgress {
  sessions: SessionRecord[];
  totalFocusMinutes: number;
  dailyTargetMinutes?: number;
}

export interface LeaderboardEntry {
  id: number | string;
  name: string;
  totalMinutes: number;
  isCurrentUser?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored for mock auth, not passed in props
  joinDate: string; // ISO String
}

export interface UserTip {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  imageUrl?: string; // base64 string
  timestamp: string; // ISO string
  likes: number;
}