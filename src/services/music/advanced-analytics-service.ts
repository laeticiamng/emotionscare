export interface AdvancedAnalytics {
  totalPlays: number;
  totalTracks: number;
  listeningTime: number;
  averageScore: number;
}

export const fetchAdvancedAnalytics = async (): Promise<AdvancedAnalytics> => {
  return {
    totalPlays: 0,
    totalTracks: 0,
    listeningTime: 0,
    averageScore: 0
  };
};
