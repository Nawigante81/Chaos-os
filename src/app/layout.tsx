import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@/components/analytics';
import { ServiceWorkerRegister } from '@/components/sw-register';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'CHAOS OS — kreatory memów i absurdów',
    template: '%s — CHAOS OS',
  },
  description:
    'Zestaw generatorów: wymówki, paski TVP, wyrocznia chaosu, soundboard, gastro match i więcej. Projekt pokazowy.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://54.37.228.166:3000'),
  openGraph: {
    title: 'CHAOS OS — kreatory memów i absurdów',
    description:
      'Zestaw generatorów: wymówki, paski TVP, wyrocznia chaosu, soundboard, gastro match i więcej.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://54.37.228.166:3000',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CHAOS OS — kreatory memów i absurdów',
    description:
      'Zestaw generatorów: wymówki, paski TVP, wyrocznia chaosu, soundboard, gastro match i więcej.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <ServiceWorkerRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
