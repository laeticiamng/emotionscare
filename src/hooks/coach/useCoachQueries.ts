import { useQuery } from 'react-query';
import { useCoach } from '@/contexts/CoachContext';

export function useCoachQueries() {
  const { coachService } = useCoach();

  const askQuestion = (question: string) => {
    return useQuery(['coach', 'askQuestion', question], async () => {
      const response = await coachService.askQuestion(question);
      return response;
    }, {
      enabled: !!question,
    });
  };

  return {
    askQuestion,
  };
}
