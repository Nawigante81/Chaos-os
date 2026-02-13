'use client';

import { useMemo, useRef, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { MemeFrame } from '@/components/meme-frame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { loadHistory, saveToHistory } from '@/lib/local-history';
import { parseChat } from '@/lib/meme-helpers';
import { cn } from '@/lib/utils';
import { History, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatPage() {
  const moduleKey = 'chat';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('Czat: PANU ↔ Chaos');
  const [dark, setDark] = useState(true);
  const [linesText, setLinesText] = useState(
    `ON: masz to na jutro?\nJA: jasne\nJA: tylko powiedz, które jutro\nON: ...\nON: to już nieważne`
  );

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  const remember = (t: string) => {
    saveToHistory(historyKey, t, 50);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const messages = useMemo(() => parseChat(linesText), [linesText]);

  const shareText = messages.map((m) => `${m.side === 'me' ? 'JA' : 'ON'}: ${m.text}`).join(' | ');

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Chat" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <MessageCircle className="w-12 h-12 mx-auto text-violet-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              Generator screenshota czatu
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Format: linia po linii. Prefiksy: <span className="font-mono">JA:</span> / <span className="font-mono">ON:</span>.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div ref={frameRef} className="p-6">
                  <div className="mx-auto max-w-[920px]">
                    <MemeFrame aspect="9 / 16" className={cn(dark ? 'bg-black' : 'bg-white')}
                    >
                      <div className={cn('absolute inset-0', dark ? 'bg-[#0b0f16]' : 'bg-[#f3f4f6]')} />
                      <div className={cn('absolute inset-x-0 top-0 px-5 py-4 border-b', dark ? 'border-white/10' : 'border-black/10')}>
                        <div className={cn('text-sm font-semibold truncate', dark ? 'text-white/90' : 'text-black/80')}>
                          {(title || '').trim() || 'Czat'}
                        </div>
                        <div className={cn('text-[10px] mt-1', dark ? 'text-white/40' : 'text-black/40')}>
                          generator • nie prawdziwy komunikator
                        </div>
                      </div>

                      <div className="absolute inset-x-0 top-[78px] bottom-[84px] px-4 py-4 overflow-hidden">
                        <div className="h-full w-full overflow-hidden">
                          <div className="flex flex-col gap-2">
                            {messages.slice(0, 12).map((m, idx) => (
                              <div
                                key={idx}
                                className={cn('flex', m.side === 'me' ? 'justify-end' : 'justify-start')}
                              >
                                <div
                                  className={cn(
                                    'max-w-[84%] rounded-2xl px-3.5 py-2 text-sm leading-snug shadow-sm',
                                    m.side === 'me'
                                      ? dark
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-violet-600 text-white'
                                      : dark
                                        ? 'bg-white/10 text-white/90 border border-white/10'
                                        : 'bg-white text-black/90 border border-black/10'
                                  )}
                                >
                                  {m.text}
                                </div>
                              </div>
                            ))}

                            {messages.length === 0 ? (
                              <div className={cn('text-xs', dark ? 'text-white/40' : 'text-black/40')}>
                                Brak wiadomości — wpisz coś.
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className={cn('absolute inset-x-0 bottom-0 px-5 py-4 border-t', dark ? 'border-white/10' : 'border-black/10')}>
                        <div className={cn('rounded-full px-4 py-2 text-xs', dark ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/50')}>
                          Napisz wiadomość… (nie działa, bo to PNG)
                        </div>
                      </div>
                    </MemeFrame>
                  </div>
                </div>

                <div className="pt-4">
                  <ResultActions
                    moduleKey={moduleKey}
                    text={shareText}
                    shareTitle="Generator czatu — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="chat"
                  />
                </div>
              </div>

              {history.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" /> Ostatnie
                  </div>
                  <div className="grid gap-2">
                    {history.slice(0, 3).map((h) => (
                      <button
                        key={h}
                        className="text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/60 px-3 py-2 transition-colors"
                        onClick={() => setLinesText(h)}
                      >
                        {h.split('\n').slice(0, 2).join(' / ')}…
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border/60">
              <CardContent className="p-5 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Tytuł
                  </label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Tryb
                  </label>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                    <div className="text-sm">
                      <div className="font-semibold">Dark mode</div>
                      <div className="text-xs text-muted-foreground">Bo wygląda legitniej.</div>
                    </div>
                    <Switch checked={dark} onCheckedChange={setDark} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Wiadomości
                  </label>
                  <textarea
                    value={linesText}
                    onChange={(e) => setLinesText(e.target.value)}
                    className={cn(
                      'min-h-[260px] w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-mono',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                    )}
                    placeholder={'ON: ...\nJA: ...'}
                  />
                  <div className="text-xs text-muted-foreground">
                    Tip: bez prefiksu = kontynuacja poprzedniej strony.
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const payload = (linesText || '').trim();
                      if (!payload) {
                        toast.error('Najpierw wpisz wiadomości');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane');
                    }}
                    className="flex-1"
                  >
                    Zapisz rozmowę
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setLinesText('')}>
                    Wyczyść
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
