'use client';

import React, { useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { StreetViewPanorama } from './StreetViewPanorama';


const LOCATIONS = [
    {
        id: 'eiffel',
        name: 'Eiffel Tower',
        position: { lat: 48.858296, lng: 2.294479 },
        description: 'Iconic iron lattice tower on the Champ de Mars in Paris.'
    },
    {
        id: 'opera',
        name: 'Sydney Opera House',
        position: { lat: -33.858485, lng: 151.214792 },
        description: 'A multi-venue performing arts centre in Sydney, Australia.'
    },
    {
        id: 'times-square',
        name: 'Times Square',
        position: { lat: 40.7580, lng: -73.9855 },
        description: 'Major commercial intersection, tourist destination, and entertainment center in Midtown Manhattan.'
    },
    {
        id: 'shibuya',
        name: 'Shibuya Crossing',
        position: { lat: 35.6595, lng: 139.7005 },
        description: 'Famous scramble crossing in Shibuya, Tokyo, known for its incredible foot traffic.'
    }
];



export default function GoogleMaps() {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[1]); // Default to Sydney
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);

    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
        setInfoWindowOpen(true);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', width: '100%', background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
                {/* Header / Location Picker */}
                <div style={{ padding: '20px', display: 'flex', gap: '15px', overflowX: 'auto', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 10 }}>

                    {LOCATIONS.map((loc) => (
                        <button
                            key={loc.id}
                            onClick={() => setSelectedLocation(loc)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '50px',
                                border: 'none',
                                background: selectedLocation.id === loc.id
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontWeight: '600',
                                fontSize: '14px',
                                boxShadow: selectedLocation.id === loc.id ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                            }}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>

                <APIProvider apiKey={API_KEY}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '2px', background: '#000', overflow: 'hidden' }}>
                        {/* Left: Interactive Map */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Map
                                defaultCenter={selectedLocation.position}
                                center={selectedLocation.position}
                                defaultZoom={15}
                                zoomControl={true} minZoom={5} maxZoom={15}
                                gestureHandling='greedy'
                                disableDefaultUI={false}
                                mapId="bf50390647416954"
                                style={{ width: '100%', height: '100%' }}
                            >
                                {LOCATIONS.map((loc) => (
                                    <Marker
                                        key={loc.id}
                                        position={loc.position}
                                        onClick={() => handleMarkerClick(loc)}
                                    />
                                ))}

                                {infoWindowOpen && (
                                    <InfoWindow
                                        position={selectedLocation.position}
                                        onCloseClick={() => setInfoWindowOpen(false)}
                                    >
                                        <div style={{ color: '#1e293b', padding: '5px' }}>
                                            <h3 style={{ margin: '0 0 5px 0' }}>{selectedLocation.name}</h3>
                                            <p style={{ margin: 0, fontSize: '13px' }}>{selectedLocation.description}</p>
                                        </div>
                                    </InfoWindow>
                                )}


                            </Map>
                        </div>


                        {/* Right: Street View Panorama */}
                        <div style={{ flex: 1, position: 'relative', background: '#1e293b', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Street View</h2>
                                <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '4px' }}>Live Panorama</span>
                            </div>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <StreetViewPanorama
                                    position={selectedLocation.position}
                                />
                            </div>
                        </div>
                    </div>
                </APIProvider>
            </div>
        </>

    );
}
