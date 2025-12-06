const KEY = "ec_story_synth_v1";

export type StoryRecord = {
  id: string;
  createdAt: string;     // ISO
  title: string;
  content: string[];     // paragraphes
  tags?: string[];
  mood?: string;
};

export function loadStories(): StoryRecord[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveStories(list: StoryRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function addStory(s: StoryRecord) {
  const list = loadStories();
  list.unshift(s);
  saveStories(list);
}
