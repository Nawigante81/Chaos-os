import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: 'linear-gradient(135deg, #0a0b10 0%, #1b1f35 55%, #0a0b10 100%)',
          color: 'white',
          fontSize: 64,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, opacity: 0.7, marginBottom: 18 }}>
          CHAOS INC.
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <div style={{ color: '#7c3aed' }}>CHAOS</div>
          <div style={{ opacity: 0.95 }}>OS</div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, marginTop: 18, maxWidth: 900, lineHeight: 1.2 }}>
          Kreatory memów i absurdów: wymówki, paski TV, wyrocznia, soundboard i więcej.
        </div>
      </div>
    ),
    size
  );
}
