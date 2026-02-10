import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-[100svh] bg-background">
      <div className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">CHAOS OS</h1>
          <p className="text-muted-foreground text-lg">
            Projekt pokazowy: zestaw mikro-aplikacji z humorem, dopieszczonym UI i opcjami share.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Co tu jest?</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Kreator wymówek z lektorem (speechSynthesis)</li>
            <li>Generator pasków TV z eksportem PNG/JPG</li>
            <li>Wyrocznia chaosu + historia, ulubione i udostępnianie</li>
            <li>Soundboard z playlistami i skrótami klawiszowymi</li>
            <li>Pierdolator 3000 (Matrix vibes)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Tech</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Next.js (App Router)</li>
            <li>TypeScript</li>
            <li>Tailwind + shadcn/ui</li>
            <li>Playwright (smoke e2e)</li>
            <li>PWA (manifest + service worker)</li>
          </ul>
        </section>

        <div className="pt-4">
          <Link href="/" className="underline text-primary">
            Wróć do systemu
          </Link>
        </div>
      </div>
    </main>
  );
}
