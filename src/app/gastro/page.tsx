'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { foodItems, insults } from '@/lib/food';
import { X, Check, Heart, Frown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function GastroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInsult, setCurrentInsult] = useState('');
  const [winner, setWinner] = useState<any>(null);

  const handleLike = () => {
    // Winner!
    setWinner(foodItems[currentIndex]);
    toast.success('Mamy to!', {
      description: `Wybór grubasa zatwierdzony: ${foodItems[currentIndex].name}`,
    });
  };

  const handleDislike = () => {
    // Insult logic
    const insult = insults[Math.floor(Math.random() * insults.length)];
    setCurrentInsult(insult);
    
    // Move to next
    if (currentIndex < foodItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop or finish? Let's loop but insult harder
      toast.error('Koniec menu!', {
        description: 'Jesteś beznadziejny. Zaczynamy od nowa.',
      });
      setCurrentIndex(0);
    }
  };

  const reset = () => {
    setWinner(null);
    setCurrentIndex(0);
    setCurrentInsult('');
  };

  const currentFood = foodItems[currentIndex];

  if (winner) {
    return (
      <main className="min-h-[100svh] bg-orange-950 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 text-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none"></div>
        
        <div className="z-10 animate-in zoom-in duration-500 space-y-6">
          <Heart className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 mx-auto animate-pulse" />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-orange-400 tracking-tighter uppercase">
            ŻRYJ TO!
          </h1>
          
          <div className="relative group mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden border-4 border-orange-500 shadow-[0_0_50px_rgba(255,165,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={winner.image} 
              alt={winner.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white">{winner.name}</h2>
              <p className="text-orange-300 font-mono">{winner.calories}</p>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-orange-200/80 max-w-lg mx-auto">
            {winner.desc} <br/>
            <span className="text-sm opacity-50">(Nie zapomnij o coli zero dla równowagi)</span>
          </p>

          <Button 
            onClick={reset} 
            size="lg" 
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-900/50 mt-8"
          >
            <RotateCcw className="mr-2 w-4 h-4" /> Jeszcze raz (bo wciąż głodny)
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-background flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>

      <div className="z-10 w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-orange-500 flex items-center justify-center gap-2">
            GASTRO<span className="text-foreground">MATCH</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Tinder dla głodnych desperatów.
          </p>
        </header>

        <div className="relative h-[60vh] sm:h-[500px] w-full perspective-1000">
          <Card className="absolute inset-0 border-2 border-orange-500/20 bg-card shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="relative flex-grow overflow-hidden bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                key={currentFood.id} // Force re-render for animation
                src={currentFood.image} 
                alt={currentFood.name}
                className="w-full h-full object-cover animate-in zoom-in duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white shadow-black drop-shadow-lg">{currentFood.name}</h2>
                <div className="flex items-center gap-2 text-orange-300 font-mono text-sm font-bold bg-black/50 w-fit px-2 py-1 rounded backdrop-blur-md">
                   {currentFood.calories}
                </div>
                <p className="text-white/80 text-sm mt-2 font-medium drop-shadow-md leading-relaxed">
                  {currentFood.desc}
                </p>
              </div>
            </div>

            <CardFooter className="p-4 xs:p-5 sm:p-6 grid grid-cols-2 gap-4 bg-background/95 backdrop-blur border-t border-border">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500 rounded-full transition-all hover:scale-105 active:scale-95"
                onClick={handleDislike}
              >
                <X className="w-8 h-8" />
                <span className="sr-only">Nie, fuj</span>
              </Button>
              
              <Button 
                variant="default" 
                size="lg" 
                className="h-16 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all hover:scale-105 active:scale-95"
                onClick={handleLike}
              >
                <Check className="w-8 h-8" />
                <span className="sr-only">Tak, biorę</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="h-12 flex items-center justify-center">
          {currentInsult && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-bold animate-in slide-in-from-top-2 fade-in flex items-center gap-2 border border-destructive/20">
              <Frown className="w-4 h-4" /> {currentInsult}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
