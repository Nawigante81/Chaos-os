'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Briefcase, Frown, DollarSign, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const scenarios = [
  {
    text: "Szefie, chciałem porozmawiać o finansach...",
    response: "O finansach? A raport z wczoraj gdzie jest? (-10 Cierpliwości)",
    damage: 10
  },
  {
    text: "Jestem tu już 5 lat i...",
    response: "I co z tego? Krzesło też tu stoi 5 lat. (-20 Cierpliwości)",
    damage: 20
  },
  {
    text: "Mam ofertę z konkurencji.",
    response: "To szerokiej drogi! Drzwi są tam. (Game Over)",
    damage: 100
  },
  {
    text: "Zrobiłem ten duży projekt tydzień przed czasem.",
    response: "To znaczy, że masz za mało roboty. (+5 Cierpliwości)",
    damage: -5
  },
  {
    text: "Inflacja szaleje, szefie.",
    response: "U mnie też. Musiałem zrezygnować z trzeciego jachtu. (-15 Cierpliwości)",
    damage: 15
  }
];

export default function PodwyzkaPage() {
  const [patience, setPatience] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleChoice = (scenario: typeof scenarios[0]) => {
    const newPatience = Math.max(0, Math.min(100, patience - scenario.damage));
    setPatience(newPatience);
    setHistory(prev => [...prev, `Ty: ${scenario.text}`, `Szef: ${scenario.response}`]);

    if (newPatience <= 0) {
      setGameOver(true);
      toast.error('ZWOLNIONY!', { description: 'Szef stracił cierpliwość.' });
    } else if (Math.random() > 0.9) { // eslint-disable-line react-hooks/purity -- randomness is part of the game loop
      setWin(true);
      toast.success('SUKCES!', { description: 'Dostałeś 50zł brutto podwyżki!' });
    }
  };

  const reset = () => {
    setPatience(100);
    setGameOver(false);
    setWin(false);
    setHistory([]);
  };

  if (gameOver) {
    return (
      <div className="min-h-[100svh] bg-red-950 flex flex-col items-center justify-center text-center p-6 sm:p-8 text-white space-y-6 sm:space-y-8 animate-in zoom-in">
        <XCircle className="w-24 h-24 sm:w-32 sm:h-32 animate-pulse" />
        <h1 className="text-4xl sm:text-6xl font-black uppercase">WYLECIAŁEŚ!</h1>
        <p className="text-lg sm:text-2xl opacity-80">Szef kazał ci spakować karton.</p>
        <Button onClick={reset} variant="secondary" size="lg">Spróbuj ponownie (w innej firmie)</Button>
      </div>
    );
  }

  if (win) {
    return (
      <div className="min-h-[100svh] bg-green-900 flex flex-col items-center justify-center text-center p-6 sm:p-8 text-white space-y-6 sm:space-y-8 animate-in zoom-in">
        <DollarSign className="w-24 h-24 sm:w-32 sm:h-32 animate-bounce text-yellow-400" />
        <h1 className="text-4xl sm:text-6xl font-black uppercase">50 ZŁ BRUTTO!</h1>
        <p className="text-lg sm:text-2xl opacity-80">Jesteś bogiem negocjacji. Kup sobie kawę.</p>
        <Button onClick={reset} variant="secondary" size="lg">Negocjuj dalej (ryzykowne)</Button>
      </div>
    );
  }

  return (
    <main className="min-h-[100svh] bg-neutral-900 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
      <div className="w-full max-w-2xl space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-white gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center border-2 border-red-500 overflow-hidden">
               <Frown className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Szef Janusz</h2>
              <p className="text-sm text-neutral-400">Poziom irytacji: {100 - patience}%</p>
            </div>
          </div>
          <div className="w-full sm:w-1/3">
            <Progress value={patience} className="h-4 bg-red-900 [&>div]:bg-green-500" />
          </div>
        </header>

        <Card className="bg-neutral-800 border-neutral-700 h-[70vh] sm:h-[600px] flex flex-col shadow-2xl">
          <CardContent className="flex-grow overflow-y-auto p-6 space-y-6 font-mono text-base md:text-lg">
             {history.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-neutral-500 italic space-y-4">
                 <Briefcase className="w-16 h-16 opacity-20" />
                 <p className="text-xl">Czekasz pod gabinetem. Wchodzisz?</p>
               </div>
             )}
             {history.map((line, i) => (
               <div key={i} className={`p-4 rounded-xl shadow-md transition-all animate-in slide-in-from-bottom-2 ${
                 line.startsWith('Ty:') 
                   ? 'bg-blue-900/50 text-blue-100 ml-0 sm:ml-12 border border-blue-800 text-right' 
                   : 'bg-red-900/50 text-red-100 mr-0 sm:mr-12 border border-red-800 font-bold'
               }`}>
                 {line}
               </div>
             ))}
          </CardContent>
          <CardFooter className="grid grid-cols-1 gap-3 p-6 border-t border-neutral-700 bg-neutral-900">
            {scenarios.map((scenario, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="justify-start h-auto py-2.5 sm:py-3 text-left hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white"
                onClick={() => handleChoice(scenario)}
              >
                <User className="mr-2 w-4 h-4 text-blue-500 shrink-0" />
                <span className="whitespace-normal text-left">{scenario.text}</span>
              </Button>
            ))}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
