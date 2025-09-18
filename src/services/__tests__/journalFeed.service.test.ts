import { describe, it, expect, beforeEach, vi } from 'vitest';

const { getMock, postMock } = vi.hoisted(() => {
  return {
    getMock: vi.fn(),
    postMock: vi.fn(),
  };
});

vi.mock('@/services/api/httpClient', () => ({
  default: {
    get: getMock,
    post: postMock,
  },
}));

import {
  createJournalTextEntry,
  createJournalVoiceEntry,
  fetchJournalFeed,
  mapLocalEntry,
} from '../journalFeed.service';

const buildApiResponse = <T,>(data: T) => ({ data, status: 200, message: 'ok', success: true });

describe('journalFeed.service', () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
  });

  it('normalizes and sanitizes text entries before posting them', async () => {
    postMock.mockResolvedValue(
      buildApiResponse({ ok: true, data: { id: 'remote-1', ts: '2024-05-20T10:00:00.000Z' } })
    );

    const result = await createJournalTextEntry({
      content: 'Bonjour monde #Focus',
      tags: ['Focus', '#zen', 'zen'],
    });

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith('api/v1/journal/text', {
      text_raw: 'Bonjour monde #Focus\n\n#focus #zen',
      styled_html: '<p>Bonjour monde #Focus</p><p>#focus #zen</p>',
      preview: 'Bonjour monde #Focus #focus #zen',
      valence: 0,
      emo_vec: Array(8).fill(0),
    });

    expect(result).toEqual({ id: 'remote-1', ts: '2024-05-20T10:00:00.000Z' });
  });

  it('normalizes voice entries before posting them', async () => {
    postMock.mockResolvedValue(
      buildApiResponse({ ok: true, data: { id: 'voice-1', ts: '2024-05-22T08:00:00.000Z' } })
    );

    const result = await createJournalVoiceEntry({
      audioUrl: ' https://cdn.emotionscare.com/audio/session.wav ',
      transcription: 'Bonjour <script>alert(1)</script> monde',
      tags: ['Focus', '#Zen', 'zen'],
      valence: 0.42,
      pitchAvg: 640,
      summaryOverride: 'Résumé <b>dangereux</b>',
    });

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith('api/v1/journal/voice', {
      audio_url: 'https://cdn.emotionscare.com/audio/session.wav',
      text_raw: 'Bonjour alert(1) monde\n\n#focus #zen',
      summary_120: 'Résumé dangereux',
      valence: 0.42,
      emo_vec: Array(8).fill(0.42),
      pitch_avg: 600,
      crystal_meta: {
        form: 'wave',
        palette: ['#34d399', '#34d399'],
        mesh_url: 'https://cdn.emotionscare.com/assets/crystals/gem-default.glb',
      },
    });

    expect(result).toEqual({ id: 'voice-1', ts: '2024-05-22T08:00:00.000Z' });
  });

  it('throws an error when the API refuses the entry creation', async () => {
    postMock.mockResolvedValue(buildApiResponse({ ok: false, error: { message: 'nope' } }));

    await expect(
      createJournalTextEntry({ content: 'Invalid payload', tags: [] })
    ).rejects.toThrow('nope');
  });

  it('maps remote entries to the normalized feed format', async () => {
    getMock.mockResolvedValue(
      buildApiResponse({
        ok: true,
        data: {
          entries: [
            {
              id: 'remote-2',
              ts: '2024-05-18T08:30:00.000Z',
              type: 'voice',
              summary_120: '<b>Salut</b> <script>mal</script>',
              text_raw: 'Salut #Focus',
              meta: { tags: ['Zen'] },
              valence: 0.4,
            },
          ],
        },
      })
    );

    const entries = await fetchJournalFeed();

    expect(getMock).toHaveBeenCalledWith('api/v1/me/journal');
    expect(entries).toEqual([
      {
        id: 'remote-2',
        type: 'voice',
        timestamp: '2024-05-18T08:30:00.000Z',
        text: 'Salut ',
        summary: '<b>Salut</b> ',
        tags: ['focus', 'zen'],
        valence: 0.4,
        mood: 'positive',
        origin: 'remote',
      },
    ]);
  });

  it('maps local entries with extracted tags', () => {
    const local = mapLocalEntry({
      id: 'local-1',
      createdAt: '2024-05-21T12:00:00.000Z',
      content: 'Contenu #Focus plein de joie',
      tags: ['zen', 'Focus'],
    });

    expect(local).toEqual({
      id: 'local-1',
      type: 'text',
      timestamp: '2024-05-21T12:00:00.000Z',
      text: 'Contenu #Focus plein de joie',
      tags: ['focus', 'zen'],
      origin: 'local',
    });
  });
});
