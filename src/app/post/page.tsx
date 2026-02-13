'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { ResultActions } from '@/components/result-actions';
import { MemeFrame } from '@/components/meme-frame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { loadHistory, saveToHistory } from '@/lib/local-history';
import { initials, safeInt } from '@/lib/meme-helpers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { History, Link2, MessageSquare, Upload } from 'lucide-react';

export default function PostPage() {
  const moduleKey = 'post';
  const historyKey = useMemo(() => `chaos:history:${moduleKey}`, []);

  const frameRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [name, setName] = useState('PANU');
  const [handle, setHandle] = useState('panu');
  const [content, setContent] = useState('Dzisiaj w CHAOS OS dodałem 12 generatorów. Nic się nie spaliło. Jeszcze.');
  const [verified, setVerified] = useState(false);
  const [timeText, setTimeText] = useState('23:22 · 13 lut 2026');
  const [replies, setReplies] = useState('12');
  const [reposts, setReposts] = useState('34');
  const [likes, setLikes] = useState('666');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFileName, setAvatarFileName] = useState('');

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(historyKey, 10).map((x) => x.text)
  );

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const remember = (t: string) => {
    saveToHistory(historyKey, t, 50);
    setHistory(loadHistory(historyKey, 10).map((x) => x.text));
  };

  const setAvatarFile = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setAvatarUrl(url);
    setAvatarFileName(file.name);
  };

  const setAvatarFromUrl = () => {
    if (!avatarUrl.trim()) {
      toast.error('Wklej URL avatara');
      return;
    }
    setAvatarFileName(avatarUrl.trim());
  };

  const clearAvatar = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setAvatarUrl('');
    setAvatarFileName('');
  };

  const shareText = `${content}`.trim();

  const repliesN = safeInt(replies, 0);
  const repostsN = safeInt(reposts, 0);
  const likesN = safeInt(likes, 0);

  return (
    <main className="min-h-[100svh] bg-background relative overflow-hidden">
      <AppHeader title="Post" />

      <div className="relative flex flex-col items-center justify-center p-4 xs:p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1b22_0%,transparent_55%)] opacity-60"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-8">
          <header className="text-center space-y-3">
            <MessageSquare className="w-12 h-12 mx-auto text-sky-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">Generator posta</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Parodia mikrobloga: nazwij to jak chcesz, byle było śmiesznie.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-3 sm:p-4">
                <div ref={frameRef} className="p-6">
                  <div className="mx-auto max-w-[860px]">
                    <MemeFrame aspect="16 / 9" className="bg-[#0b0f16] border-white/10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#17324d_0%,transparent_55%)] opacity-70" />
                      <div className="absolute inset-0 p-8 sm:p-10 flex">
                        <div className="w-full rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 sm:p-7">
                          <div className="flex gap-4">
                            <div className="shrink-0">
                              {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={avatarUrl}
                                  alt="avatar"
                                  className="h-14 w-14 rounded-full object-cover border border-white/10"
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-white font-black">
                                  {initials(name)}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="font-bold text-white truncate">{(name || '').trim() || 'KTOŚ'}</div>
                                {verified ? (
                                  <div className="h-4 w-4 rounded-full bg-sky-400 text-black text-[10px] font-black grid place-items-center">
                                    ✓
                                  </div>
                                ) : null}
                                <div className="text-white/50 truncate">@{(handle || '').trim() || 'handle'}</div>
                              </div>

                              <div className="mt-3 text-white text-lg sm:text-xl leading-snug whitespace-pre-wrap break-words">
                                {(content || '').trim() || '...' }
                              </div>

                              <div className="mt-4 text-xs text-white/45 font-mono">{(timeText || '').trim()}</div>

                              <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-white/70">
                                <div>
                                  <span className="font-bold text-white">{repliesN}</span> odpowiedzi
                                </div>
                                <div>
                                  <span className="font-bold text-white">{repostsN}</span> reposty
                                </div>
                                <div>
                                  <span className="font-bold text-white">{likesN}</span> serduszka
                                </div>
                              </div>

                              <div className="mt-4 text-[10px] text-white/25">
                                To nie jest prawdziwy serwis. To jest generator memów.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </MemeFrame>
                  </div>
                </div>

                <div className="pt-4">
                  <ResultActions
                    moduleKey={moduleKey}
                    text={shareText}
                    shareTitle="Generator posta — CHAOS OS"
                    exportRef={frameRef}
                    exportFileBase="post"
                  />
                </div>
              </div>

              {history.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" /> Ostatnie treści
                  </div>
                  <div className="grid gap-2">
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        className="text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-background/40 hover:bg-background/60 px-3 py-2 transition-colors"
                        onClick={() => setContent(h)}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border/60">
              <CardContent className="p-5 sm:p-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Nazwa
                    </label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Handle
                    </label>
                    <Input value={handle} onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))} className="h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Treść
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={cn(
                      'min-h-[140px] w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                    )}
                    placeholder="Napisz posta…"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Data/czas
                    </label>
                    <Input value={timeText} onChange={(e) => setTimeText(e.target.value)} className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Weryfikacja
                    </label>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                      <div className="text-sm">
                        <div className="font-semibold">Znaczek ✓</div>
                        <div className="text-xs text-muted-foreground">Dla beki.</div>
                      </div>
                      <Switch checked={verified} onCheckedChange={setVerified} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Odp.
                    </label>
                    <Input value={replies} onChange={(e) => setReplies(e.target.value)} className="h-11 font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Reposty
                    </label>
                    <Input value={reposts} onChange={(e) => setReposts(e.target.value)} className="h-11 font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Lajki
                    </label>
                    <Input value={likes} onChange={(e) => setLikes(e.target.value)} className="h-11 font-mono" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Avatar
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="URL avatara (opcjonalnie)"
                      />
                      <Button type="button" variant="outline" onClick={setAvatarFromUrl} className="gap-2">
                        <Link2 className="h-4 w-4" /> Ustaw
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-background/60">
                        <Upload className="h-4 w-4" /> Wgraj
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) setAvatarFile(file);
                          }}
                        />
                      </label>
                      <Button type="button" variant="ghost" onClick={clearAvatar}>
                        Usuń
                      </Button>
                      {avatarFileName ? (
                        <span className="text-xs text-muted-foreground truncate max-w-[260px]">
                          Aktywne: {avatarFileName}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const payload = (content || '').trim();
                      if (!payload) {
                        toast.error('Najpierw wpisz treść');
                        return;
                      }
                      remember(payload);
                      toast.success('Zapisane w historii');
                    }}
                    className="flex-1"
                  >
                    Zapisz treść
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setContent('')}>
                    Wyczyść
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
