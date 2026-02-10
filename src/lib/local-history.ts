export type HistoryItem = {
  id: string;
  text: string;
  createdAt: number;
};

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadHistory(key: string, limit = 30): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const parsed = safeJsonParse<HistoryItem[]>(window.localStorage.getItem(key));
  if (!parsed || !Array.isArray(parsed)) return [];
  return parsed
    .filter((x) => x && typeof x.text === 'string')
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function saveToHistory(key: string, text: string, limit = 30) {
  if (typeof window === 'undefined') return;
  const trimmed = (text || '').trim();
  if (!trimmed) return;

  const prev = loadHistory(key, limit);
  const next: HistoryItem[] = [
    { id: crypto.randomUUID(), text: trimmed, createdAt: Date.now() },
    ...prev.filter((x) => x.text !== trimmed),
  ].slice(0, limit);

  window.localStorage.setItem(key, JSON.stringify(next));
}

export function loadFavorites(key: string): HistoryItem[] {
  return loadHistory(key, 200);
}

export function toggleFavorite(key: string, text: string): boolean {
  if (typeof window === 'undefined') return false;
  const trimmed = (text || '').trim();
  if (!trimmed) return false;

  const prev = loadFavorites(key);
  const exists = prev.some((x) => x.text === trimmed);
  const next = exists
    ? prev.filter((x) => x.text !== trimmed)
    : [{ id: crypto.randomUUID(), text: trimmed, createdAt: Date.now() }, ...prev];

  window.localStorage.setItem(key, JSON.stringify(next));
  return !exists;
}

export function isFavorited(key: string, text: string): boolean {
  if (typeof window === 'undefined') return false;
  const trimmed = (text || '').trim();
  if (!trimmed) return false;
  const prev = loadFavorites(key);
  return prev.some((x) => x.text === trimmed);
}
