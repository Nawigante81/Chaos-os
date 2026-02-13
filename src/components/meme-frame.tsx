'use client';

import { cn } from '@/lib/utils';

type MemeFrameProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Utrzymuje stałe proporcje dla podglądu (CSS aspect-ratio).
   * Przykład: "1 / 1" lub "4 / 5".
   */
  aspect?: string;
};

export function MemeFrame({ children, className, aspect = '1 / 1' }: MemeFrameProps) {
  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-border bg-black/30', className)}>
      <div className="w-full" style={{ aspectRatio: aspect }}>
        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  );
}
