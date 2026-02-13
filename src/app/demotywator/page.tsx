'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { MemeFrame } from '@/components/meme-frame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { loadHistory, saveToHistory } from '@/lib/local-history';
import { cn } from '@/lib/utils';
import { Link2, Upload, Image as ImageIcon, History } from 'lucide-react';
import { toast } from 'sonner';

export default function DemotywatorPage() {
  const moduleKey = 'demotywator';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [title, setTitle] = useState('MOTYWACJA');
  const [subtitle, setSubtitle] = useState('to piękna rzecz, dopóki nie trzeba działać');
  const [bgUrl, setBgUrl] = useState('');
  const [bgFileName, setBgFileName] = useState('');
  const [watermark, setWatermark] = useState(true);

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const remember = (t: string) => {
    saveToHistory(historyKey, t, 50);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const setBackgroundFile = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setBgUrl(url);
    setBgFileName(file.name);
  };

  const setBackgroundUrl = () => {
    if (!bgUrl.trim()) {
      toast.error('Wklej URL obrazka');
      return;
    }
    setBgFileName(bgUrl.trim());
  };

  const clearBackground = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setBgUrl('');
    setBgFileName('');
  };

  const shareText = `${title} — ${subtitle}`.trim();

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Demotywator" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto text-neutral-200" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              Generator demotywatora
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Klasyk internetu: czarna ramka + dramat.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div ref={frameRef} className="p-6 bg-black">
                  <div className="mx-auto max-w-[920px]">
                    <div className="border-[10px] border-white/10 bg-black p-4">
                      <MemeFrame
                        aspect="4 / 5"
                        className="border-white/10"
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              bgUrl
                                ? `url('${bgUrl}') center / cover no-repeat`
                                : 'radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.9))',
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55" />
                      </MemeFrame>

                      <div className="pt-5 text-center">
                        <div
                          className={cn(
                            'text-white font-black tracking-tight',
                            'text-3xl sm:text-4xl'
                          )}
                          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >
                          {(title || '').trim() || 'TYTUŁ'}
                        </div>
                        <div
                          className="mt-2 text-white/80 text-base sm:text-lg"
                          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >
                          {(subtitle || '').trim() || 'podtytuł'}
                        </div>

                        {watermark ? (
                          <div className="mt-4 text-[10px] sm:text-xs font-mono text-white/40">
                            CHAOS OS
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <ResultActions
                    moduleKey={moduleKey}
                    text={shareText}
                    shareTitle="Demotywator — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="demotywator"
                  />
                </div>
              </div>

              {history.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" /> Ostatnie
                  </div>
                  <div className="grid gap-2">
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        className="text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/60 px-3 py-2 transition-colors"
                        onClick={() => {
                          const [t, ...rest] = h.split(' — ');
                          setTitle(t || '');
                          setSubtitle(rest.join(' — '));
                        }}
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
                    Tytuł
                  </label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 font-semibold" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Podtytuł
                  </label>
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="h-12" />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Obraz
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Input
                        value={bgUrl}
                        onChange={(e) => setBgUrl(e.target.value)}
                        placeholder="URL obrazka (opcjonalnie)"
                      />
                      <Button type="button" variant="outline" onClick={setBackgroundUrl} className="gap-2">
                        <Link2 className="h-4 w-4" /> Ustaw
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-background/60">
                        <Upload className="h-4 w-4" /> Wgraj
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) setBackgroundFile(file);
                          }}
                        />
                      </label>
                      <Button type="button" variant="ghost" onClick={clearBackground}>
                        Usuń
                      </Button>
                      {bgFileName ? (
                        <span className="text-xs text-muted-foreground truncate max-w-[260px]">
                          Aktywne: {bgFileName}
                        </span>
                      ) : null}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Najpewniej działa export: upload. URL bez CORS może uwalić PNG.
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Watermark
                  </label>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                    <div className="text-sm">
                      <div className="font-semibold">CHAOS OS</div>
                      <div className="text-xs text-muted-foreground">Podpis pod demotem.</div>
                    </div>
                    <Switch checked={watermark} onCheckedChange={setWatermark} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const payload = `${(title || '').trim()} — ${(subtitle || '').trim()}`.trim();
                      if (!payload || payload === '—') {
                        toast.error('Najpierw wpisz tytuł/podtytuł');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane w historii');
                    }}
                    className="flex-1"
                  >
                    Zapisz
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setTitle('');
                      setSubtitle('');
                    }}
                  >
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
