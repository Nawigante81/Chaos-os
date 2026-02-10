'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Share2, Star, StarOff, ImageDown } from 'lucide-react';
import { track } from '@/components/analytics';
import { isFavorited, toggleFavorite } from '@/lib/local-history';
import { toPng } from 'html-to-image';

type ResultActionsProps = {
  moduleKey: string;
  text: string;
  shareTitle?: string;
  shareUrl?: string;
  exportRef?: React.RefObject<HTMLElement | null>;
  exportFileBase?: string;
};

export function ResultActions({
  moduleKey,
  text,
  shareTitle,
  shareUrl,
  exportRef,
  exportFileBase = 'chaos-os',
}: ResultActionsProps) {
  const trimmed = (text || '').trim();
  const favKey = useMemo(() => `chaos:fav:${moduleKey}`, [moduleKey]);

  const fav = trimmed ? isFavorited(favKey, trimmed) : false;

  const handleCopy = async () => {
    if (!trimmed) return;
    await navigator.clipboard.writeText(trimmed);
    track('copy', { module: moduleKey });
    toast.success('Skopiowano', {
      description: 'Teraz wklej i udawaj, że to było spontaniczne.',
    });
  };

  const handleShare = async () => {
    if (!trimmed) return;

    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : undefined);
    const payload: ShareData = {
      title: shareTitle || 'CHAOS OS',
      text: trimmed,
      url,
    };

    try {
      if ('share' in navigator) {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share(payload);
        track('share', { module: moduleKey, method: 'native' });
        return;
      }
    } catch {
      // fallthrough
    }

    const composed = url ? `${trimmed}\n\n${url}` : trimmed;
    await navigator.clipboard.writeText(composed);
    track('share', { module: moduleKey, method: 'clipboard' });
    toast('Brak natywnego share', { description: 'Skopiowałem do schowka (tekst + link).' });
  };

  const handleToggleFav = () => {
    if (!trimmed) return;
    const next = toggleFavorite(favKey, trimmed);
    track('favorite_toggle', { module: moduleKey, on: next });
    toast(next ? 'Zapisane w ulubionych' : 'Usunięte z ulubionych');
  };

  const handleExport = async () => {
    if (!exportRef?.current) return;
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${exportFileBase}.png`;
      a.click();
      track('export_png', { module: moduleKey });
      toast.success('Pobrano PNG');
    } catch {
      toast.error('Nie udało się wyeksportować PNG');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={!trimmed}
        className="gap-2"
      >
        <Copy className="h-4 w-4" /> Kopiuj
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={!trimmed}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" /> Udostępnij
      </Button>
      <Button
        variant={fav ? 'secondary' : 'outline'}
        size="sm"
        onClick={handleToggleFav}
        disabled={!trimmed}
        className="gap-2"
      >
        {fav ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
        {fav ? 'W ulubionych' : 'Dodaj do ulubionych'}
      </Button>
      {exportRef ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!trimmed}
          className="gap-2"
        >
          <ImageDown className="h-4 w-4" /> PNG
        </Button>
      ) : null}
    </div>
  );
}
