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
// (cleanup) unused import removed
import { History, Link2, Newspaper, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function OkladkaPage() {
  const moduleKey = 'okladka';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [masthead, setMasthead] = useState('CHAOS TIMES');
  const [dateText, setDateText] = useState('13.02.2026');
  const [price, setPrice] = useState('4,99');
  const [headline, setHeadline] = useState('SZOK! PANU CHCIAŁ "WSZYSTKO" — I DOSTAŁ');
  const [subhead, setSubhead] = useState('Eksperci: "to się nie powinno udać". Inżynierowie: "zobaczymy".');

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

  const shareText = `${headline}`.trim();

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Okładka" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <Newspaper className="w-12 h-12 mx-auto text-amber-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              Generator okładki tabloidu
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Napisz nagłówek, wrzuć zdjęcie i zrób sensację.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div ref={frameRef} className="p-6">
                  <div className="mx-auto max-w-[900px]">
                    <MemeFrame aspect="3 / 4" className="bg-white border-black/10">
                      <div className="absolute inset-0 bg-white" />

                      {/* masthead */}
                      <div className="absolute left-0 right-0 top-0 px-5 py-4 border-b border-black/15">
                        <div className="flex items-end justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                            {(masthead || '').trim() || 'GAZETA'}
                          </div>
                          <div className="text-xs text-black/70 font-mono text-right">
                            <div>{(dateText || '').trim()}</div>
                            <div>Cena: {(price || '').trim()} zł</div>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-black/50">
                          Wydanie specjalne: internetowe bzdury, ale ładnie.
                        </div>
                      </div>

                      {/* photo */}
                      <div className="absolute left-5 right-5 top-[92px] bottom-[170px] border border-black/15 overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              bgUrl
                                ? `url('${bgUrl}') center / cover no-repeat`
                                : 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(0,0,0,0.05))',
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
                        <div className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/50 px-2 py-1 rounded">
                          zdjęcie poglądowe
                        </div>
                      </div>

                      {/* headline */}
                      <div className="absolute left-5 right-5 bottom-[70px]">
                        <div className="text-black font-black leading-[0.92] tracking-tight text-3xl sm:text-4xl">
                          {(headline || '').trim() || 'NAGŁÓWEK'}
                        </div>
                        <div className="mt-2 text-black/75 text-sm sm:text-base">
                          {(subhead || '').trim()}
                        </div>
                      </div>

                      {/* footer */}
                      <div className="absolute left-0 right-0 bottom-0 px-5 py-3 border-t border-black/10 flex items-center justify-between">
                        <div className="text-[10px] text-black/50">
                          {watermark ? 'CHAOS OS — generator okładek' : ' '}
                        </div>
                        <div className="text-[10px] text-black/30">Strona 1/1</div>
                      </div>
                    </MemeFrame>
                  </div>
                </div>

                <div className="pt-4">
                  <ResultActions
                    moduleKey={moduleKey}
                    text={shareText}
                    shareTitle="Okładka tabloidu — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="okladka"
                  />
                </div>
              </div>

              {history.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" /> Ostatnie nagłówki
                  </div>
                  <div className="grid gap-2">
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        className="text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/60 px-3 py-2 transition-colors"
                        onClick={() => setHeadline(h)}
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Tytuł gazety
                    </label>
                    <Input value={masthead} onChange={(e) => setMasthead(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Data
                    </label>
                    <Input value={dateText} onChange={(e) => setDateText(e.target.value)} className="h-11" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Cena
                    </label>
                    <Input value={price} onChange={(e) => setPrice(e.target.value)} className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Watermark
                    </label>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                      <div className="text-sm">
                        <div className="font-semibold">CHAOS OS</div>
                        <div className="text-xs text-muted-foreground">Stopka.</div>
                      </div>
                      <Switch checked={watermark} onCheckedChange={setWatermark} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Nagłówek
                  </label>
                  <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="h-12 font-semibold" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Podtytuł
                  </label>
                  <Input value={subhead} onChange={(e) => setSubhead(e.target.value)} className="h-12" />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Zdjęcie
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Input value={bgUrl} onChange={(e) => setBgUrl(e.target.value)} placeholder="URL obrazka (opcjonalnie)" />
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
                    <div className="text-xs text-muted-foreground">URL bez CORS może uwalić export PNG. Upload pewniejszy.</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const payload = (headline || '').trim();
                      if (!payload) {
                        toast.error('Najpierw wpisz nagłówek');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane');
                    }}
                    className="flex-1"
                  >
                    Zapisz nagłówek
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setHeadline('')}>
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
