'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CHAOS_CATEGORY_ORDER, getModulesByCategory } from '@/lib/modules';
import { AlertTriangle, Search, ShieldAlert, Zap } from 'lucide-react';

export default function Home() {
  const [q, setQ] = useState('');

  const groups = useMemo(() => getModulesByCategory(), []);
  const query = q.trim().toLowerCase();

  const filteredByCategory = useMemo(() => {
    const out = new Map<string, ReturnType<typeof groups.get>>();

    for (const cat of CHAOS_CATEGORY_ORDER) {
      const mods = groups.get(cat) || [];
      const filtered = !query
        ? mods
        : mods.filter((m) => {
            const hay = `${m.title} ${m.desc} ${m.id}`.toLowerCase();
            return hay.includes(query);
          });
      out.set(cat, filtered);
    }

    return out;
  }, [groups, query]);

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
              Centralny system zarządzania absurdem. Kreatory, generatory i memy w jednym miejscu.
            </p>

            <div className="max-w-xl mx-auto pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Szukaj modułu… (np. memy, paski, wymówki)"
                  className="pl-9 h-11 bg-card/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </header>

          <div className="space-y-10">
            {CHAOS_CATEGORY_ORDER.map((cat) => {
              const mods = filteredByCategory.get(cat) || [];
              if (!mods || mods.length === 0) return null;

              return (
                <section key={cat} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">{cat}</h2>
                    {cat === 'NSFW' ? (
                      <div className="flex items-center gap-2 text-xs text-destructive/80">
                        <ShieldAlert className="h-4 w-4" /> wulgaryzmy • ostatni na liście
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {mods.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <Link key={mod.id} href={mod.path} className="group block">
                          <Card
                            className={cn(
                              'h-full transition-all duration-300 transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]',
                              mod.colorClass
                            )}
                          >
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                              <div className="p-3 rounded-xl bg-background/50 border border-border group-hover:scale-110 transition-transform">
                                <Icon className={cn('w-8 h-8', mod.iconClass)} />
                              </div>
                              <div className="space-y-1 text-left">
                                <CardTitle className="text-xl sm:text-2xl group-hover:text-primary transition-colors">
                                  {mod.title}
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                  {mod.desc}
                                </CardDescription>
                              </div>
                            </CardHeader>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <footer className="text-center space-y-4 pt-8">
            <div className="flex justify-center gap-4">
              <Button
                variant="ghost"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={() => alert('Już masz za dużo RAM-u w głowie.')}
              >
                <AlertTriangle className="w-3 h-3 mr-2" />
                Zainstaluj więcej RAM-u
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/30 font-mono">System v6.6.6 • Chaos Inc.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
