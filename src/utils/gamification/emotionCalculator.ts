
/**
 * Calculate streak days from emotion entries
 * @param entries Array of emotion entries with date field
 */
export const calculateStreakDays = (entries: any[]): number => {
  if (!entries || entries.length === 0) return 0;
  
  // Sort entries by date (most recent first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentDate = today;
  let streakDays = 0;
  
  // Check if there's an entry for today
  const todayEntry = sortedEntries.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (todayEntry) {
    streakDays = 1;
    
    // Check previous days
    for (let i = 1; i <= 30; i++) { // Check up to 30 days back
      currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      currentDate.setHours(0, 0, 0, 0);
      
      const dayEntry = sortedEntries.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === currentDate.getTime();
      });
      
      if (dayEntry) {
        streakDays++;
      } else {
        break; // Streak is broken
      }
    }
  }
  
  return streakDays;
};

/**
 * Calculate progress percentage to next level
 * @param points Current points
 */
export const calculateProgressToNextLevel = (points: number): number => {
  // Each level is 100 points
  const currentLevelPoints = Math.floor(points / 100) * 100;
  const nextLevelPoints = currentLevelPoints + 100;
  
  // Calculate progress as percentage
  const pointsToNextLevel = nextLevelPoints - points;
  const progressPercentage = 100 - (pointsToNextLevel);
  
  return Math.max(0, Math.min(100, progressPercentage));
};
