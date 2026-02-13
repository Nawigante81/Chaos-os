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
import { History, Images, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function DrakePage() {
  const moduleKey = 'drake';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);
  const obj1 = useRef<string | null>(null);
  const obj2 = useRef<string | null>(null);

  const [topText, setTopText] = useState('ROBIMY TO "SZYBKO"');
  const [bottomText, setBottomText] = useState('DORABIAMY 8 GENERATORÓW W 1 NOC');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [watermark, setWatermark] = useState(true);

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  useEffect(() => {
    return () => {
      if (obj1.current) URL.revokeObjectURL(obj1.current);
      if (obj2.current) URL.revokeObjectURL(obj2.current);
    };
  }, []);

  const remember = (t: string) => {
    saveToHistory(historyKey, t, 50);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const setFile = (file: File, which: 1 | 2) => {
    const url = URL.createObjectURL(file);
    if (which === 1) {
      if (obj1.current) URL.revokeObjectURL(obj1.current);
      obj1.current = url;
      setImg1(url);
    } else {
      if (obj2.current) URL.revokeObjectURL(obj2.current);
      obj2.current = url;
      setImg2(url);
    }
  };

  const shareText = `${topText} / ${bottomText}`.trim();

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Dwa panele" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <Images className="w-12 h-12 mx-auto text-pink-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              Generator mema 2-panelowego
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Dwie grafiki + dwa napisy. Uniwersalne.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div ref={frameRef} className="p-6">
                  <div className="mx-auto max-w-[920px]">
                    <MemeFrame aspect="1 / 1" className="bg-black border-white/10">
                      <div className="absolute inset-0 grid grid-rows-2">
                        <div className="relative overflow-hidden border-b border-white/10">
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                img1
                                  ? `url('${img1}') center / cover no-repeat`
                                  : 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(0,0,0,0.85))',
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65" />
                          <div className="absolute inset-x-0 top-0 p-4">
                            <div
                              className={cn(
                                'text-white font-black text-center leading-[0.95] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]',
                                'text-2xl sm:text-3xl'
                              )}
                            >
                              {(topText || '').trim()}
                            </div>
                          </div>
                        </div>

                        <div className="relative overflow-hidden">
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                img2
                                  ? `url('${img2}') center / cover no-repeat`
                                  : 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(0,0,0,0.85))',
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65" />
                          <div className="absolute inset-x-0 top-0 p-4">
                            <div
                              className={cn(
                                'text-white font-black text-center leading-[0.95] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]',
                                'text-2xl sm:text-3xl'
                              )}
                            >
                              {(bottomText || '').trim()}
                            </div>
                          </div>

                          {watermark ? (
                            <div className="absolute right-3 bottom-3 text-[10px] sm:text-xs font-mono text-white/60 bg-black/40 border border-white/10 px-2 py-1 rounded">
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
                    shareTitle="Meme 2-panel — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="meme-2-panel"
                  />
                </div>
              </div>

              {history.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" /> Ostatnie teksty
                  </div>
                  <div className="grid gap-2">
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        className="text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/60 px-3 py-2 transition-colors"
                        onClick={() => {
                          const parts = h.split(' / ');
                          setTopText(parts[0] || '');
                          setBottomText(parts.slice(1).join(' / '));
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
                    Tekst góra
                  </label>
                  <Input value={topText} onChange={(e) => setTopText(e.target.value)} className="h-12 font-semibold" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Tekst dół
                  </label>
                  <Input value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="h-12 font-semibold" />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Obraz 1 (góra)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-background/60">
                      <Upload className="h-4 w-4" /> Wgraj
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) setFile(file, 1);
                        }}
                      />
                    </label>
                    <Button type="button" variant="outline" onClick={() => setImg1('')}>
                      Wyczyść
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">(URL dorobimy później — na razie upload)</div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Obraz 2 (dół)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-background/60">
                      <Upload className="h-4 w-4" /> Wgraj
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) setFile(file, 2);
                        }}
                      />
                    </label>
                    <Button type="button" variant="outline" onClick={() => setImg2('')}>
                      Wyczyść
                    </Button>
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
                      const payload = `${(topText || '').trim()} / ${(bottomText || '').trim()}`.trim();
                      if (!payload || payload === '/') {
                        toast.error('Wpisz tekst');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane');
                    }}
                    className="flex-1"
                  >
                    Zapisz tekst
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setTopText('');
                    setBottomText('');
                  }}>
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
