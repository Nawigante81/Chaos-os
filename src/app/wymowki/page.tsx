'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { categories, excusesData, getRandomExcuse } from '@/lib/excuses';
import { Copy, Volume2, Sparkles, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('work');
  const [currentExcuse, setCurrentExcuse] = useState<string>('');
  const [sadnessLevel, setSadnessLevel] = useState<number>(50);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Force dark mode for the vibe
    document.documentElement.classList.add('dark');
  }, []);

  const handleGenerate = () => {
    const excuse = getRandomExcuse(activeCategory as keyof typeof excusesData);
    setCurrentExcuse(excuse);
  };

  const handleCopy = () => {
    if (!currentExcuse) return;
    navigator.clipboard.writeText(currentExcuse);
    toast.success('Wymówka skopiowana!', {
      description: 'Teraz idź i kłam z godnością.',
    });
  };

  const handleSpeak = () => {
    if (!currentExcuse) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentExcuse);
    
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
      .sort((a, b) => (a.name.includes('Google') ? -1 : 1))[0];
      
    if (polishVoice) {
      utterance.voice = polishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-[100svh] bg-background flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 transition-colors duration-500">
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

            <div className="flex flex-col items-center justify-center p-6 min-h-[200px] border-2 border-dashed border-muted rounded-xl bg-muted/10 relative overflow-hidden group">
              {currentExcuse ? (
                <p className="text-xl md:text-2xl font-mono text-center font-medium leading-relaxed animate-in zoom-in duration-300">
                  &quot;{currentExcuse}&quot;
                </p>
              ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-2 opacity-50">
                  <AlertTriangle className="w-12 h-12" />
                  <p>System gotowy. Oczekiwanie na generację kłamstwa.</p>
                </div>
              )}
            </div>

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
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              size="lg" 
              className="w-full sm:w-auto flex-1 text-lg font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all"
              onClick={handleGenerate}
            >
              <Sparkles className="mr-2 w-5 h-5" /> Generuj Wymówkę
            </Button>
            
            <div className="flex w-full sm:w-auto gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 sm:flex-none w-full sm:w-12 aspect-square"
                onClick={handleSpeak}
                disabled={!currentExcuse}
                title="Przeczytaj smutnym głosem"
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 sm:flex-none w-full sm:w-12 aspect-square"
                onClick={handleCopy}
                disabled={!currentExcuse}
                title="Skopiuj do schowka"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-mono opacity-50">
          Powered by Pytomek Industries™ • Nie ponosimy odpowiedzialności za zwolnienia dyscyplinarne.
        </p>
      </div>
      <Toaster />
    </main>
  );
}
