import { subWeeks, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

export interface WeeklyScanRow {
  week: string;
  valence_face_avg: number;
  joy_face_avg: number;
  valence_voice_avg: number;
  lexical_sentiment_avg: number;
  arousal_sd_face: number;
}

export const useWeeklyScan = (
  since: Date = subWeeks(new Date(), 8)
) => {
  return useQuery(['scanWeekly', since], async () => {
    const res = await GlobalInterceptor.secureFetch(
      `/me/scan/weekly?since=${format(since, 'yyyy-MM-dd')}`
    );
    if (!res) throw new Error('Request failed');
    const { data } = await res.json();
    return data as WeeklyScanRow[];
  });
};
