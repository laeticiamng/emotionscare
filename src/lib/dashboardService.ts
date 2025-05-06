
import { supabase } from '@/integrations/supabase/client';

export type SegmentFilter = {
  dimensionKey: string | null;
  optionKey: string | null;
};

// Cache management for API responses
const responseCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

// Cache expiration in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Generate cache key based on parameters
const generateCacheKey = (metric: string, days: number, segment?: SegmentFilter) => {
  return `${metric}|${days}|${segment?.dimensionKey || 'all'}|${segment?.optionKey || 'all'}`;
};

// Check if cache is valid
const isCacheValid = (cacheEntry: { timestamp: number }) => {
  return Date.now() - cacheEntry.timestamp < CACHE_EXPIRATION;
};

export const fetchUsersAvgScore = async (days: number = 7, segment?: SegmentFilter): Promise<Array<{ date: string; value: number }>> => {
  try {
    const cacheKey = generateCacheKey('usersAvgScore', days, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Apply segment filter if provided
    let mockData = [
      { date: '1/5', value: 72 },
      { date: '2/5', value: 75 },
      { date: '3/5', value: 71 },
      { date: '4/5', value: 74 },
      { date: '5/5', value: 77 },
      { date: '6/5', value: 76 },
      { date: '7/5', value: 75.5 },
    ];
    
    // Apply segment filter (mock implementation)
    if (segment?.dimensionKey && segment?.optionKey) {
      // Modify data based on segment
      switch (segment.dimensionKey) {
        case 'role':
          if (segment.optionKey === 'hr') {
            // HR tends to have higher scores in this mock
            mockData = mockData.map(item => ({ ...item, value: Math.min(100, item.value + 5) }));
          } else if (segment.optionKey === 'employee') {
            // Employees have slightly lower scores
            mockData = mockData.map(item => ({ ...item, value: Math.max(0, item.value - 3) }));
          }
          break;
          
        case 'wellbeingScore':
          // Directly apply filter based on wellbeing score groups
          if (segment.optionKey === 'high') {
            mockData = mockData.map(item => ({ ...item, value: Math.min(100, item.value + 10) }));
          } else if (segment.optionKey === 'medium') {
            // Medium scores around 60-70
            mockData = mockData.map(item => ({ ...item, value: 65 + (Math.random() * 10) }));
          } else if (segment.optionKey === 'low') {
            // Low scores under 60
            mockData = mockData.map(item => ({ ...item, value: 40 + (Math.random() * 15) }));
          }
          break;
      }
    }
    
    // Simuler plus de données pour des périodes plus longues
    if (days > 7) {
      for (let i = 8; i <= days; i++) {
        mockData.push({
          date: `${i % 30}/5`,
          value: 70 + Math.random() * 10
        });
      }
    }
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: mockData,
      timestamp: Date.now()
    });
    
    return mockData;
  } catch (error) {
    console.error('Error fetching average scores:', error);
    return [];
  }
};

export const fetchUsersWithStatus = async (status: string, days: number = 7, segment?: SegmentFilter): Promise<number> => {
  try {
    const cacheKey = generateCacheKey(`usersWithStatus-${status}`, days, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Base result
    let result = status === 'absent' ? Math.floor(3 + Math.random() * 3) : Math.floor(15 + Math.random() * 10);
    
    // Apply segment filter (mock implementation)
    if (segment?.dimensionKey && segment?.optionKey) {
      // Modify data based on segment
      if (segment.dimensionKey === 'engagement') {
        if (status === 'absent' && segment.optionKey === 'low') {
          // Low engagement users tend to be more absent
          result *= 1.5;
        } else if (status !== 'absent' && segment.optionKey === 'high') {
          // High engagement users tend to be more present
          result *= 1.3;
        }
      }
    }
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error(`Error fetching users with status ${status}:`, error);
    return 0;
  }
};

export const fetchJournalStats = async (days: number = 7, segment?: SegmentFilter): Promise<Array<{ date: string; score: number; count: number }>> => {
  try {
    const cacheKey = generateCacheKey('journalStats', days, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Dans une application réelle, cette fonction ferait une requête Supabase
    // pour obtenir les statistiques du journal
    const result = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let baseScore = Math.floor(65 + Math.random() * 20);
      let baseCount = Math.floor(5 + Math.random() * 15);
      
      // Apply segment filter (mock implementation)
      if (segment?.dimensionKey && segment?.optionKey) {
        switch(segment.dimensionKey) {
          case 'team':
            // Different teams have different patterns
            if (segment.optionKey === 'paris') {
              baseScore += 5;
            } else if (segment.optionKey === 'lyon') {
              baseScore -= 3;
              baseCount *= 0.7; // Fewer entries
            }
            break;
            
          case 'program':
            // People in coaching programs tend to journal more
            if (segment.optionKey === 'coaching') {
              baseCount *= 1.5;
            }
            break;
        }
      }
      
      result.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        score: Math.min(100, baseScore),
        count: Math.round(baseCount)
      });
    }
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching journal stats:', error);
    return [];
  }
};

