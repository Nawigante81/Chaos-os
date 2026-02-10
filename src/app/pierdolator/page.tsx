'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { insults, questions } from '@/lib/pierdolator-insults';
import { getSafeAnimatedText } from '@/lib/text-animation';
import { cn } from '@/lib/utils';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { loadHistory, saveToHistory } from '@/lib/local-history';
import { History } from 'lucide-react';

export default function PierdolatorPage() {
  const moduleKey = 'pierdolator';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);
  const resultRef = useRef<HTMLDivElement>(null);

  const [currentInsult, setCurrentInsult] = useState<string>('');
  const [displayedInsult, setDisplayedInsult] = useState<string>('');
  const [insultLevel, setInsultLevel] = useState<number>(1);
  const [isInsulting, setIsInsulting] = useState<boolean>(false);
  const [matrixColumns, setMatrixColumns] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  useEffect(() => {
    // Matrix rain setup
    const columns = [];
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const colCount = Math.floor(width / 20);

    for (let i = 0; i < colCount; i++) {
      columns.push({
        id: i,
        x: (i / colCount) * 100,
        delay: Math.random() * 10,
      });
    }
    setMatrixColumns(columns);
  }, []);

  useEffect(() => {
    if (!currentInsult) return;
    
    // Trigger shake
    setShake(true);
    const shakeTimeout = setTimeout(() => setShake(false), 500);

    // Trigger flash if level is high
    let flashTimeout: NodeJS.Timeout;
    if (insultLevel >= 3) {
      setFlash(true);
      flashTimeout = setTimeout(() => setFlash(false), 150);
    }

    let currentIndex = 0;
    setDisplayedInsult('');
    
    // Speed increases with level
    const speed = Math.max(5, 30 - (insultLevel * 5));

    const interval = setInterval(() => {
      if (currentIndex < currentInsult.length) {
        const newText = getSafeAnimatedText(currentInsult, currentIndex);
        setDisplayedInsult(newText);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => {
      clearInterval(interval);
      clearTimeout(shakeTimeout);
      if (flashTimeout) clearTimeout(flashTimeout);
    };
  }, [currentInsult, insultLevel]);

  const getRandomInsult = (level: number) => {
    let pool: string[] = [];
    
    if (level === 1) pool = insults.soft;
    else if (level === 2) pool = insults.medium;
    else if (level === 3) pool = insults.hard;
    else pool = insults.extreme;

    if (!pool || pool.length === 0) pool = insults.soft;

    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleStart = () => {
    setIsInsulting(true);
    setInsultLevel(1);
    const insult = getRandomInsult(1);
    setCurrentInsult(insult);
    saveToHistory(historyKey, insult, 30);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const handleMoreInsults = () => {
    const newLevel = Math.min(insultLevel + 1, 4);
    setInsultLevel(newLevel);
    const insult = getRandomInsult(newLevel);
    setCurrentInsult(insult);
    saveToHistory(historyKey, insult, 30);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const resetApp = () => {
    setIsInsulting(false);
    setCurrentInsult('');
    setDisplayedInsult('');
    setInsultLevel(1);
  };

  return (
    <div className="relative min-h-[100svh] flex flex-col font-mono bg-black text-white overflow-hidden">
      <div className="relative z-30">
        <AppHeader title="Pierdolator" />
      </div>
      
      {/* Matrix Background */}
      <div className="matrix-bg fixed inset-0 z-0 opacity-20 pointer-events-none">
        {matrixColumns.map((column) => (
          <div
            key={column.id}
            className="matrix-column"
            style={{
              left: `${column.x}%`,
              animationDelay: `${column.delay}s`,
              color: insultLevel === 4 ? '#ff0000' : undefined 
            }}
          >
            {Array.from({ length: 40 }, () => 
              String.fromCharCode(0x30A0 + Math.random() * 96)
            ).join('\n')}
          </div>
        ))}
      </div>

      <div className="crt-overlay pointer-events-none fixed inset-0 z-40"></div>
      
      {/* Flash Effect */}
      {flash && (
        <div className="fixed inset-0 z-50 animate-flash pointer-events-none bg-white mix-blend-overlay"></div>
      )}

      <main 
        className={cn(
          "relative z-10 flex flex-col items-center justify-center flex-grow p-4 xs:p-5 sm:p-6 w-full max-w-6xl mx-auto transition-transform",
          shake && "animate-shake"
        )}
      >
        {!isInsulting ? (
          <div className="w-full space-y-10 sm:space-y-12 text-center animate-in zoom-in duration-500">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase glitch-text" data-text="PIERDOLATOR 3000">
              <span className="neon-text block">PIERDOLATOR 3000</span>
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {questions.slice(0, 6).map((question, index) => ( // Show first 6 questions
                <button
                  key={index}
                  onClick={handleStart}
                  className={cn(
                    "group relative overflow-hidden p-4 xs:p-5 sm:p-6 text-lg sm:text-xl font-bold border-2 rounded-none transition-all duration-200 transform",
                    "bg-transparent text-white border-red-600 hover:bg-red-600 hover:text-black",
                    "hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] hover:scale-105 active:scale-95"
                  )}
                >
                  <span className="relative z-10">{question}</span>
                </button>
              ))}
            </div>

            <div className="mt-12 animate-pulse">
              <p className="text-red-500 text-xs font-mono uppercase tracking-widest">
                &gt; OSTRZEŻENIE: TREŚCI WULGARNE. &lt;
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Insult Display */}
            <div
              ref={resultRef}
              className={cn(
                "min-h-[220px] sm:min-h-[300px] flex items-center justify-center p-4 sm:p-8 border-4 border-double bg-black/90 backdrop-blur-md shadow-2xl relative",
                "transition-all duration-300 transform hover:scale-[1.02]",
                insultLevel >= 3 ? "border-red-600" : "border-blue-500"
              )}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-current animate-pulse"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-current animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-current animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-current animate-pulse"></div>

              <p 
                className={cn(
                  "text-2xl sm:text-3xl md:text-6xl font-bold leading-tight font-mono uppercase transition-all duration-300 px-2",
                  insultLevel === 1 && "text-white",
                  insultLevel === 2 && "text-yellow-400",
                  insultLevel === 3 && "text-orange-500",
                  insultLevel === 4 && "text-red-600 glitch-text"
                )}
                data-text={displayedInsult}
                style={{
                  textShadow: insultLevel >= 3 ? '0 0 20px currentColor' : 'none'
                }}
              >
                {displayedInsult}
                <span className="animate-pulse bg-current w-[0.5em] h-[1em] inline-block align-middle ml-1"></span>
              </p>
            </div>

            <ResultActions
              moduleKey={moduleKey}
              text={currentInsult}
              shareTitle="PIERDOLATOR 3000"
              exportRef={resultRef}
              exportFileBase="pierdolator"
            />

            {history.length > 0 ? (
              <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <History className="h-4 w-4" /> Ostatnie obelgi
                </div>
                <div className="grid gap-2">
                  {history.slice(0, 5).map((h) => (
                    <button
                      key={h}
                      className="text-left text-xs sm:text-sm rounded-lg border border-white/10 bg-black/60 hover:bg-black/80 px-3 py-2 transition-colors"
                      onClick={() => {
                        setIsInsulting(true);
                        setCurrentInsult(h);
                      }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
              <button
                onClick={handleMoreInsults}
                className={cn(
                  "px-6 sm:px-10 py-4 sm:py-6 text-lg sm:text-2xl font-black uppercase tracking-widest border-4 transition-all duration-200 transform hover:scale-105 active:scale-95 outline-none",
                  "bg-red-600 text-black border-red-600 hover:bg-red-500 hover:border-red-500 hover:text-white",
                  "shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,0,0,0.8)]"
                )}
              >
                {insultLevel < 4 ? "DOJEB MU BARDZIEJ!" : "ZNISZCZ GO KURWA!!!"}
              </button>
              
              <button
                onClick={resetApp}
                className="px-6 sm:px-10 py-4 sm:py-6 text-lg sm:text-2xl font-black uppercase tracking-widest border-4 bg-transparent text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-black transition-all hover:scale-105 active:scale-95"
              >
                SPIERDALAM
              </button>
            </div>

            {/* Level Indicator */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-mono text-gray-500 uppercase tracking-[0.3em] sm:tracking-[0.5em]">POZIOM WKURWIENIA</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((lvl) => (
                  <div 
                    key={lvl}
                    className={cn(
                      "w-8 sm:w-12 h-4 skew-x-12 border border-current transition-all duration-300 transform",
                      lvl <= insultLevel 
                        ? (insultLevel >= 3 ? "bg-red-600 shadow-[0_0_10px_red]" : "bg-blue-500 shadow-[0_0_10px_currentColor]") 
                        : "bg-transparent opacity-20"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
