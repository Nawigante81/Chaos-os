import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { CHAOS_CATEGORY_ORDER, getModulesByCategory } from '@/lib/modules';

export default function AboutPage() {
  const groups = getModulesByCategory();

  return (
    <main className="min-h-[100svh] bg-background">
      <AppHeader title="About" />

      <div className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">CHAOS OS</h1>
          <p className="text-muted-foreground text-lg">
            Zestaw mikro-aplikacji: kreatory, generatory, memy i symulatory. Każdy moduł to
            osobna strona, wspólny design i opcje share/export.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Moduły</h2>
          <div className="space-y-5">
            {CHAOS_CATEGORY_ORDER.map((cat) => {
              const mods = groups.get(cat) || [];
              if (mods.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <h3 className="text-lg font-bold">{cat}</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    {mods.map((m) => (
                      <li key={m.id}>
                        <Link href={m.path} className="underline text-primary">
                          {m.title}
                        </Link>{' '}
                        — {m.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
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
