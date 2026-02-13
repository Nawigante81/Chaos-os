'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { loadHistory, saveToHistory } from '@/lib/local-history';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { History, Image as ImageIcon, Link2, Upload } from 'lucide-react';

type Aspect = '1:1' | '4:5' | '16:9';

const ASPECTS: Record<Aspect, { w: number; h: number; label: string }> = {
  '1:1': { w: 1024, h: 1024, label: 'Kwadrat 1:1' },
  '4:5': { w: 1024, h: 1280, label: 'IG 4:5' },
  '16:9': { w: 1280, h: 720, label: 'Wideo 16:9' },
};

function strokeShadow(px: number) {
  if (px <= 0) return 'none';
  const p = Math.round(px);
  // klasyczny „Impact z obwódką” bez SVG: kilka cieni dookoła
  const s = [
    `${-p}px ${-p}px 0 #000`,
    `${p}px ${-p}px 0 #000`,
    `${-p}px ${p}px 0 #000`,
    `${p}px ${p}px 0 #000`,
    `0 ${-p}px 0 #000`,
    `0 ${p}px 0 #000`,
    `${-p}px 0 0 #000`,
    `${p}px 0 0 #000`,
  ];
  return s.join(',');
}

export default function MemyPage() {
  const moduleKey = 'memy';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [topText, setTopText] = useState('KIEDY PANU MÓWI „ZROBIMY TO SZYBKO”');
  const [bottomText, setBottomText] = useState('A CHAOS OS ODPOWIADA: HOLD MY BEER');
  const [aspect, setAspect] = useState<Aspect>('1:1');
  const [fontSize, setFontSize] = useState(74);
  const [strokePx, setStrokePx] = useState(6);
  const [uppercase, setUppercase] = useState(true);
  const [watermark, setWatermark] = useState(true);

  const [bgUrl, setBgUrl] = useState('');
  const [bgFileName, setBgFileName] = useState('');

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

  const tTop = (topText || '').trim();
  const tBottom = (bottomText || '').trim();
  const displayTop = uppercase ? tTop.toUpperCase() : tTop;
  const displayBottom = uppercase ? tBottom.toUpperCase() : tBottom;
  const shareText = [tTop, tBottom].filter(Boolean).join(' / ');

  const { w, h } = ASPECTS[aspect];

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Memy" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto text-fuchsia-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              Kreator memów
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Obraz + tekst. Eksport do PNG jednym kliknięciem.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Preview */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div className="w-full overflow-hidden rounded-xl border border-border bg-black/40">
                  <div className="w-full" style={{ aspectRatio: `${w} / ${h}` }}>
                    <div
                      ref={frameRef}
                      className="relative w-full h-full overflow-hidden"
                      style={{
                        width: '100%',
                        height: '100%',
                        background:
                          bgUrl
                            ? `url('${bgUrl}') center / cover no-repeat`
                            : 'radial-gradient(circle at top, rgba(217,70,239,0.35), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.8))',
                      }}
                    >
                      {/* darken for readability */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65"></div>

                      <div className="absolute inset-x-0 top-0 p-4 sm:p-6">
                        <div
                          className={cn(
                            'text-center font-black leading-[0.92] tracking-tight text-white',
                            uppercase && 'uppercase'
                          )}
                          style={{
                            fontFamily:
                              "Impact, Haettenschweiler, 'Arial Black', system-ui, sans-serif",
                            fontSize: `${fontSize}px`,
                            textShadow: strokeShadow(strokePx),
                          }}
                        >
                          {displayTop || ' '}
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                        <div
                          className={cn(
                            'text-center font-black leading-[0.92] tracking-tight text-white',
                            uppercase && 'uppercase'
                          )}
                          style={{
                            fontFamily:
                              "Impact, Haettenschweiler, 'Arial Black', system-ui, sans-serif",
                            fontSize: `${fontSize}px`,
                            textShadow: strokeShadow(strokePx),
                          }}
                        >
                          {displayBottom || ' '}
                        </div>
                      </div>

                      {watermark ? (
                        <div className="absolute right-3 bottom-3 text-[10px] sm:text-xs font-mono text-white/70 bg-black/40 border border-white/10 px-2 py-1 rounded">
                          CHAOS OS
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <ResultActions
                    moduleKey={moduleKey}
                    text={shareText}
                    shareTitle="Kreator memów — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="meme"
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
                          setBottomText(parts.slice(1).join(' / ') || '');
                        }}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Controls */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/60">
              <CardContent className="p-5 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Tekst górny
                  </label>
                  <Input
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="KIEDY..."
                    className="h-12 font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Tekst dolny
                  </label>
                  <Input
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="A WTEDY..."
                    className="h-12 font-semibold"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Format
                    </label>
                    <Select value={aspect} onValueChange={(v) => setAspect(v as Aspect)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ASPECTS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      UPPERCASE
                    </label>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                      <div className="text-sm">
                        <div className="font-semibold">Wielkie litery</div>
                        <div className="text-xs text-muted-foreground">Klasyczny styl mema.</div>
                      </div>
                      <Switch checked={uppercase} onCheckedChange={setUppercase} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Rozmiar czcionki
                    </label>
                    <span className="text-xs text-muted-foreground font-mono">{fontSize}px</span>
                  </div>
                  <Slider value={[fontSize]} min={36} max={110} step={1} onValueChange={(v) => setFontSize(v[0] ?? 74)} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Obwódka
                    </label>
                    <span className="text-xs text-muted-foreground font-mono">{strokePx}px</span>
                  </div>
                  <Slider value={[strokePx]} min={0} max={10} step={1} onValueChange={(v) => setStrokePx(v[0] ?? 6)} />
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
                      Tip: URL bez CORS może zepsuć eksport PNG. Najpewniej: upload.
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
                      <div className="text-xs text-muted-foreground">Dyskretny podpis w rogu.</div>
                    </div>
                    <Switch checked={watermark} onCheckedChange={setWatermark} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const payload = [tTop, tBottom].filter(Boolean).join(' / ').trim();
                      if (!payload) {
                        toast.error('Najpierw wpisz jakiś tekst');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane w historii');
                    }}
                    className="flex-1"
                  >
                    Zapisz tekst
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setTopText('');
                      setBottomText('');
                    }}
                  >
                    Wyczyść
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            To jest kreator memów (grafika). Generator paska TV jest osobnym modułem.
          </div>
        </div>
      </div>
    </main>
  );
}
