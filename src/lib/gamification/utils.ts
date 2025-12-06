
/**
 * Check if two dates are consecutive
 */
export function isConsecutiveDate(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Reset hours to compare just dates
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays === 1;
}

/**
 * Calculate streak days from emotion entries
 */
export function calculateStreakDays(emotionEntries: any[]): number {
  if (!emotionEntries.length) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Sort entries by date, most recent first
  const sortedEntries = [...emotionEntries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  let streakDays = 1; // Start with the first day
  let previousDate = new Date(sortedEntries[0].date);
  previousDate.setHours(0, 0, 0, 0);
  
  // Check for consecutive days
  for (let i = 1; i < sortedEntries.length; i++) {
    const currentDate = new Date(sortedEntries[i].date);
    currentDate.setHours(0, 0, 0, 0);
    
    // Calculate days difference
    const diffTime = previousDate.getTime() - currentDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      streakDays++;
      previousDate = currentDate;
    } else if (diffDays > 1) {
      // Break in streak
      break;
    }
    // Ignore same day entries
  }
  
  return streakDays;
}

// Gamification points for different activities
export const POINTS = {
  EMOTION_SCAN: 10,
  STREAK_DAY: 5,
  JOURNAL_ENTRY: 15,
  MEDITATION_COMPLETE: 20,
  COACH_CHAT: 5,
  BALANCED_EMOTION: 15
};
