'use client';

import Script from 'next/script';

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

export function Analytics() {
  if (!PLAUSIBLE_DOMAIN) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src={PLAUSIBLE_SRC}
      strategy="afterInteractive"
    />
  );
}

type PlausibleFn = (
  eventName: string,
  options?: { props?: Record<string, string | number | boolean> }
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function track(eventName: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  const plausible = window.plausible;
  if (!plausible) return;
  plausible(eventName, props ? { props } : undefined);
}
