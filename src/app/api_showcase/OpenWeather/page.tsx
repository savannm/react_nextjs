'use client';

import GoogleMaps from '@/components/ApiGoogleMaps';

export default function GooglePage() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GoogleMaps />
    </main>
  );
}
