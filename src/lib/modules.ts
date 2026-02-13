import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Pizza,
  BrainCircuit,
  Sparkles,
  Tv,
  TrendingUp,
  Calculator,
  Mic,
  Skull,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';

export type ChaosModuleCategory =
  | 'Tekst'
  | 'Grafika / memy'
  | 'Symulatory'
  | 'Audio'
  | 'NSFW';

export type ChaosModuleDef = {
  id: string;
  title: string;
  desc: string;
  path: `/${string}`;
  icon: LucideIcon;
  iconClass?: string;
  colorClass: string;
  category: ChaosModuleCategory;
  /** Sortowanie w obrębie kategorii (mniej = wyżej). */
  order: number;
  /** Moduł „na końcu listy” (np. wulgarny). */
  nsfw?: boolean;
};

export const CHAOS_MODULES: ChaosModuleDef[] = [
  {
    id: 'wymowki',
    title: 'Kreator Wymówek 5000',
    desc: 'Profesjonalne alibi dla spóźnialskich. Z opcją smutnego lektora.',
    icon: Briefcase,
    iconClass: 'text-blue-400',
    colorClass: 'border-blue-500/30 hover:border-blue-500',
    path: '/wymowki',
    category: 'Tekst',
    order: 10,
  },
  {
    id: 'wyrocznia',
    title: 'Wyrocznia Chaosu',
    desc: 'Zadaj pytanie, a Chaos powie Ci brutalną prawdę o życiu.',
    icon: BrainCircuit,
    iconClass: 'text-purple-400',
    colorClass: 'border-purple-500/30 hover:border-purple-500',
    path: '/wyrocznia',
    category: 'Tekst',
    order: 20,
  },
  {
    id: 'sennik',
    title: 'Sennik Chaosu',
    desc: 'Freudowska analiza Twoich koszmarów (z nutką pogardy).',
    icon: Sparkles,
    iconClass: 'text-indigo-400',
    colorClass: 'border-indigo-500/30 hover:border-indigo-500',
    path: '/sennik',
    category: 'Tekst',
    order: 30,
  },
  {
    id: 'memy',
    title: 'Kreator Meme (obraz + tekst)',
    desc: 'Wrzuć obraz i dopisz tekst jak człowiek internetu.',
    icon: ImageIcon,
    iconClass: 'text-fuchsia-400',
    colorClass: 'border-fuchsia-500/30 hover:border-fuchsia-500',
    path: '/memy',
    category: 'Grafika / memy',
    order: 10,
  },
  {
    id: 'demotywator',
    title: 'Demotywator',
    desc: 'Czarna ramka + zdjęcie + podpis. Klasyka internetu.',
    icon: ImageIcon,
    iconClass: 'text-neutral-200',
    colorClass: 'border-neutral-500/30 hover:border-neutral-400',
    path: '/demotywator',
    category: 'Grafika / memy',
    order: 15,
  },
  {
    id: 'drake',
    title: 'Meme 2-panel',
    desc: 'Dwa obrazki i dwa podpisy. Uniwersalny szablon.',
    icon: ImageIcon,
    iconClass: 'text-pink-400',
    colorClass: 'border-pink-500/30 hover:border-pink-500',
    path: '/drake',
    category: 'Grafika / memy',
    order: 18,
  },
  {
    id: 'post',
    title: 'Generator posta',
    desc: 'Parodia mikrobloga: avatar, treść, staty.',
    icon: Globe,
    iconClass: 'text-sky-400',
    colorClass: 'border-sky-500/30 hover:border-sky-500',
    path: '/post',
    category: 'Grafika / memy',
    order: 19,
  },
  {
    id: 'okladka',
    title: 'Okładka tabloidu',
    desc: 'Nagłówek + zdjęcie + masthead. Sensacja gwarantowana.',
    icon: Globe,
    iconClass: 'text-amber-400',
    colorClass: 'border-amber-500/30 hover:border-amber-500',
    path: '/okladka',
    category: 'Grafika / memy',
    order: 20,
  },
  {
    id: 'certyfikat',
    title: 'Certyfikat',
    desc: 'Wydrukuj zasługi, których nie było.',
    icon: Globe,
    iconClass: 'text-emerald-400',
    colorClass: 'border-emerald-500/30 hover:border-emerald-500',
    path: '/certyfikat',
    category: 'Grafika / memy',
    order: 22,
  },
  {
    id: 'chat',
    title: 'Screenshot czatu',
    desc: 'Generator rozmowy: JA/ON, dymki i export PNG.',
    icon: Globe,
    iconClass: 'text-violet-400',
    colorClass: 'border-violet-500/30 hover:border-violet-500',
    path: '/chat',
    category: 'Grafika / memy',
    order: 24,
  },
  {
    id: 'paski',
    title: 'Generator Pasków TVP',
    desc: 'Twórz własną propagandę. Paski grozy w 3 sekundy.',
    icon: Tv,
    iconClass: 'text-red-500',
    colorClass: 'border-red-500/30 hover:border-red-500',
    path: '/paski',
    category: 'Grafika / memy',
    order: 30,
  },
  {
    id: 'gastro',
    title: 'GastroMatch',
    desc: 'Tinder dla jedzenia. Przesuń pizzę w prawo, a kebaba w lewo.',
    icon: Pizza,
    iconClass: 'text-orange-400',
    colorClass: 'border-orange-500/30 hover:border-orange-500',
    path: '/gastro',
    category: 'Symulatory',
    order: 10,
  },
  {
    id: 'janusz',
    title: 'Symulator Janusza Biznesu',
    desc: 'Zatrudniaj na czarno, unikaj ZUS-u, kup Passata w TDI.',
    icon: Globe,
    iconClass: 'text-yellow-400',
    colorClass: 'border-yellow-500/30 hover:border-yellow-500',
    path: '/janusz',
    category: 'Symulatory',
    order: 20,
  },
  {
    id: 'podwyzka',
    title: 'Symulator Podwyżki',
    desc: 'Gra RPG: Pokonaj Szefa Janusza i zdobądź 50zł brutto.',
    icon: TrendingUp,
    iconClass: 'text-green-400',
    colorClass: 'border-green-500/30 hover:border-green-500',
    path: '/podwyzka',
    category: 'Symulatory',
    order: 30,
  },
  {
    id: 'kalkulator',
    title: 'Kalkulator Zgonu',
    desc: 'Sprawdź ile Ci zostało (spoiler: niewiele).',
    icon: Calculator,
    iconClass: 'text-slate-300',
    colorClass: 'border-slate-500/30 hover:border-slate-500',
    path: '/kalkulator',
    category: 'Symulatory',
    order: 40,
  },
  {
    id: 'soundboard',
    title: 'Korpo Soundboard',
    desc: 'Niezbędnik na calle: ASAP, Deadline, Fakap.',
    icon: Mic,
    iconClass: 'text-blue-400',
    colorClass: 'border-blue-500/30 hover:border-blue-500',
    path: '/soundboard',
    category: 'Audio',
    order: 10,
  },
  {
    id: 'pierdolator',
    title: 'PIERDOLATOR 3000',
    desc: 'Generator obelg w stylu Matrixa. Zniszcz komuś dzień.',
    icon: Skull,
    iconClass: 'text-red-600 animate-pulse',
    colorClass: 'border-red-600 hover:border-red-500 bg-red-950/20',
    path: '/pierdolator',
    category: 'NSFW',
    order: 999,
    nsfw: true,
  },
];

export const CHAOS_CATEGORY_ORDER: ChaosModuleCategory[] = [
  'Tekst',
  'Grafika / memy',
  'Symulatory',
  'Audio',
  'NSFW',
];

export function getModulesByCategory(modules: ChaosModuleDef[] = CHAOS_MODULES) {
  const groups = new Map<ChaosModuleCategory, ChaosModuleDef[]>();
  for (const m of modules) {
    const arr = groups.get(m.category) || [];
    arr.push(m);
    groups.set(m.category, arr);
  }

  for (const [cat, arr] of groups.entries()) {
    arr.sort((a, b) => a.order - b.order);
    groups.set(cat, arr);
  }

  return groups;
}

export function getAllModulesOrdered(modules: ChaosModuleDef[] = CHAOS_MODULES) {
  return [...modules].sort((a, b) => {
    const aCat = CHAOS_CATEGORY_ORDER.indexOf(a.category);
    const bCat = CHAOS_CATEGORY_ORDER.indexOf(b.category);
    if (aCat !== bCat) return aCat - bCat;
    return a.order - b.order;
  });
}