export const fetchSocialActivityStats = async (segment?: SegmentFilter): Promise<{
  totalPosts: number;
  moderationRate: number;
  topHashtags: Array<{ tag: string; count: number }>;
}> => {
  try {
    const cacheKey = generateCacheKey('socialActivityStats', 0, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Base statistics
    let totalPosts = 126;
    let moderationRate = 5;
    let topHashtags = [
      { tag: "#bienetre", count: 28 },
      { tag: "#teamspirit", count: 21 },
      { tag: "#détente", count: 18 },
      { tag: "#santé", count: 14 },
      { tag: "#équipe", count: 12 },
      { tag: "#motivation", count: 10 }
    ];
    
    // Apply segment filter (mock implementation)
    if (segment?.dimensionKey && segment?.optionKey) {
      switch(segment.dimensionKey) {
        case 'role':
          if (segment.optionKey === 'hr') {
            // HR posts more about well-being
            topHashtags = [
              { tag: "#bienetre", count: 35 },
              { tag: "#equilibre", count: 28 },
              { tag: "#santémentale", count: 24 },
              { tag: "#prévention", count: 18 },
              { tag: "#mindfulness", count: 15 },
            ];
            totalPosts = 95;
          } else if (segment.optionKey === 'manager') {
            // Managers focus on team spirit
            topHashtags = [
              { tag: "#teamspirit", count: 32 },
              { tag: "#leadership", count: 25 },
              { tag: "#motivation", count: 21 },
              { tag: "#objectifs", count: 16 },
              { tag: "#équipe", count: 14 },
            ];
            totalPosts = 110;
          }
          break;
          
        case 'team':
          // Adjust total posts based on team size
          if (segment.optionKey === 'paris') {
            totalPosts = 78;
          } else if (segment.optionKey === 'lille') {
            totalPosts = 34;
          } else if (segment.optionKey === 'lyon') {
            totalPosts = 46;
          }
          break;
      }
    }
    
    const result = {
      totalPosts,
      moderationRate,
      topHashtags
    };
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching social activity stats:', error);
    return {
      totalPosts: 0,
      moderationRate: 0,
      topHashtags: []
    };
  }
};

export const fetchGamificationStats = async (segment?: SegmentFilter): Promise<{
  activeUsersPercent: number;
  totalBadges: number;
}> => {
  try {
    const cacheKey = generateCacheKey('gamificationStats', 0, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Base statistics
    let activeUsersPercent = 68;
    let totalBadges = 24;
    
    // Apply segment filter (mock implementation)
    if (segment?.dimensionKey && segment?.optionKey) {
      switch(segment.dimensionKey) {
        case 'engagement':
          // Direct correlation with engagement segment
          if (segment.optionKey === 'high') {
            activeUsersPercent = 95;
            totalBadges = 42;
          } else if (segment.optionKey === 'medium') {
            activeUsersPercent = 68;
            totalBadges = 24;
          } else if (segment.optionKey === 'low') {
            activeUsersPercent = 35;
            totalBadges = 11;
          }
          break;
          
        case 'program':
          // People in different programs earn different numbers of badges
          if (segment.optionKey === 'coaching') {
            totalBadges = 32;
            activeUsersPercent = 76;
          } else if (segment.optionKey === 'microlearning') {
            totalBadges = 29;
            activeUsersPercent = 81;
          }
          break;
      }
    }
    
    const result = {
      activeUsersPercent,
      totalBadges
    };
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    return {
      activeUsersPercent: 0,
      totalBadges: 0
    };
  }
};

export const fetchVRCount = async (segment?: SegmentFilter): Promise<number> => {
  try {
    const cacheKey = generateCacheKey('vrCount', 0, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Base count
    let count = 8;
    
    // Apply segment filter (mock implementation)
    if (segment?.dimensionKey && segment?.optionKey) {
      if (segment.dimensionKey === 'wellbeingScore') {
        if (segment.optionKey === 'low') {
          // Users with low well-being use VR sessions more
          count = 12;
        } else if (segment.optionKey === 'high') {
          // Users with high well-being use VR sessions less
          count = 5;
        }
      }
    }
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: count,
      timestamp: Date.now()
    });
    
    return count;
  } catch (error) {
    console.error('Error fetching VR count:', error);
    return 0;
  }
};

export const fetchBadgesCount = async (userId: string, segment?: SegmentFilter): Promise<number> => {
  try {
    const cacheKey = generateCacheKey(`badges-${userId}`, 0, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    // Base result based on user
    let count = userId === '1' ? 2 : 0;
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: count,
      timestamp: Date.now()
    });
    
    return count;
  } catch (error) {
    console.error('Error fetching badges count:', error);
    return 0;
  }
};

