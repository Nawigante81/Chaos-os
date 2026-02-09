'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { BadgeDollarSign, CarFront, UserPlus, FileWarning, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game constants
const PASSAT_COST = 10000;
const EMPLOYEE_COST = 100;
const EMPLOYEE_RATE = 1; // PLN per second per employee
const SCAM_COST = 500;
const SCAM_BOOST = 5; // PLN per second boost

export default function JanuszPage() {
  const [money, setMoney] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [scamLevel, setScamLevel] = useState(0);
  const [zusAlert, setZusAlert] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Auto-income loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameWon) return;
      
      const income = (employees * EMPLOYEE_RATE) + (scamLevel * SCAM_BOOST);
      if (income > 0) {
        setMoney(prev => prev + income);
      }

      // ZUS random event (1% chance per tick if you have income)
      if (income > 10 && Math.random() < 0.01) {
        triggerZusRaid();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [employees, scamLevel, gameWon]);

  const triggerZusRaid = () => {
    setZusAlert(true);
    toast.error('KONTROLA Z ZUS-U!', {
      description: 'Zabrali Ci połowę hajsu na składki. Złodzieje!',
    });
    setMoney(prev => Math.floor(prev / 2));
    setTimeout(() => setZusAlert(false), 3000);
  };

  const clickParowka = () => {
    setMoney(prev => prev + 10);
    // Visual feedback could go here
  };

  const hireEmployee = () => {
    if (money >= EMPLOYEE_COST) {
      setMoney(prev => prev - EMPLOYEE_COST);
      setEmployees(prev => prev + 1);
      toast.success('Zatrudniono pracownika', {
        description: 'Oczywiście na czarno. +1 PLN/s',
      });
    }
  };

  const upgradeScam = () => {
    if (money >= SCAM_COST) {
      setMoney(prev => prev - SCAM_COST);
      setScamLevel(prev => prev + 1);
      toast.warning('Przekręcono licznik', {
        description: 'Passat młodszy o 10 lat. +5 PLN/s',
      });
    }
  };

  const buyPassat = () => {
    if (money >= PASSAT_COST) {
      setGameWon(true);
      toast.success('KUPIŁEŚ PASSATA!', {
        description: 'Król wsi. TDI. 1.9. Ideał.',
      });
    }
  };

  const incomeRate = (employees * EMPLOYEE_RATE) + (scamLevel * SCAM_BOOST);

  if (gameWon) {
    return (
      <main className="min-h-[100svh] bg-gradient-to-br from-yellow-400 to-yellow-600 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6 text-center">
        <CarFront className="w-24 h-24 sm:w-32 sm:h-32 text-black mb-6 sm:mb-8 animate-bounce" />
        <h1 className="text-4xl sm:text-6xl font-black text-black mb-4">Wygrałeś Życie!</h1>
        <p className="text-lg sm:text-2xl text-black font-bold mb-6 sm:mb-8">Masz Passata B5 w TDI.</p>
        <p className="text-base sm:text-xl text-black/80">Sąsiedzi już pękają z zazdrości.</p>
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={() => window.location.reload()}
          className="mt-8 text-lg sm:text-xl font-bold border-4 border-black"
        >
          Zagraj jeszcze raz (dla Audi A4)
        </Button>
      </main>
    )
  }

  return (
    <main className={cn(
      "min-h-[100svh] bg-slate-900 text-slate-100 flex flex-col items-center p-4 xs:p-5 sm:p-6 relative overflow-hidden transition-colors duration-500",
      zusAlert && "bg-red-900 animate-pulse"
    )}>
      {/* HUD */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 z-10">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Twój Majątek</h3>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-black text-green-400 font-mono">
              {Math.floor(money).toLocaleString()} PLN
            </div>
            <div className="text-xs text-green-500/80 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{incomeRate}/s
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Kadra (Na Czarno)</h3>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">
              {employees} <span className="text-base text-slate-500">osób</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Cel: Passat B5</h3>
          </CardHeader>
          <CardContent>
            <Progress value={(money / PASSAT_COST) * 100} className="h-4 bg-slate-950" />
            <div className="text-xs text-right mt-1 text-slate-500">
              {Math.floor((money / PASSAT_COST) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Area */}
      <div className="z-10 flex flex-col items-center gap-8 mb-12">
        <Button 
          size="lg" 
          className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black border-4 border-yellow-600 shadow-[0_0_50px_rgba(255,215,0,0.3)] transition-all active:scale-95"
          onClick={clickParowka}
        >
          <div className="flex flex-col items-center gap-1">
            <BadgeDollarSign className="w-8 h-8" />
            <span className="font-bold text-xs uppercase leading-tight">Sprzedaj<br/>Parówkę</span>
          </div>
        </Button>
        <p className="text-sm text-slate-400 animate-bounce">Klikaj by zarabiać!</p>
      </div>

      {/* Upgrades Shop */}
      <div className="z-10 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-start gap-2 bg-slate-800/50 hover:bg-slate-800 border-slate-700 hover:border-blue-500 transition-all disabled:opacity-30 disabled:hover:border-slate-700"
          onClick={hireEmployee}
          disabled={money < EMPLOYEE_COST}
        >
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2 font-bold text-blue-400">
              <UserPlus className="w-5 h-5" /> Zatrudnij Studenta
            </div>
            <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-400">
              {EMPLOYEE_COST} PLN
            </span>
          </div>
          <p className="text-xs text-left text-slate-400">
            Daje +{EMPLOYEE_RATE} PLN/s. Umowa o dzieło? A co to?
          </p>
        </Button>

        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-start gap-2 bg-slate-800/50 hover:bg-slate-800 border-slate-700 hover:border-purple-500 transition-all disabled:opacity-30 disabled:hover:border-slate-700"
          onClick={upgradeScam}
          disabled={money < SCAM_COST}
        >
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <FileWarning className="w-5 h-5" /> Kręć Licznik
            </div>
            <span className="text-xs bg-slate-950 px-2 py-1 rounded text-slate-400">
              {SCAM_COST} PLN
            </span>
          </div>
          <p className="text-xs text-left text-slate-400">
            Daje +{SCAM_BOOST} PLN/s. Niemiec płakał jak sprzedawał.
          </p>
        </Button>
      </div>

      {/* The Goal */}
      <div className="z-10 mt-12 w-full max-w-2xl">
        <Button 
          className="w-full h-20 text-xl font-black uppercase tracking-widest bg-green-600 hover:bg-green-500 disabled:bg-slate-800 disabled:text-slate-600 transition-all shadow-xl disabled:shadow-none"
          onClick={buyPassat}
          disabled={money < PASSAT_COST}
        >
          <CarFront className="w-8 h-8 mr-4" /> 
          {money >= PASSAT_COST ? "KUP PASSATA TERAZ!" : `Zbieraj na Passata (${PASSAT_COST} PLN)`}
        </Button>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 flex items-center justify-center">
        <span className="text-[12rem] sm:text-[20rem] font-black rotate-12 select-none">ZUS</span>
      </div>
    </main>
  );
}
