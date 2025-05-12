
import { format, subDays } from 'date-fns';
import { MoodData } from '@/types';

// Generate mock mood data for the given number of days
export const generateMoodData = (days: number = 30): MoodData[] => {
  const result: MoodData[] = [];
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'dd/MM');
    
    result.push({
      date: formattedDate,
      originalDate: date.toISOString(),
      value: Math.floor(Math.random() * 100),
      sentiment: Math.floor(Math.random() * 100),
      anxiety: Math.floor(Math.random() * 100),
      energy: Math.floor(Math.random() * 100),
      mood: getMoodFromValue(Math.floor(Math.random() * 100))
    });
  }
  
  return result;
};

// Helper function to get mood string from value
function getMoodFromValue(value: number): string {
  if (value < 20) return 'very_sad';
  if (value < 40) return 'sad';
  if (value < 60) return 'neutral';
  if (value < 80) return 'happy';
  return 'very_happy';
}

// Generate mock alerts data
export const generateAlerts = (count: number = 5) => {
  const alertTypes = ['danger', 'warning', 'info', 'success'];
  const alertMessages = [
    'Anomalie détectée dans les tendances émotionnelles',
    'Rappel de consultation programmée',
    'Nouvelle fonctionnalité disponible',
    'Progrès significatif observé',
    'Modification des habitudes détectée'
  ];
  
  const alerts = [];
  
  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * alertTypes.length);
    const messageIndex = Math.floor(Math.random() * alertMessages.length);
    
    alerts.push({
      id: `alert-${i}`,
      type: alertTypes[typeIndex],
      message: alertMessages[messageIndex],
      date: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString()
    });
  }
  
  return alerts;
};
