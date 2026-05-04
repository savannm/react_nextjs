"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './WeatherWidget.module.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function WeatherWidget() {
  const [city, setCity] = useState('Sydney');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY';

  const fetchWeather = async (cityName: string) => {
    if (API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      // Demo mode fallback
      setLoading(true);
      setTimeout(() => {
        setWeather({
          name: cityName + " (Demo)",
          main: { temp: 22, humidity: 45, feels_like: 21 },
          weather: [{ description: "partly cloudy", icon: "02d" }],
          wind: { speed: 4.5 }
        });
        setLoading(false);
      }, 800);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };
  //on load, set default weather.
  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCity(input);
      fetchWeather(input);
    }
  };

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.weatherCard}>
        <form onSubmit={handleSearch} className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search city..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        ) : weather ? (
          <div className={styles.weatherInfo}>
            <h2 className={styles.cityTitle}>{weather.name}</h2>
            <p className={styles.dateText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <div className={styles.tempContainer}>
              <span className={styles.temperature}>
                {Math.round(weather.main.temp)}°
              </span>
              <Image
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                width={100}
                height={100}
                className={styles.weatherIcon}
              />
            </div>

            <p className={styles.description}>{weather.weather[0].description}</p>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Feels Like</span>
                <span className={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Humidity</span>
                <span className={styles.detailValue}>{weather.main.humidity}%</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Wind Speed</span>
                <span className={styles.detailValue}>{weather.wind.speed} m/s</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>City</span>
                <span className={styles.detailValue}>{weather.name}</span>
              </div>
            </div>
          </div>
        ) : !error && (
          <div className={styles.weatherInfo}>
            <p>No weather data available. Please check your API key.</p>
          </div>
        )}
        {API_KEY === 'YOUR_OPENWEATHER_API_KEY' && (
          <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '1rem', textAlign: 'center' }}>
            Running in Demo Mode. Add <code>NEXT_PUBLIC_OPENWEATHER_API_KEY</code> to <code>.env.local</code> for real data.
          </p>
        )}
      </div>
    </div>
  );
}
