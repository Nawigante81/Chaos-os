'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Eye, Zap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const interpretations = [
  "To oznacza, że masz kompleks małego korniszona i boisz się słoików.",
  "Ewidentnie brakuje ci seksu, albo przynajmniej dobrej pizzy.",
  "Twoja podświadomość błaga o litość. Przestań oglądać patostreamy.",
  "Ten sen zwiastuje nadchodzącą kontrolę skarbową. Uciekaj.",
  "Symbol ten oznacza, że powinieneś rzucić wszystko i wyjechać w Bieszczady.",
  "Twoja matka miała rację – nic z ciebie nie będzie.",
  "To projekcja twojego strachu przed byciem przeciętnym (już jesteś).",
  "Oznacza to, że w poprzednim wcieleniu byłeś dżdżownicą.",
  "Twoje libido jest w stanie krytycznym. Zalecana terapia wstrząsowa.",
  "Sen ten sugeruje, że masz ukryty talent do marnowania czasu.",
  "To proste: twoja dusza pragnie kebaba na cienkim.",
  "Masz nieprzepracowaną traumę z dzieciństwa związaną z brokułami."
];

export default function SennikPage() {
  const [dream, setDream] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const interpretDream = () => {
    if (!dream.trim()) return;

    setLoading(true);
    setResult(null);

    // Fake thinking time
    setTimeout(() => {
      const randomInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];
      setResult(randomInterpretation);
      setLoading(false);
      toast.success('Sen zinterpretowany', { description: 'Prawda bywa bolesna.' });
    }, 2000);
  };

  return (
    <main className="min-h-[100svh] bg-indigo-950 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black opacity-90 pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-100 blur-[80px] opacity-20 animate-pulse pointer-events-none"></div>

      <div className="z-10 w-full max-w-lg space-y-10 sm:space-y-12 animate-in fade-in duration-700">
        <header className="text-center space-y-4">
          <div className="relative inline-block">
            <Moon className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-300 drop-shadow-[0_0_20px_rgba(165,180,252,0.4)]" />
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-50" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 to-indigo-500 tracking-tighter uppercase">
            SENNIK CHAOSU
          </h1>
          <p className="text-indigo-300/60 font-serif italic text-base sm:text-lg">
            Poznaj mroczne sekrety swojej podświadomości.
          </p>
        </header>

        <Card className="bg-black/30 border-indigo-500/20 backdrop-blur-md shadow-2xl">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300/80 uppercase tracking-widest">
                Opisz swój koszmar:
              </label>
              <Input 
                placeholder="Np. gonił mnie wielki ogórek..." 
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                className="bg-indigo-950/50 border-indigo-500/30 text-indigo-100 placeholder:text-indigo-500/30 h-12 sm:h-14 text-base sm:text-lg focus-visible:ring-indigo-400"
                onKeyDown={(e) => e.key === 'Enter' && interpretDream()}
              />
            </div>

            <Button 
              onClick={interpretDream} 
              disabled={!dream.trim() || loading}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Eye className="w-5 h-5 animate-spin" /> Analizuję traumy...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Interpretuj
                </span>
              )}
            </Button>

            {result && (
              <div className="mt-8 pt-8 border-t border-indigo-500/20 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
                  <p className="text-lg sm:text-xl md:text-2xl font-serif text-indigo-100 leading-relaxed italic drop-shadow-md">
                    &quot;{result}&quot;
                  </p>
                  <p className="text-xs text-indigo-400/50 font-mono mt-4">
                    *Chaos nie jest licencjonowanym terapeutą.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
