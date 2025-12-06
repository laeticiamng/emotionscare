import { randomUUID } from 'crypto';

type VoiceEntry = {
  id: string;
  ts: string;
  user_hash: string;
  audio_url: string;
  text_raw: string;
  summary_120: string;
  valence: number;
  emo_vec: number[];
  pitch_avg: number;
  crystal_meta: any;
};

type TextEntry = {
  id: string;
  ts: string;
  user_hash: string;
  text_raw: string;
  styled_html: string;
  preview: string;
  valence: number;
  emo_vec: number[];
};

const voice: VoiceEntry[] = [];
const text: TextEntry[] = [];

export function insertVoice(data: Omit<VoiceEntry,'id'|'ts'>): VoiceEntry {
  const row: VoiceEntry = { id: randomUUID(), ts: new Date().toISOString(), ...data };
  voice.push(row);
  return row;
}

export function insertText(data: Omit<TextEntry,'id'|'ts'>): TextEntry {
  const row: TextEntry = { id: randomUUID(), ts: new Date().toISOString(), ...data };
  text.push(row);
  return row;
}

export function listFeed(user_hash: string) {
  const entries = [
    ...voice.filter(v=>v.user_hash===user_hash).map(v=>({type:'voice',id:v.id,ts:v.ts,summary:v.summary_120})),
    ...text.filter(t=>t.user_hash===user_hash).map(t=>({type:'text',id:t.id,ts:t.ts,preview:t.preview}))
  ].sort((a,b)=> b.ts.localeCompare(a.ts));
  return entries;
}
