/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarText: string;
  avatarUrl?: string;
  points: number;
}

/**
 * Practice leaderboard entry (simplified)
 */
export interface PracticeLeaderboardEntry {
  name: string;
  avatar: string;
  points: number;
  /** Time in minutes */
  time: number;
}

/**
 * User profile data
 */
export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar: string;
  status: string;
  position: string;
  experience: string;
  totalPoints: number;
  globalRank: number;
  /** Streak in days */
  streak: number;
}

/**
 * Activity data point
 */
export interface ActivityDataPoint {
  date: string;
  tasks: number;
}

/**
 * Achievement item
 */
export interface Achievement {
  title: string;
  desc: string;
  icon: string;
}
