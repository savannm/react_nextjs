'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMap, useApiIsLoaded } from '@vis.gl/react-google-maps';

/**
 * A component that renders a Google Maps Street View Panorama.
 */
export const StreetViewPanorama = ({ position, pov = { heading: 0, pitch: 0 }, zoom = 1 }) => {
  const panoramaRef = useRef(null);
  const [panorama, setPanorama] = useState(null);
  const map = useMap();
  const apiIsLoaded = useApiIsLoaded();

  // Initialize Panorama
  useEffect(() => {
    if (!apiIsLoaded || !panoramaRef.current || !window.google) return;

    try {
      const newPanorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
        position: position,
        pov: pov,
        zoom: zoom,
        addressControl: true,
        clickToGo: true,
        disableDefaultUI: false,
        motionTracking: true,
        motionTrackingControl: true,
      });

      setPanorama(newPanorama);

      // Link to map if available
      if (map) {
        map.setStreetView(newPanorama);
      }

    } catch (error) {
      console.error("Error initializing Street View:", error);
    }

    return () => {
      if (map) map.setStreetView(null);
    };
  }, [apiIsLoaded]); // Only initialize once when API is ready

  // Sync position and link to map when map instance changes
  useEffect(() => {
    if (!panorama || !map) return;
    map.setStreetView(panorama);
  }, [panorama, map]);

  // Update position when it changes
  useEffect(() => {
    if (panorama && position) {
      // Small delay to ensure the panorama object is ready to receive new coordinates
      const timeout = setTimeout(() => {
        panorama.setPosition(position);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [panorama, position]);

  return (
    <div
      ref={panoramaRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        background: '#000'
      }}
    />
  );
};
