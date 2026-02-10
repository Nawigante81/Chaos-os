'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Home } from 'lucide-react';

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="w-full sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {!isHome ? (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Powrót</span>
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <Home className="h-4 w-4" />
              <span className="truncate">CHAOS OS</span>
            </div>
          )}
          {title ? (
            <div className="hidden sm:block text-sm text-foreground/80 truncate">/ {title}</div>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
