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
import { cn } from '@/lib/utils';
import { Award, History } from 'lucide-react';
import { toast } from 'sonner';

export default function CertyfikatPage() {
  const moduleKey = 'certyfikat';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);

  const [recipient, setRecipient] = useState('PANU');
  const [title, setTitle] = useState('CERTYFIKAT ABSURDU');
  const [reason, setReason] = useState('za żądanie "dawaj wszystko" i brak strachu przed konsekwencjami');
  const [issuer, setIssuer] = useState('CHAOS OS / Komisja ds. Chaosu');
  const [id, setId] = useState('CO-666-2026');
  const [watermark, setWatermark] = useState(true);

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  const remember = (t: string) => {
    saveToHistory(historyKey, t, 50);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const shareText = `${recipient}: ${title}`.trim();

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Certyfikat" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <Award className="w-12 h-12 mx-auto text-emerald-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              Generator certyfikatu
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Drukuj zasługi, których nie było.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div ref={frameRef} className="p-6">
                  <div className="mx-auto max-w-[920px]">
                    <MemeFrame aspect="4 / 3" className="bg-[#fbf7ef] border-black/10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.25),transparent_55%)]" />
                      <div className="absolute inset-0 p-8 sm:p-10">
                        <div className="h-full w-full rounded-2xl border-2 border-black/15 bg-white/60 backdrop-blur-sm p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="text-[10px] font-mono text-black/60">ID: {(id || '').trim()}</div>
                            <div className="text-[10px] font-mono text-black/40">wydruk nie ma mocy prawnej</div>
                          </div>

                          <div className="mt-6 text-center">
                            <div className="text-xs font-semibold tracking-[0.35em] text-black/60 uppercase">Niniejszym przyznaje się</div>
                            <div className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-black">
                              {(title || '').trim() || 'CERTYFIKAT'}
                            </div>

                            <div className="mt-6 text-4xl sm:text-5xl font-black text-emerald-700 tracking-tight">
                              {(recipient || '').trim() || 'OSOBA'}
                            </div>

                            <div className="mt-4 text-black/70 text-base sm:text-lg leading-relaxed">
                              {(reason || '').trim() || 'za coś'}
                            </div>
                          </div>

                          <div className="mt-10 flex items-end justify-between">
                            <div className="text-sm text-black/60">
                              <div className="font-semibold">Wystawca</div>
                              <div className="text-black/50">{(issuer || '').trim()}</div>
                            </div>
                            <div className="text-right">
                              <div className="h-10 w-32 border-b-2 border-black/25" />
                              <div className="text-[10px] text-black/40 mt-2">podpis nieczytelny</div>
                            </div>
                          </div>

                          {watermark ? (
                            <div className="absolute right-6 bottom-6 text-[10px] font-mono text-black/30">
                              CHAOS OS
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </MemeFrame>
                  </div>
                </div>

                <div className="pt-4">
                  <ResultActions
                    moduleKey={moduleKey}
                    text={shareText}
                    shareTitle="Generator certyfikatu — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="certyfikat"
                  />
                </div>
              </div>

              {history.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" /> Ostatnie osoby
                  </div>
                  <div className="grid gap-2">
                    {history.slice(0, 6).map((h) => (
                      <button
                        key={h}
                        className="text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/60 px-3 py-2 transition-colors"
                        onClick={() => setRecipient(h)}
                      >
                        {h}
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
                    Odbiorca
                  </label>
                  <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="h-11 font-semibold" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Tytuł
                  </label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Za co
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={cn(
                      'min-h-[110px] w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Wystawca
                    </label>
                    <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      ID
                    </label>
                    <Input value={id} onChange={(e) => setId(e.target.value)} className="h-11 font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Watermark
                  </label>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                    <div className="text-sm">
                      <div className="font-semibold">CHAOS OS</div>
                      <div className="text-xs text-muted-foreground">Napis w rogu.</div>
                    </div>
                    <Switch checked={watermark} onCheckedChange={setWatermark} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const payload = (recipient || '').trim();
                      if (!payload) {
                        toast.error('Najpierw wpisz odbiorcę');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane');
                    }}
                    className="flex-1"
                  >
                    Zapisz odbiorcę
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setRecipient('')}>
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
