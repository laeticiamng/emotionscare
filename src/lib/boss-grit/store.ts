const KEY = "boss_grit_tasks_v1";

export type GritTask = { id: string; label: string; done?: boolean };

export function loadTasks(): GritTask[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveTasks(list: GritTask[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function upsertTask(t: GritTask) {
  const list = loadTasks();
  const i = list.findIndex(x => x.id === t.id);
  if (i >= 0) list[i] = t; else list.push(t);
  saveTasks(list);
}
export function removeTask(id: string) {
  const list = loadTasks().filter(x => x.id !== id);
  saveTasks(list);
}
