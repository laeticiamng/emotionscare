
/**
 * Calculate streak days from emotion entries
 */
export function calculateStreakDays(emotionsData: any[]): number {
  if (!emotionsData.length) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streakDays = 0;
  let currentDate = new Date(today);
  
  // Check for consecutive days with entries
  while (true) {
    // Format the date as yyyy-MM-dd to match with dates in the database
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Find if there's an entry for this date
    const hasEntryForDate = emotionsData.some(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toISOString().split('T')[0] === dateString;
    });
    
    if (hasEntryForDate) {
      streakDays++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streakDays;
}

/**
 * Calculate the progress percentage for the level bar
 */
export const calculateProgressToNextLevel = (points: number): number => {
  return Math.min(100, Math.round(((points % 100) / 100) * 100));
};
