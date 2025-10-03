
import React from 'react';

interface EmotionData {
  date: string;
  emotion: string;
  intensity: number;
  notes?: string;
}

interface EmotionCalendarProps {
  data: EmotionData[];
}

const EmotionCalendar: React.FC<EmotionCalendarProps> = ({ data }) => {
  // Create a date map for easier lookup
  const emotionMap = new Map();
  data.forEach((entry) => {
    emotionMap.set(entry.date, entry);
  });
  
  // Generate calendar days
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Get the day of the week the month starts on (0-6, 0 is Sunday)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Calculate total days needed in our calendar grid
  // (days in month + days to fill from previous month)
  const totalDays = lastDayOfMonth.getDate() + firstDayOfWeek;
  // Calculate rows needed (ceil to whole week)
  const totalWeeks = Math.ceil(totalDays / 7);
  
  // Generate calendar grid
  const calendarDays: Array<{ date: Date; hasEntry: boolean; emotion?: string; intensity?: number }> = [];
  
  // Add days from previous month to fill the first row
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDay = new Date(today.getFullYear(), today.getMonth(), -firstDayOfWeek + i + 1);
    calendarDays.push({ date: prevMonthDay, hasEntry: false });
  }
  
  // Add days from current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const entry = emotionMap.get(dateString);
    
    calendarDays.push({
      date,
      hasEntry: !!entry,
      emotion: entry?.emotion,
      intensity: entry?.intensity
    });
  }
  
  // Add days from next month to complete the last row
  const remainingDays = totalWeeks * 7 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDay = new Date(today.getFullYear(), today.getMonth() + 1, i);
    calendarDays.push({ date: nextMonthDay, hasEntry: false });
  }
  
  // Emotion color mapping
  const getEmotionColor = (emotion?: string) => {
    if (!emotion) return 'bg-muted';
    
    switch (emotion) {
      case 'happy': return 'bg-yellow-200 dark:bg-yellow-800';
      case 'sad': return 'bg-blue-200 dark:bg-blue-800';
      case 'anxious': return 'bg-amber-200 dark:bg-amber-800';
      case 'calm': return 'bg-green-200 dark:bg-green-800';
      case 'frustrated': return 'bg-red-200 dark:bg-red-800';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };
  
  // Get intensity class
  const getIntensityClass = (intensity?: number) => {
    if (!intensity) return 'opacity-50';
    
    // Scale opacity based on intensity (1-10)
    const opacity = 0.4 + (intensity / 10) * 0.6;
    return `opacity-[${opacity}]`;
  };

  return (
    <div className="calendar">
      <div className="grid grid-cols-7 text-center mb-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
          <div key={day} className="text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.date.getMonth() === today.getMonth();
          const isToday = day.date.toDateString() === today.toDateString();
          
          return (
            <div
              key={index}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-md text-sm
                ${!isCurrentMonth ? 'text-muted-foreground/40' : ''}
                ${isToday ? 'ring-2 ring-primary' : ''}
                ${day.hasEntry ? getEmotionColor(day.emotion) : 'bg-muted/20'}
                ${day.hasEntry ? getIntensityClass(day.intensity) : ''}
                hover:bg-muted/40 transition-colors
              `}
            >
              <span className={`${day.hasEntry ? 'font-medium' : ''}`}>
                {day.date.getDate()}
              </span>
              {day.hasEntry && (
                <span className="text-[10px] capitalize">
                  {day.emotion}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-xs font-medium">Légende:</div>
        {['happy', 'calm', 'neutral', 'frustrated', 'anxious', 'sad'].map((emotion) => (
          <div key={emotion} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${getEmotionColor(emotion)} mr-1`}></div>
            <span className="text-xs capitalize">{emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionCalendar;
