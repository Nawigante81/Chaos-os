'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Briefcase } from 'lucide-react';

const sounds = [
  { label: 'ASAP', text: 'To musi być zrobione na wczoraj, ASAP!' },
  { label: 'Deadline', text: 'Deadline był godzinę temu.' },
  { label: 'Challange', text: 'To jest ciekawy czelendż dla zespołu.' },
  { label: 'Dowieziemy', text: 'Spokojnie, dowieziemy to do końca kwartału.' },
  { label: 'Estymacja', text: 'Moja estymacja to dwa dni robocze plus weekend.' },
  { label: 'Synergia', text: 'Musimy znaleźć synergię między działami.' },
  { label: 'Target', text: 'Nie dowieźliśmy targetu sprzedażowego.' },
  { label: 'Feedback', text: 'Mam dla ciebie krótki feedback kanapkowy.' },
  { label: 'Fuckup', text: 'Mamy potężny fakap na produkcji.' },
  { label: 'Meeting', text: 'Przełóżmy to na kolejny miting statusowy.' },
  { label: 'Budżet', text: 'Nie ma na to budżetu w tym Q4.' },
  { label: 'KPI', text: 'To nie wpływa na nasze kej-pi-aje.' }
];

export default function SoundboardPage() {
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const playSound = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 1.1;
    utterance.pitch = 0.9; // Slightly lower, "serious" pitch
    
    utterance.onstart = () => setActiveSound(text);
    utterance.onend = () => setActiveSound(null);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-[100svh] bg-slate-900 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
      <div className="max-w-4xl w-full space-y-8">
        <header className="text-center space-y-2">
          <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-400 animate-bounce" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-400 tracking-tighter uppercase">
            KORPO<span className="text-white">BOARD</span>
          </h1>
          <p className="text-slate-400 font-mono">
            Narzędzie niezbędne na każdym callu.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sounds.map((sound) => (
            <Button
              key={sound.label}
              className={`h-20 sm:h-24 text-base sm:text-lg font-bold transition-all transform hover:scale-105 active:scale-95 ${
                activeSound === sound.text 
                  ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-blue-400 border-2 border-slate-700'
              }`}
              onClick={() => playSound(sound.text)}
            >
              <div className="flex flex-col items-center gap-2">
                <Volume2 className={`w-6 h-6 ${activeSound === sound.text ? 'animate-pulse' : ''}`} />
                {sound.label}
              </div>
            </Button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 font-mono mt-8">
          Używać z rozwagą podczas rozmów z HR.
        </p>
      </div>
    </main>
  );
}
