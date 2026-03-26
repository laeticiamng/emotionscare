// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import { useGamificationStore, type LeaderboardEntry } from '../gamification.store';

describe('gamification.store', () => {
  beforeEach(() => {
    useGamificationStore.setState({
      scope: 'friends',
      period: '7d',
      myRank: null,
      entries: [],
      badges: null,
      loading: false,
      error: null,
      nextCursor: null,
    });
  });

  it('initialise avec valeurs par défaut', () => {
    const state = useGamificationStore.getState();
    expect(state.scope).toBe('friends');
    expect(state.period).toBe('7d');
    expect(state.entries).toEqual([]);
  });

  it('change de scope et reset entries', () => {
    useGamificationStore.getState().setEntries([{ rank: 1, display_name: 'A' }]);
    useGamificationStore.getState().setScope('global');
    expect(useGamificationStore.getState().scope).toBe('global');
    expect(useGamificationStore.getState().entries).toEqual([]);
  });

  it('change de period et reset entries', () => {
    useGamificationStore.getState().setEntries([{ rank: 1, display_name: 'A' }]);
    useGamificationStore.getState().setPeriod('30d');
    expect(useGamificationStore.getState().period).toBe('30d');
    expect(useGamificationStore.getState().entries).toEqual([]);
  });

  it('append entries déduplique par rank', () => {
    const initial: LeaderboardEntry[] = [
      { rank: 1, display_name: 'Alice' },
      { rank: 2, display_name: 'Bob' },
    ];
    useGamificationStore.getState().setEntries(initial);
    useGamificationStore.getState().appendEntries([
      { rank: 2, display_name: 'Bob Updated' },
      { rank: 3, display_name: 'Charlie' },
    ]);

    const entries = useGamificationStore.getState().entries;
    expect(entries).toHaveLength(3);
    expect(entries[1].display_name).toBe('Bob Updated');
    expect(entries[2].display_name).toBe('Charlie');
  });

  it('trie les entries par rank', () => {
    useGamificationStore.getState().appendEntries([
      { rank: 3, display_name: 'C' },
      { rank: 1, display_name: 'A' },
      { rank: 2, display_name: 'B' },
    ]);
    const entries = useGamificationStore.getState().entries;
    expect(entries.map(e => e.rank)).toEqual([1, 2, 3]);
  });

  it('gère myRank', () => {
    useGamificationStore.getState().setMyRank({
      rank_label: 'Gold',
      tier: 3,
      next_goal_hint: '10 more points',
    });
    expect(useGamificationStore.getState().myRank?.rank_label).toBe('Gold');
  });

  it('gère les badges', () => {
    useGamificationStore.getState().setBadges({
      unlocked: [{ id: 'b1', name: 'First', description: 'desc', locked: false, icon_url: '/b1.png' }],
      locked: [],
    });
    expect(useGamificationStore.getState().badges?.unlocked).toHaveLength(1);
  });

  it('reset restaure l\'état initial', () => {
    useGamificationStore.getState().setScope('global');
    useGamificationStore.getState().setError('fail');
    useGamificationStore.getState().reset();
    expect(useGamificationStore.getState().scope).toBe('friends');
    expect(useGamificationStore.getState().error).toBeNull();
  });
});
