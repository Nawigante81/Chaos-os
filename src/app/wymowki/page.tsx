'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { categories, excusesData, formatExcuseByTone, pickExcuseWithBlacklist, type ExcuseTone } from '@/lib/excuses';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { isFavorited, loadFavorites, loadHistory, saveToHistory, toggleFavorite } from '@/lib/local-history';
import { Copy, Volume2, Sparkles, AlertTriangle, History, Shuffle, Star, Upload, Download } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('work');
  const [currentExcuse, setCurrentExcuse] = useState<string>('');
  const [sadnessLevel, setSadnessLevel] = useState<number>(50);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [batchSuggestions, setBatchSuggestions] = useState<string[]>([]);
  const [tone, setTone] = useState<ExcuseTone>('casual');
  const [blacklistRaw, setBlacklistRaw] = useState('');

  const moduleKey = 'wymowki';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);
  const favoritesKey = useMemo(() => `chaos:favorites:${moduleKey}`, []);
  const resultRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadFavorites(favoritesKey).map((x) => x.text)
  );

  const blacklist = useMemo(
    () =>
      blacklistRaw
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    [blacklistRaw]
  );

  const displayExcuse = useMemo(() => formatExcuseByTone(currentExcuse, tone), [currentExcuse, tone]);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, []);

  const handleGenerate = () => {
    const excuse = pickExcuseWithBlacklist(activeCategory as keyof typeof excusesData, blacklist);
    setCurrentExcuse(excuse);
    setBatchSuggestions([]);
    saveToHistory(historyKey, excuse, 30);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const handleGenerateBatch = () => {
    const picks = Array.from({ length: 3 }, () =>
      pickExcuseWithBlacklist(activeCategory as keyof typeof excusesData, blacklist)
    );
    setBatchSuggestions(picks);
    setCurrentExcuse(picks[0]);
    saveToHistory(historyKey, picks[0], 30);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  useEffect(() => {
    setBatchSuggestions([]);
  }, [activeCategory]);

  const handleCopy = () => {
    if (!displayExcuse) return;
    navigator.clipboard.writeText(displayExcuse);
    toast.success('Wymówka skopiowana!', {
      description: 'Teraz idź i kłam z godnością.',
    });
  };

  const handleToggleFavorite = () => {
    if (!currentExcuse) return;
    const added = toggleFavorite(favoritesKey, currentExcuse);
    setFavorites(loadFavorites(favoritesKey).map((x) => x.text));
    toast.success(added ? 'Dodano do ulubionych' : 'Usunięto z ulubionych');
  };

  const handleExportFavorites = () => {
    if (favorites.length === 0) {
      toast.error('Brak ulubionych do eksportu');
      return;
    }

    const payload = {
      module: moduleKey,
      exportedAt: new Date().toISOString(),
      items: favorites,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chaos-wymowki-ulubione.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFavorites = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}')) as { items?: string[] };
        const items = Array.isArray(parsed.items)
          ? parsed.items.map((x) => String(x).trim()).filter(Boolean)
          : [];

        if (items.length === 0) {
          toast.error('Plik nie zawiera ulubionych');
          return;
        }

        const prev = loadFavorites(favoritesKey).map((x) => x.text);
        const merged = Array.from(new Set([...items, ...prev])).slice(0, 200);
        window.localStorage.setItem(
          favoritesKey,
          JSON.stringify(merged.map((text) => ({ id: crypto.randomUUID(), text, createdAt: Date.now() })))
        );
        setFavorites(loadFavorites(favoritesKey).map((x) => x.text));
        toast.success(`Zaimportowano ${items.length} pozycji`);
      } catch {
        toast.error('Niepoprawny plik JSON');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSpeak = () => {
    if (!displayExcuse) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(displayExcuse);
    
    // Adjust pitch and rate based on sadness level
    // High sadness = Low pitch, Slow rate
    // Low sadness = Normal pitch, Normal rate
    
    const sadnessFactor = sadnessLevel / 100; // 0 to 1
    
    utterance.pitch = Math.max(0.1, 1.2 - sadnessFactor); // 1.2 to 0.2
    utterance.rate = Math.max(0.4, 1.1 - (sadnessFactor * 0.5));  // 1.1 to 0.6
    utterance.volume = 1;

    // Try to find a Polish voice, preferably Google Polski or similar
    // Sort to prioritize Google voices as they tend to be higher quality
    const polishVoice = voices
      .filter(v => v.lang.includes('pl') || v.lang.includes('PL'))
      .sort((a, b) => (a.name.includes('Google') === b.name.includes('Google') ? 0 : a.name.includes('Google') ? -1 : 1))[0];
      
    if (polishVoice) {
      utterance.voice = polishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-[100svh] bg-background transition-colors duration-500">
      <AppHeader title="Kreator Wymówek" />
      <div className="flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-primary animate-in fade-in slide-in-from-top-4 duration-700">
            Kreator Wymówek <span className="text-destructive">5000</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Profesjonalny generator alibi dla ludzi bez godności.
          </p>
        </header>

        <Card className="border-2 border-primary/20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle>Wybierz kategorię kłamstwa</CardTitle>
            <CardDescription>Komu dzisiaj musisz ściemniać?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="work" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    <span className="mr-2">{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.label.split(' / ')[0]}</span>
                    <span className="sm:hidden">{cat.label.split(' / ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
              <div className="text-sm text-muted-foreground">Styl wymówki</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'casual', label: 'Normal' },
                  { id: 'sms', label: 'SMS' },
                  { id: 'mail', label: 'Mail' },
                  { id: 'teams', label: 'Teams' },
                ].map((t) => (
                  <Button
                    key={t.id}
                    variant={tone === t.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTone(t.id as ExcuseTone)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Blacklist słów (oddziel przecinkami)</label>
                <Input
                  value={blacklistRaw}
                  onChange={(e) => setBlacklistRaw(e.target.value)}
                  placeholder="np. kot, NASA, dziki"
                />
              </div>
            </div>

            <div
              ref={resultRef}
              className="flex flex-col items-center justify-center p-6 min-h-[200px] border-2 border-dashed border-muted rounded-xl bg-muted/10 relative overflow-hidden group"
            >
              {displayExcuse ? (
                <p className="text-xl md:text-2xl font-mono text-center font-medium leading-relaxed animate-in zoom-in duration-300 whitespace-pre-wrap">
                  &quot;{displayExcuse}&quot;
                </p>
              ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-2 opacity-50">
                  <AlertTriangle className="w-12 h-12" />
                  <p>System gotowy. Oczekiwanie na generację kłamstwa.</p>
                </div>
              )}
            </div>

            <ResultActions
              moduleKey={moduleKey}
              text={displayExcuse}
              shareTitle="Kreator Wymówek 5000"
              exportRef={resultRef}
              exportFileBase="wymowka"
            />

            {batchSuggestions.length > 0 ? (
              <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shuffle className="h-4 w-4" /> 3 szybkie propozycje
                </div>
                <div className="grid gap-2">
                  {batchSuggestions.map((h, idx) => (
                    <button
                      key={`${h}-${idx}`}
                      className="text-left text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/70 px-3 py-2 transition-colors"
                      onClick={() => setCurrentExcuse(h)}
                      title="Kliknij, aby ustawić tę wymówkę"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border border-amber-500/40 bg-card/50 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-amber-300">
                  <Star className="h-4 w-4" /> Ulubione wymówki
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleExportFavorites} disabled={favorites.length === 0}>
                    <Download className="w-4 h-4 mr-1" /> Export
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => importRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" /> Import
                  </Button>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImportFavorites}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                {favorites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Brak ulubionych. Dodaj gwiazdką przy wyniku albo zaimportuj JSON.</p>
                ) : (
                  favorites.slice(0, 5).map((h) => (
                    <button
                      key={`fav-${h}`}
                      className="text-left text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/70 px-3 py-2 transition-colors"
                      onClick={() => setCurrentExcuse(h)}
                      title="Kliknij, aby wczytać"
                    >
                      {h}
                    </button>
                  ))
                )}
              </div>
            </div>

            {history.length > 0 ? (
              <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="h-4 w-4" /> Ostatnie wyniki
                </div>
                <div className="grid gap-2">
                  {history.slice(0, 5).map((h) => (
                    <button
                      key={h}
                      className="text-left text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/70 px-3 py-2 transition-colors"
                      onClick={() => setCurrentExcuse(h)}
                      title="Kliknij, aby wczytać"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Poziom smutku syntezatora: {sadnessLevel}%
                </label>
                <span className="text-xs text-muted-foreground">
                  {sadnessLevel < 30 ? 'Lekki smuteczek' : sadnessLevel < 70 ? 'Depresja biurowa' : 'Egzystencjalna pustka'}
                </span>
              </div>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={[sadnessLevel]}
                onValueChange={(vals) => setSadnessLevel(vals[0])}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <div className="flex w-full flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="w-full sm:w-auto flex-1 text-lg font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all"
                onClick={handleGenerate}
              >
                <Sparkles className="mr-2 w-5 h-5" /> Generuj Wymówkę
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={handleGenerateBatch}
              >
                <Shuffle className="mr-2 w-4 h-4" /> Losuj 3 opcje
              </Button>
            </div>

            <div className="flex w-full sm:w-auto gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 sm:flex-none w-full sm:w-12 aspect-square"
                onClick={handleSpeak}
                disabled={!displayExcuse}
                title="Przeczytaj smutnym głosem"
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 sm:flex-none w-full sm:w-12 aspect-square"
                onClick={handleCopy}
                disabled={!displayExcuse}
                title="Skopiuj do schowka"
              >
                <Copy className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="flex-1 sm:flex-none w-full sm:w-12 aspect-square"
                onClick={handleToggleFavorite}
                disabled={!currentExcuse}
                title="Dodaj/usuń ulubione"
              >
                <Star className={`w-5 h-5 ${isFavorited(favoritesKey, currentExcuse) ? 'text-amber-400 fill-amber-400' : ''}`} />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-mono opacity-50">
          Powered by Pytomek Industries™ • Nie ponosimy odpowiedzialności za zwolnienia dyscyplinarne.
        </p>
      </div>
      <Toaster />
      </div>
    </main>
  );
}
