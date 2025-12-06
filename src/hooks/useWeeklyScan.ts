import dayjs from 'dayjs';
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
  since: dayjs.Dayjs = dayjs().subtract(8, 'week')
) => {
  return useQuery(['scanWeekly', since], async () => {
    const res = await GlobalInterceptor.secureFetch(
      `/me/scan/weekly?since=${since.format('YYYY-MM-DD')}`
    );
    if (!res) throw new Error('Request failed');
    const { data } = await res.json();
    return data as WeeklyScanRow[];
  });
};
