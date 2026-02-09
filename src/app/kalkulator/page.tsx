'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skull, Clock, Cigarette, Croissant } from 'lucide-react';
import { toast } from 'sonner';

export default function KalkulatorPage() {
  const [age, setAge] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const calculateDeath = () => {
    if (age <= 0 || age > 120) return;

    // Base life expectancy: 75 years
    // Minus 1 year for every year lived (obviously)
    // Random reduction factor
    
    const maxLife = 75;
    const remainingYears = Math.max(0, maxLife - age - Math.random() * 10);
    const secondsLeft = Math.floor(remainingYears * 365 * 24 * 60 * 60);
    
    setTimeLeft(secondsLeft);
    toast.error('Obliczono!', { description: 'Nie zostało Ci wiele czasu.' });
  };

  useEffect(() => {
    if (timeLeft === null) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <main className="min-h-[100svh] bg-slate-950 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="z-10 w-full max-w-lg space-y-10 sm:space-y-12 animate-in fade-in duration-1000">
        <header className="text-center space-y-4">
          <Skull className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-slate-500 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-300 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            KALKULATOR <span className="text-slate-600">ZGONU</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm">
            Memento Mori, kolego.
          </p>
        </header>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 sm:p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-widest block text-center">
                Ile masz lat?
              </label>
              <div className="flex justify-center">
                <Input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-28 sm:w-32 h-14 sm:h-16 text-3xl sm:text-4xl font-bold text-center bg-black border-slate-700 text-white placeholder:text-slate-700 focus-visible:ring-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 text-slate-500">
              <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed" title="Wpływa negatywnie">
                <Cigarette className="w-6 h-6" /> Palisz?
              </div>
              <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed" title="Zabójcze">
                <Croissant className="w-6 h-6" /> Gluten?
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={calculateDeath}
            >
              <Clock className="mr-2 w-6 h-6 animate-spin-slow" /> OBLICZ KONIEC
            </Button>

            {timeLeft !== null && (
              <div className="mt-8 pt-8 border-t border-slate-800 text-center space-y-2 animate-in zoom-in duration-500">
                <p className="text-sm text-slate-500 uppercase tracking-widest">Pozostało Ci:</p>
                <div className="text-3xl md:text-5xl font-mono font-black text-red-500 tabular-nums animate-pulse">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-slate-600 italic">
                  *Nie planuj wakacji w 2080.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
