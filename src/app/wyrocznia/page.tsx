'use client';

import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { loadHistory, saveToHistory } from '@/lib/local-history';
import { BrainCircuit, Sparkles, Loader2, RotateCcw, History } from 'lucide-react';

const answers = [
  "Chyba Cię Bóg opuścił.",
  "Jazda z kurwami.",
  "Tak, ale najpierw kawka.",
  "Nie wiem, zarobiony jestem.",
  "Spytaj swojej starej.",
  "A czy dzik sra w lesie?",
  "Definitywnie tak (żartowałem, nie).",
  "Może kiedyś, jak schudniesz.",
  "Szanujmy się.",
  "Pomidor.",
  "404: Mózg not found.",
  "Idź na piwo, przejdzie ci."
];

export default function WyroczniaPage() {
  const moduleKey = 'wyrocznia';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);
  const resultRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  const askOracle = () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setAnswer(null);

    // Fake thinking time
    setTimeout(() => {
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      setAnswer(randomAnswer);
      saveToHistory(historyKey, `Q: ${question.trim()}\nA: ${randomAnswer}`, 30);
      setHistory(loadHistory(historyKey, 10).map((x) => x.text));
      setIsLoading(false);
    }, 1500);
  };

  const reset = () => {
    setQuestion('');
    setAnswer(null);
  };

  return (
    <main className="min-h-[100svh] bg-violet-950 relative overflow-hidden">
      <AppHeader title="Wyrocznia Chaosu" />
      <div className="flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
      {/* Mystic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-violet-950 to-black opacity-80 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>

      <div className="z-10 w-full max-w-lg space-y-10 sm:space-y-12">
        <header className="text-center space-y-2">
          <BrainCircuit className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-purple-400 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 uppercase">
            WYROCZNIA CHAOSU
          </h1>
          <p className="text-purple-200/60 font-mono text-sm">
            Zadaj pytanie, a poznasz brutalną prawdę.
          </p>
        </header>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md shadow-2xl">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {!answer ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <Input 
                  placeholder="Czy mam rzucić robotę?" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-black/50 border-purple-500/50 text-white placeholder:text-purple-500/30 text-base sm:text-lg h-12 sm:h-14 text-center focus-visible:ring-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && askOracle()}
                />
                <Button 
                  size="lg" 
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-105 active:scale-95"
                  onClick={askOracle}
                  disabled={!question.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" /> PYTAJ
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
                <div className="text-sm text-purple-300/50 uppercase tracking-widest font-mono">
                  Chaos przemówił:
                </div>
                <div ref={resultRef} className="space-y-3">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg">
                    &quot;{answer}&quot;
                  </p>
                  <ResultActions
                    moduleKey={moduleKey}
                    text={answer ? `Q: ${question.trim()}\nA: ${answer}` : ''}
                    shareTitle="Wyrocznia Chaosu"
                    exportRef={resultRef}
                    exportFileBase="wyrocznia"
                  />
                </div>

                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                  onClick={reset}
                >
                  <RotateCcw className="mr-2 w-4 h-4" /> Zadaj inne głupie pytanie
                </Button>

                {history.length > 0 ? (
                  <div className="w-full rounded-xl border border-purple-500/20 bg-black/30 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-purple-200/60">
                      <History className="h-4 w-4" /> Ostatnie przepowiednie
                    </div>
                    <div className="grid gap-2">
                      {history.slice(0, 5).map((h) => (
                        <button
                          key={h}
                          className="text-left text-xs sm:text-sm rounded-lg border border-purple-500/20 bg-black/40 hover:bg-black/60 px-3 py-2 transition-colors text-purple-100/90"
                          onClick={() => {
                            setAnswer(h.split('\nA: ')[1] ?? h);
                          }}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </main>
  );
}
