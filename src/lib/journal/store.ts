const KEY = "ec_journal_entries_v1";

export type JournalEntryRec = {
  id: string;
  createdAt: string; // ISO
  content: string;
  tags?: string[];
  mood?: string;
  deleted?: boolean; // soft delete
};

export function loadEntries(): JournalEntryRec[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveEntries(list: JournalEntryRec[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertEntry(e: JournalEntryRec) {
  const list = loadEntries();
  const i = list.findIndex(x => x.id === e.id);
  if (i >= 0) list[i] = e; else list.unshift(e); // unshift pour voir immédiatement en haut
  saveEntries(list);
  return e;
}

export function softDelete(id: string) {
  const list = loadEntries();
  const i = list.findIndex(x => x.id === id);
  if (i >= 0) { list[i].deleted = true; saveEntries(list); }
}

export function searchEntries(q: string, tag?: string) {
  const needle = (q || "").trim().toLowerCase();
  return loadEntries()
    .filter(x => !x.deleted)
    .filter(x => !tag || (x.tags || []).includes(tag))
    .filter(x => !needle || x.content.toLowerCase().includes(needle) || (x.tags || []).some(t => t.toLowerCase().includes(needle)))
    .sort((a,b) => (b.createdAt).localeCompare(a.createdAt));
}
