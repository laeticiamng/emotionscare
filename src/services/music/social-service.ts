/**
 * Service social pour interactions musicales entre utilisateurs
 */

import { logger } from '@/lib/logger';
import { MusicBadge } from './badges-service';

export interface MusicFriend {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  totalXP: number;
  badgesCount: number;
  joinedAt: string;
  lastActive: string;
}

export interface FriendComparison {
  friend: MusicFriend;
  yourStats: UserMusicStats;
  theirStats: UserMusicStats;
  comparison: {
    levelDiff: number;
    xpDiff: number;
    badgesDiff: number;
    genresInCommon: string[];
  };
}

export interface UserMusicStats {
  totalListeningTime: number; // minutes
  totalTracks: number;
  uniqueGenres: number;
  uniqueMoods: number;
  favoriteGenre: string;
  level: number;
  xp: number;
  badges: MusicBadge[];
  challengesCompleted: number;
}

export interface SharedPlaylist {
  id: string;
  name: string;
  description: string;
  sharedBy: string;
  sharedByName: string;
  tracksCount: number;
  sharedAt: string;
  likes: number;
}

export interface FriendChallenge {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdByName: string;
  participants: string[];
  targetValue: number;
  type: 'genres' | 'tracks' | 'time' | 'streak';
  status: 'active' | 'completed';
  expiresAt: string;
  leaderboard: Array<{
    userId: string;
    displayName: string;
    progress: number;
    rank: number;
  }>;
}

/**
 * Récupérer la liste des amis
 */