export const fetchReports = async (metrics: string[], days: number = 7, segment?: SegmentFilter): Promise<Record<string, any[]>> => {
  try {
    const cacheKey = generateCacheKey(`reports-${metrics.join(',')}`, days, segment);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && isCacheValid(cachedResult)) {
        return cachedResult.data;
      }
    }
    
    const result: Record<string, any[]> = {};
    
    for (const metric of metrics) {
      let baseData: any[] = [];
      
      if (metric === 'absenteeism') {
        baseData = [
          { date: '1/5', value: 3.5 },
          { date: '2/5', value: 3.2 },
          { date: '3/5', value: 3.8 },
          { date: '4/5', value: 4.0 },
          { date: '5/5', value: 3.6 },
          { date: '6/5', value: 3.2 },
          { date: '7/5', value: 3.0 },
        ];
      } else if (metric === 'productivity') {
        baseData = [
          { date: '1/5', value: 72 },
          { date: '2/5', value: 75 },
          { date: '3/5', value: 78 },
          { date: '4/5', value: 80 },
          { date: '5/5', value: 82 },
          { date: '6/5', value: 85 },
          { date: '7/5', value: 88 },
        ];
      }
      
      // Apply segment filter (mock implementation)
      if (segment?.dimensionKey && segment?.optionKey) {
        switch(segment.dimensionKey) {
          case 'role':
            if (metric === 'absenteeism' && segment.optionKey === 'hr') {
              // HR has lower absenteeism
              baseData = baseData.map(item => ({ ...item, value: item.value * 0.8 }));
            } else if (metric === 'productivity' && segment.optionKey === 'manager') {
              // Managers have higher productivity
              baseData = baseData.map(item => ({ ...item, value: Math.min(100, item.value * 1.1) }));
            }
            break;
            
          case 'engagement':
            if (metric === 'productivity') {
              // Direct correlation between engagement and productivity
              if (segment.optionKey === 'high') {
                baseData = baseData.map(item => ({ ...item, value: Math.min(100, item.value * 1.15) }));
              } else if (segment.optionKey === 'low') {
                baseData = baseData.map(item => ({ ...item, value: item.value * 0.85 }));
              }
            }
            
            if (metric === 'absenteeism') {
              // Inverse correlation between engagement and absenteeism
              if (segment.optionKey === 'high') {
                baseData = baseData.map(item => ({ ...item, value: item.value * 0.7 }));
              } else if (segment.optionKey === 'low') {
                baseData = baseData.map(item => ({ ...item, value: item.value * 1.4 }));
              }
            }
            break;
        }
      }
      
      result[metric] = baseData;
    }
    
    // Save to cache
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return {};
  }
};

// Function to clear cache for specific keys or all cache
export const clearCache = (pattern?: string): void => {
  if (pattern) {
    // Clear specific pattern
    const keysToDelete: string[] = [];
    responseCache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => responseCache.delete(key));
  } else {
    // Clear all cache
    responseCache.clear();
  }
};
