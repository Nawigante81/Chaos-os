'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, FileDown, Tv, Upload, Video } from 'lucide-react';
import { toast } from 'sonner';

const EXPORT_SIZES = {
  '1920x1080': { width: 1920, height: 1080 },
  '1280x720': { width: 1280, height: 720 },
} as const;

type ExportSize = keyof typeof EXPORT_SIZES;

type BackgroundKind = 'image' | 'video' | 'none';

export default function PaskiPage() {
  const [text, setText] = useState('ATAK IDEOLOGII VEGE NA POLSKIE STOŁY');
  const [mode, setMode] = useState<'blue' | 'red'>('blue');
  const [tickerEnabled, setTickerEnabled] = useState(false);
  const [exportSize, setExportSize] = useState<ExportSize>('1920x1080');
  const [bgUrl, setBgUrl] = useState('');
  const [bgKind, setBgKind] = useState<BackgroundKind>('none');
  const [bgFileName, setBgFileName] = useState('');
  const [previewScale, setPreviewScale] = useState(0.5);
  const [autoFontSize, setAutoFontSize] = useState(64);

  const previewWrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const displayText = (text || '').trim() || 'WPISZ COŚ, BO NIC NIE WIDAĆ';

  const theme = useMemo(() => {
    if (mode === 'red') {
      return {
        accent: 'bg-red-500',
        accentSoft: 'bg-red-400/80',
        barGradient:
          'from-[#5b0a0a] via-[#7c0f0f] to-[#3a0505]',
        barBorder: 'border-red-300/40',
        badge: 'bg-red-600 text-white',
        badgeAlt: 'bg-amber-400 text-black',
        glow: 'drop-shadow-[0_0_10px_rgba(255,60,60,0.6)]',
      };
    }

    return {
      accent: 'bg-sky-500',
      accentSoft: 'bg-sky-400/80',
      barGradient: 'from-[#0a2a54] via-[#0c3b73] to-[#071c38]',
      barBorder: 'border-sky-200/40',
      badge: 'bg-sky-500 text-white',
      badgeAlt: 'bg-amber-400 text-black',
      glow: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]',
    };
  }, [mode]);

  const tickerText = tickerEnabled
    ? `${displayText} • ${displayText} • ${displayText}`
    : displayText;

  useLayoutEffect(() => {
    const container = previewWrapRef.current;
    if (!container) return;

    const updateScale = () => {
      const width = container.clientWidth;
      const scale = Math.min(1, Math.max(0.2, width / 1920));
      setPreviewScale(scale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (tickerEnabled) {
      setAutoFontSize(64);
      return;
    }

    const wrap = textWrapRef.current;
    const node = textRef.current;
    if (!wrap || !node) return;

    const maxFont = 72;
    const minFont = 28;
    let size = maxFont;
    node.style.fontSize = `${size}px`;

    while (size > minFont && node.scrollWidth > wrap.clientWidth) {
      size -= 2;
      node.style.fontSize = `${size}px`;
    }

    setAutoFontSize(size);
  }, [displayText, tickerEnabled, previewScale]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleBackgroundFile = (file: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setBgUrl(url);
    setBgFileName(file.name);

    if (file.type.startsWith('video')) {
      setBgKind('video');
    } else {
      setBgKind('image');
    }
  };

  const handleBackgroundUrl = () => {
    if (!bgUrl.trim()) {
      toast.error('Wklej adres URL tła');
      return;
    }

    setBgKind(bgUrl.endsWith('.mp4') || bgUrl.endsWith('.webm') ? 'video' : 'image');
    setBgFileName(bgUrl.trim());
  };

  const clearBackground = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setBgUrl('');
    setBgKind('none');
    setBgFileName('');
  };

  const downloadDataUrl = (dataUrl: string, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = dataUrl;
    link.click();
  };

  const handleExport = async (format: 'png' | 'jpg') => {
    if (!frameRef.current) return;

    const { width, height } = EXPORT_SIZES[exportSize];
    const node = frameRef.current;

    try {
      const sharedOptions = {
        width,
        height,
        canvasWidth: width,
        canvasHeight: height,
        pixelRatio: 1,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        filter: (domNode: HTMLElement) => {
          if (format === 'png' && domNode instanceof HTMLElement && domNode.dataset.exportExclude === 'png') {
            return false;
          }
          return true;
        },
      };

      if (format === 'png') {
        const dataUrl = await toPng(node, {
          ...sharedOptions,
        });
        downloadDataUrl(dataUrl, `pasek-${exportSize}.png`);
        return;
      }

      const dataUrl = await toJpeg(node, {
        ...sharedOptions,
        quality: 0.95,
        backgroundColor: '#050505',
      });
      downloadDataUrl(dataUrl, `pasek-${exportSize}.jpg`);
    } catch (error) {
      toast.error('Nie udało się wyeksportować', {
        description:
          'Jeśli używasz zewnętrznego URL bez CORS, eksport może się nie udać.',
      });
    }
  };

  return (
    <main className="min-h-[100svh] bg-[#0a0b10] flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-80"></div>
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-15 mix-blend-soft-light pointer-events-none"></div>

      <div className="z-10 w-full max-w-6xl space-y-8 sm:space-y-10">
        <header className="text-center space-y-3">
          <Tv className={`w-14 h-14 mx-auto ${mode === 'red' ? 'text-red-500' : 'text-sky-400'} animate-pulse`} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.08em] uppercase">
            Generator paska newsowego
          </h1>
          <p className="text-slate-300/70 text-sm sm:text-base">
            Realistyczny lower-third do wideo i screenów — jak z prawdziwej stacji.
          </p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-black/40 shadow-[0_30px_120px_rgba(0,0,0,0.5)] p-4 sm:p-6">
          <div ref={previewWrapRef} className="w-full">
            <div className="relative w-full" style={{ height: `${1080 * previewScale}px` }}>
              <div
                ref={frameRef}
                className="absolute left-0 top-0 overflow-hidden"
                style={{
                  width: '1920px',
                  height: '1080px',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <div className="absolute inset-0 bg-transparent"></div>

                {bgKind !== 'none' && (
                  <div className="absolute inset-0" data-export-exclude="png">
                    {bgKind === 'image' && (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${bgUrl}')` }}
                      />
                    )}
                    {bgKind === 'video' && (
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={bgUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                )}

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-white/10 text-white/70 border border-white/20 rounded">HD</span>
                    <span className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-white/10 text-white/70 border border-white/20 rounded">LIVE</span>
                  </div>
                </div>

                <div className="absolute left-0 right-0 bottom-0">
                  <div className={`h-[6px] ${theme.accent} shadow-[0_0_14px_rgba(0,0,0,0.35)]`}></div>

                  <div className={`relative h-[160px] bg-gradient-to-r ${theme.barGradient} ${theme.barBorder} border-t border-b shadow-[0_-16px_40px_rgba(0,0,0,0.45)] backdrop-blur-[6px] tv-slide-in`}>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_60%)]"></div>
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light"></div>

                    <div className="absolute left-10 top-6 flex items-center gap-2">
                      <span className={`${theme.badgeAlt} px-3 py-1 text-xs font-black uppercase tracking-[0.2em] shadow-[0_4px_14px_rgba(0,0,0,0.4)] tv-fade-in`}>
                        PILNE
                      </span>
                      <span className={`${theme.badge} px-3 py-1 text-xs font-black uppercase tracking-[0.2em] shadow-[0_4px_14px_rgba(0,0,0,0.35)] tv-fade-in`}>
                        BREAKING
                      </span>
                      <span className="bg-black/70 text-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35)] tv-fade-in">
                        NA ŻYWO
                      </span>
                    </div>

                    <div className="absolute right-8 top-6 flex items-center gap-3">
                      <span className="flex items-center gap-2 rounded-full border border-white/30 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
                        <span className={`h-2 w-2 rounded-full ${theme.accentSoft} shadow-[0_0_10px_rgba(255,255,255,0.7)]`}></span>
                        LIVE
                      </span>
                    </div>

                    <div className="absolute inset-x-12 bottom-6">
                      <div ref={textWrapRef} className="overflow-hidden">
                        <div
                          ref={textRef}
                          className={`font-black uppercase tracking-[0.12em] text-white ${theme.glow} ${tickerEnabled ? 'tv-ticker' : ''}`}
                          style={{
                            fontSize: `${autoFontSize}px`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tickerText}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[10px] bg-gradient-to-b from-black/70 via-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-black/60 border-white/10">
          <CardContent className="p-5 sm:p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Treść paska
              </label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="WIADOMOŚCI Z OSTATNIEJ CHWILI"
                className="bg-black/60 border-white/15 text-white placeholder:text-white/40 h-12 font-black uppercase tracking-[0.08em]"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Tryb emisji
                </label>
                <RadioGroup
                  value={mode}
                  onValueChange={(value) => setMode(value === 'red' ? 'red' : 'blue')}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="blue" id="mode-blue" className="text-sky-400 border-sky-400" />
                    <label htmlFor="mode-blue" className="text-white text-sm font-semibold">
                      🔵 Wiadomości (niebieski)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="red" id="mode-red" className="text-red-500 border-red-500" />
                    <label htmlFor="mode-red" className="text-white text-sm font-semibold">
                      🔴 Alarm / Pilne (czerwony)
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Animacje
                </label>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Ticker (przewijanie)</p>
                    <p className="text-xs text-white/60">Opcjonalny ruch jak w TV.</p>
                  </div>
                  <Switch checked={tickerEnabled} onCheckedChange={setTickerEnabled} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Tło pod paskiem (opcjonalne)
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={bgUrl}
                    onChange={(e) => setBgUrl(e.target.value)}
                    placeholder="Wklej URL zdjęcia lub wideo"
                    className="bg-black/60 border-white/15 text-white placeholder:text-white/40 h-11"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackgroundUrl}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Video className="mr-2 h-4 w-4" /> Ustaw URL
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-white/10">
                    <Upload className="h-4 w-4" />
                    Wgraj obraz lub wideo
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          handleBackgroundFile(file);
                        }
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearBackground}
                    className="text-white/70 hover:text-white"
                  >
                    Usuń tło
                  </Button>
                  {bgFileName && (
                    <span className="text-xs text-white/60">Aktywne: {bgFileName}</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Eksport
                </label>
                <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/70">Rozdzielczość</span>
                    <Select value={exportSize} onValueChange={(value) => setExportSize(value as ExportSize)}>
                      <SelectTrigger className="w-36 border-white/15 text-white">
                        <SelectValue placeholder="Wybierz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1920x1080">1920×1080</SelectItem>
                        <SelectItem value="1280x720">1280×720</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleExport('png')}
                      className="flex-1 bg-white text-black hover:bg-white/80"
                    >
                      <FileDown className="mr-2 h-4 w-4" /> PNG (przezroczysty)
                    </Button>
                    <Button
                      onClick={() => handleExport('jpg')}
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <FileDown className="mr-2 h-4 w-4" /> JPG (tło)
                    </Button>
                  </div>

                  <div className="text-xs text-white/50">
                    MP4/GIF: w przygotowaniu (animacje wymagają renderu klatek).
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/70 text-xs">
              <AlertCircle className="h-4 w-4" />
              PNG usuwa tło i zostawia tylko overlay. Jeśli używasz URL bez CORS, eksport może się nie udać.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