export async function getFriends(userId: string): Promise<MusicFriend[]> {
  try {
    // Mock data
    const friends: MusicFriend[] = [
      {
        id: 'friend-1',
        userId: 'user-456',
        displayName: 'Sophie Martin',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        level: 8,
        totalXP: 3200,
        badgesCount: 12,
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'friend-2',
        userId: 'user-789',
        displayName: 'Thomas Dubois',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
        level: 6,
        totalXP: 2100,
        badgesCount: 8,
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'friend-3',
        userId: 'user-321',
        displayName: 'Emma Bernard',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        level: 10,
        totalXP: 4500,
        badgesCount: 15,
        joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    
    logger.info('Fetched friends list', { count: friends.length }, 'MUSIC');
    return friends;
  } catch (error) {
    logger.error('Failed to fetch friends', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Comparer ses statistiques avec un ami
 */
export async function compareFriendStats(
  userId: string,
  friendId: string
): Promise<FriendComparison | null> {
  try {
    const friends = await getFriends(userId);
    const friend = friends.find(f => f.userId === friendId);
    
    if (!friend) return null;
    
    // Mock stats
    const yourStats: UserMusicStats = {
      totalListeningTime: 1250,
      totalTracks: 342,
      uniqueGenres: 8,
      uniqueMoods: 6,
      favoriteGenre: 'Ambient',
      level: 7,
      xp: 2800,
      badges: [],
      challengesCompleted: 15
    };
    
    const theirStats: UserMusicStats = {
      totalListeningTime: 980,
      totalTracks: 289,
      uniqueGenres: 6,
      uniqueMoods: 5,
      favoriteGenre: 'Jazz',
      level: friend.level,
      xp: friend.totalXP,
      badges: [],
      challengesCompleted: 12
    };
    
    return {
      friend,
      yourStats,
      theirStats,
      comparison: {
        levelDiff: yourStats.level - theirStats.level,
        xpDiff: yourStats.xp - theirStats.xp,
        badgesDiff: yourStats.badges.length - theirStats.badges.length,
        genresInCommon: ['Classical', 'Electronic']
      }
    };
  } catch (error) {
    logger.error('Failed to compare stats', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Récupérer les playlists partagées
 */
export async function getSharedPlaylists(userId: string): Promise<SharedPlaylist[]> {
  try {
    const playlists: SharedPlaylist[] = [
      {
        id: 'shared-1',
        name: 'Morning Vibes',
        description: 'Ma playlist parfaite pour bien démarrer la journée',
        sharedBy: 'user-456',
        sharedByName: 'Sophie Martin',
        tracksCount: 24,
        sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 8
      },
      {
        id: 'shared-2',
        name: 'Focus Flow',
        description: 'Pour travailler en concentration maximale',
        sharedBy: 'user-789',
        sharedByName: 'Thomas Dubois',
        tracksCount: 18,
        sharedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 12
      }
    ];
    
    return playlists;
  } catch (error) {
    logger.error('Failed to fetch shared playlists', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Créer un challenge entre amis
 */
export async function createFriendChallenge(
  userId: string,
  challenge: Omit<FriendChallenge, 'id' | 'createdBy' | 'createdByName' | 'status' | 'leaderboard'>
): Promise<FriendChallenge> {
  try {
    const newChallenge: FriendChallenge = {
      ...challenge,
      id: `challenge-${Date.now()}`,
      createdBy: userId,
      createdByName: 'Vous',
      status: 'active',
      leaderboard: challenge.participants.map((id, index) => ({
        userId: id,
        displayName: `User ${index + 1}`,
        progress: 0,
        rank: index + 1
      }))
    };
    
    logger.info('Created friend challenge', { challengeId: newChallenge.id }, 'MUSIC');
    return newChallenge;
  } catch (error) {
    logger.error('Failed to create friend challenge', error as Error, 'MUSIC');
    throw error;
  }
}

/**
 * Récupérer les challenges entre amis
 */
export async function getFriendChallenges(userId: string): Promise<FriendChallenge[]> {
  try {
    const challenges: FriendChallenge[] = [
      {
        id: 'challenge-1',
        title: 'Marathon Musical',
        description: 'Qui écoutera le plus de musique cette semaine ?',
        createdBy: 'user-456',
        createdByName: 'Sophie Martin',
        participants: [userId, 'user-456', 'user-789'],
        targetValue: 500,
        type: 'time',
        status: 'active',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        leaderboard: [
          { userId: 'user-456', displayName: 'Sophie Martin', progress: 320, rank: 1 },
          { userId: userId, displayName: 'Vous', progress: 280, rank: 2 },
          { userId: 'user-789', displayName: 'Thomas Dubois', progress: 190, rank: 3 }
        ]
      }
    ];

    return challenges;
  } catch (error) {
    logger.error('Failed to fetch friend challenges', error as Error, 'MUSIC');
    return [];
  }
}

// ========== MÉTHODES ENRICHIES ==========

/**
 * Rechercher des amis par nom
 */
export async function searchFriends(userId: string, query: string): Promise<MusicFriend[]> {
  try {
    const friends = await getFriends(userId);
    const lowerQuery = query.toLowerCase();
    return friends.filter(f =>
      f.displayName.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    logger.error('Failed to search friends', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les amis actifs récemment
 */
export async function getActiveFriends(userId: string, hoursAgo: number = 24): Promise<MusicFriend[]> {
  try {
    const friends = await getFriends(userId);
    const cutoff = Date.now() - hoursAgo * 60 * 60 * 1000;
    return friends.filter(f => new Date(f.lastActive).getTime() > cutoff);
  } catch (error) {
    logger.error('Failed to get active friends', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir le leaderboard global des amis
 */
export async function getFriendsLeaderboard(userId: string): Promise<Array<MusicFriend & { rank: number }>> {
  try {
    const friends = await getFriends(userId);
    return friends
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((friend, index) => ({
        ...friend,
        rank: index + 1
      }));
  } catch (error) {
    logger.error('Failed to get friends leaderboard', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les statistiques sociales
 */
export async function getSocialStats(userId: string): Promise<{
  friendsCount: number;
  activeFriendsCount: number;
  sharedPlaylistsCount: number;
  activeChallengesCount: number;
  totalBadgesInNetwork: number;
  avgNetworkLevel: number;
}> {
  try {
    const [friends, sharedPlaylists, challenges] = await Promise.all([
      getFriends(userId),
      getSharedPlaylists(userId),
      getFriendChallenges(userId)
    ]);

    const activeFriends = friends.filter(f =>
      Date.now() - new Date(f.lastActive).getTime() < 24 * 60 * 60 * 1000
    );

    const activeChallenges = challenges.filter(c => c.status === 'active');
    const totalBadges = friends.reduce((sum, f) => sum + f.badgesCount, 0);
    const avgLevel = friends.length > 0
      ? Math.round(friends.reduce((sum, f) => sum + f.level, 0) / friends.length)
      : 0;

    return {
      friendsCount: friends.length,
      activeFriendsCount: activeFriends.length,
      sharedPlaylistsCount: sharedPlaylists.length,
      activeChallengesCount: activeChallenges.length,
      totalBadgesInNetwork: totalBadges,
      avgNetworkLevel: avgLevel
    };
  } catch (error) {
    logger.error('Failed to get social stats', error as Error, 'MUSIC');
    return {
      friendsCount: 0, activeFriendsCount: 0, sharedPlaylistsCount: 0,
      activeChallengesCount: 0, totalBadgesInNetwork: 0, avgNetworkLevel: 0
    };
  }
}

/**
 * Liker une playlist partagée
 */
export async function likeSharedPlaylist(playlistId: string): Promise<boolean> {
  try {
    logger.info('Playlist liked', { playlistId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Failed to like playlist', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Rejoindre un challenge
 */
export async function joinChallenge(userId: string, challengeId: string): Promise<boolean> {
  try {
    logger.info('Joined challenge', { userId, challengeId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Failed to join challenge', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Quitter un challenge
 */
export async function leaveChallenge(userId: string, challengeId: string): Promise<boolean> {
  try {
    logger.info('Left challenge', { userId, challengeId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Failed to leave challenge', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Mettre à jour la progression d'un challenge
 */
export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  progress: number
): Promise<boolean> {
  try {
    logger.info('Challenge progress updated', { userId, challengeId, progress }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Failed to update challenge progress', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Partager une playlist
 */
export async function sharePlaylist(
  userId: string,
  playlistData: Omit<SharedPlaylist, 'id' | 'sharedBy' | 'sharedAt' | 'likes'>
): Promise<SharedPlaylist | null> {
  try {
    const newPlaylist: SharedPlaylist = {
      ...playlistData,
      id: `shared-${Date.now()}`,
      sharedBy: userId,
      sharedAt: new Date().toISOString(),
      likes: 0
    };

    logger.info('Playlist shared', { playlistId: newPlaylist.id }, 'MUSIC');
    return newPlaylist;
  } catch (error) {
    logger.error('Failed to share playlist', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Obtenir les activités récentes des amis
 */
export async function getFriendsActivity(userId: string, limit: number = 20): Promise<Array<{
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  activityType: 'listened' | 'badge_earned' | 'level_up' | 'challenge_completed';
  description: string;
  timestamp: string;
}>> {
  try {
    const friends = await getFriends(userId);

    // Generate mock activity
    const activities = friends.flatMap(friend => [
      {
        friendId: friend.userId,
        friendName: friend.displayName,
        friendAvatar: friend.avatarUrl,
        activityType: 'listened' as const,
        description: 'a écouté "Calming Waves"',
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        friendId: friend.userId,
        friendName: friend.displayName,
        friendAvatar: friend.avatarUrl,
        activityType: 'badge_earned' as const,
        description: 'a obtenu le badge "Explorateur Musical"',
        timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString()
      }
    ]);

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    logger.error('Failed to get friends activity', error as Error, 'MUSIC');
    return [];
  }
}
