import React from 'react';
import WeatherWidget from '@/components/WeatherWidget';

export const metadata = {
  title: 'OpenWeather API Showcase',
  description: 'A premium weather dashboard integrated with OpenWeatherMap API.',
};

export default function OpenWeatherShowcase() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        marginBottom: '1rem',
        background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        Weather API Integration
      </h1>
      <p style={{
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#94a3b8',
        fontSize: '1.2rem'
      }}>
        Real-time weather data visualization using OpenWeatherMap API.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <WeatherWidget />
      </div>

      <section style={{ marginTop: '5rem', color: '#cbd5e1' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Real-time Fetching</h3>
            <p>Utilizes the OpenWeatherMap API to fetch current weather conditions for any city globally with minimal latency.</p>
          </div>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Responsive Design</h3>
            <p>Glassmorphic UI components that adapt to different screen sizes, providing a premium experience on mobile and desktop.</p>
          </div>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Dynamic Visuals</h3>
            <p>Automatically updates weather icons and background accents based on current conditions retrieved from the API.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
