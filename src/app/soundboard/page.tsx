'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, Briefcase, History } from 'lucide-react';
import { loadHistory, saveToHistory } from '@/lib/local-history';

const playlists = {
  standup: [
    { label: 'ASAP', text: 'To musi być zrobione na wczoraj, ASAP!' },
    { label: 'Deadline', text: 'Deadline był godzinę temu.' },
    { label: 'Estymacja', text: 'Moja estymacja to dwa dni robocze plus weekend.' },
    { label: 'Meeting', text: 'Przełóżmy to na kolejny miting statusowy.' },
    { label: 'Feedback', text: 'Mam dla ciebie krótki feedback kanapkowy.' },
    { label: 'KPI', text: 'To nie wpływa na nasze kej-pi-aje.' },
  ],
  buzzwords: [
    { label: 'Synergia', text: 'Musimy znaleźć synergię między działami.' },
    { label: 'Target', text: 'Nie dowieźliśmy targetu sprzedażowego.' },
    { label: 'Budżet', text: 'Nie ma na to budżetu w tym Q4.' },
    { label: 'Challange', text: 'To jest ciekawy czelendż dla zespołu.' },
    { label: 'Dowieziemy', text: 'Spokojnie, dowieziemy to do końca kwartału.' },
  ],
  crisis: [
    { label: 'Fuckup', text: 'Mamy potężny fakap na produkcji.' },
    { label: 'ASAP', text: 'To musi być zrobione na wczoraj, ASAP!' },
    { label: 'Deadline', text: 'Deadline był godzinę temu.' },
  ],
} as const;

type PlaylistKey = keyof typeof playlists;

export default function SoundboardPage() {
  const moduleKey = 'soundboard';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistKey>('standup');
  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  const playSound = (text: string) => {
    saveToHistory(historyKey, text, 50);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 1.1;
    utterance.pitch = 0.9; // Slightly lower, "serious" pitch
    
    utterance.onstart = () => setActiveSound(text);
    utterance.onend = () => setActiveSound(null);
    
    window.speechSynthesis.speak(utterance);
  };

  const sounds = playlists[playlist];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const idx = Number(e.key) - 1;
      if (Number.isNaN(idx) || idx < 0 || idx >= sounds.length) return;
      playSound(sounds[idx].text);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sounds]);

  return (
    <main className="min-h-[100svh] bg-slate-900">
      <AppHeader title="Korpo Soundboard" />
      <div className="flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
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

        <div className="space-y-4">
          <Tabs value={playlist} onValueChange={(v) => setPlaylist(v as PlaylistKey)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standup">Standup</TabsTrigger>
              <TabsTrigger value="buzzwords">Buzzwordy</TabsTrigger>
              <TabsTrigger value="crisis">Kryzys</TabsTrigger>
            </TabsList>
          </Tabs>

          <p className="text-center text-xs text-slate-500 font-mono">
            Skróty klawiszowe: 1–9 odpala przyciski z listy.
          </p>
        </div>

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

        {history.length > 0 ? (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <History className="h-4 w-4" /> Ostatnio odtwarzane
            </div>
            <div className="grid gap-2">
              {history.slice(0, 6).map((h) => (
                <button
                  key={h}
                  className="text-left text-xs sm:text-sm rounded-lg border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/70 px-3 py-2 transition-colors text-slate-100"
                  onClick={() => playSound(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-center text-xs text-slate-600 font-mono mt-8">
          Używać z rozwagą podczas rozmów z HR.
        </p>
      </div>
      </div>
    </main>
  );
}
