export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function safeInt(input: string, fallback: number) {
  const n = Number.parseInt((input || '').replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function initials(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CO';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type ParsedChatLine = { side: 'me' | 'them'; text: string };

/**
 * Format wejścia:
 * - "JA: tekst" => prawa strona
 * - "ON: tekst" / "ONA: tekst" / "THEM: tekst" => lewa strona
 * - bez prefixu: kontynuacja ostatniej strony (domyślnie: them)
 */
export function parseChat(text: string): ParsedChatLine[] {
  const lines = (text || '').split(/\r?\n/);
  const out: ParsedChatLine[] = [];
  let lastSide: ParsedChatLine['side'] = 'them';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const m = line.match(/^(JA|JA\. |ME|I|ON|ONA|THEM)\s*:\s*(.*)$/i);
    if (m) {
      const key = (m[1] || '').toUpperCase().replace('.', '').trim();
      const body = (m[2] || '').trim();
      if (!body) continue;

      const side: ParsedChatLine['side'] = key === 'JA' || key === 'ME' || key === 'I' ? 'me' : 'them';
      out.push({ side, text: body });
      lastSide = side;
      continue;
    }

    out.push({ side: lastSide, text: line });
  }

  return out;
}
