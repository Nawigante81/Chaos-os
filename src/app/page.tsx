'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import {
  AlertTriangle,
  Pizza,
  Briefcase,
  Zap,
  BrainCircuit,
  Globe,
  Tv,
  TrendingUp,
  Calculator,
  Mic,
  Skull,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  const modules = [
    {
      id: 'wymowki',
      title: 'Kreator Wymówek 5000',
      desc: 'Profesjonalne alibi dla spóźnialskich. Z opcją smutnego lektora.',
      icon: <Briefcase className="w-8 h-8 text-blue-400" />,
      color: 'border-blue-500/30 hover:border-blue-500',
      path: '/wymowki'
    },
    {
      id: 'gastro',
      title: 'GastroMatch',
      desc: 'Tinder dla jedzenia. Przesuń pizzę w prawo, a kebaba w lewo.',
      icon: <Pizza className="w-8 h-8 text-orange-400" />,
      color: 'border-orange-500/30 hover:border-orange-500',
      path: '/gastro'
    },
    {
      id: 'janusz',
      title: 'Symulator Janusza Biznesu',
      desc: 'Zatrudniaj na czarno, unikaj ZUS-u, kup Passata w TDI.',
      icon: <Briefcase className="w-8 h-8 text-yellow-400" />,
      color: 'border-yellow-500/30 hover:border-yellow-500',
      path: '/janusz'
    },
    {
      id: 'wyrocznia',
      title: 'Wyrocznia Chaosu',
      desc: 'Zadaj pytanie, a Chaos powie Ci brutalną prawdę o życiu.',
      icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
      color: 'border-purple-500/30 hover:border-purple-500',
      path: '/wyrocznia'
    },
    {
      id: 'sennik',
      title: 'Sennik Chaosu',
      desc: 'Freudowska analiza Twoich koszmarów (z nutką pogardy).',
      icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
      color: 'border-indigo-500/30 hover:border-indigo-500',
      path: '/sennik'
    },
    {
      id: 'paski',
      title: 'Generator Pasków TVP',
      desc: 'Twórz własną propagandę. Paski grozy w 3 sekundy.',
      icon: <Tv className="w-8 h-8 text-red-500" />,
      color: 'border-red-500/30 hover:border-red-500',
      path: '/paski'
    },
    {
      id: 'podwyzka',
      title: 'Symulator Podwyżki',
      desc: 'Gra RPG: Pokonaj Szefa Janusza i zdobądź 50zł brutto.',
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      color: 'border-green-500/30 hover:border-green-500',
      path: '/podwyzka'
    },
    {
      id: 'kalkulator',
      title: 'Kalkulator Zgonu',
      desc: 'Sprawdź ile Ci zostało (spoiler: niewiele).',
      icon: <Calculator className="w-8 h-8 text-slate-400" />,
      color: 'border-slate-500/30 hover:border-slate-500',
      path: '/kalkulator'
    },
    {
      id: 'soundboard',
      title: 'Korpo Soundboard',
      desc: 'Niezbędnik na calle: ASAP, Deadline, Fakap.',
      icon: <Mic className="w-8 h-8 text-blue-400" />,
      color: 'border-blue-500/30 hover:border-blue-500',
      path: '/soundboard'
    },
    {
      id: 'pierdolator',
      title: 'PIERDOLATOR 3000',
      desc: 'Generator obelg w stylu Matrixa. Zniszcz komuś dzień.',
      icon: <Skull className="w-8 h-8 text-red-600 animate-pulse" />,
      color: 'border-red-600 hover:border-red-500 bg-red-950/20',
      path: '/pierdolator'
    }
  ];

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader />
      <div className="flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-5xl space-y-8 sm:space-y-12 animate-in fade-in zoom-in duration-500">
        <header className="text-center space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4 border border-primary/20 animate-pulse">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-primary">
            CHAOS <span className="text-foreground">OS</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto">
            Centralny system zarządzania absurdem. Wybierz moduł, by rozpocząć symulację życia.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {modules.map((mod) => (
            <Link key={mod.id} href={mod.path} className="group block">
              <Card className={`h-full transition-all duration-300 transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 ${mod.color} hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]`}>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-3 rounded-xl bg-background/50 border border-border group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>
                  <div className="space-y-1 text-left">
                    <CardTitle className="text-xl sm:text-2xl group-hover:text-primary transition-colors">{mod.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{mod.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <footer className="text-center space-y-4 pt-8">
          <div className="flex justify-center gap-4">
             <Button variant="ghost" className="text-xs text-muted-foreground hover:text-destructive" onClick={() => alert('Już masz za dużo RAM-u w głowie.')}>
               <AlertTriangle className="w-3 h-3 mr-2" />
               Zainstaluj więcej RAM-u
             </Button>
          </div>
          <p className="text-xs text-muted-foreground/30 font-mono">
            System v6.6.6 • Chaos Inc.
          </p>
        </footer>
      </div>
      </div>
    </main>
  );
}
