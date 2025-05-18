import React, { useEffect, useState } from 'react';
import EventItem from '@/components/community/EventItem';
import { fetchCommunityEvents } from '@/lib/communityEventService';
import { getLeaderboard } from '@/lib/gamification/leaderboard-service';
import LeaderboardWidget from '@/components/dashboard/widgets/LeaderboardWidget';
import type { CommunityEvent } from '@/types/community';
import type { LeaderboardEntry } from '@/types/gamification';

const CommunityEventsPage: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const evts = await fetchCommunityEvents();
      const lb = await getLeaderboard('global', 5);
      setEvents(evts);
      setLeaderboard(lb);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Événements communautaires</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading && <p className="text-center">Chargement...</p>}
          {!loading && events.map(evt => (
            <EventItem key={evt.id} event={evt} />
          ))}
        </div>
        <div>
          <LeaderboardWidget entries={leaderboard} showSeeAll />
        </div>
      </div>
    </div>
  );
};

export default CommunityEventsPage;
