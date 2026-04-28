import { APIProvider, Map, Marker, InfoWindow, Circle } from '@vis.gl/react-google-maps';

export default function GoogleMaps() {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const infoWindow = [
        {
            position: { lat: -34.397, lng: 150.644 }, heading: "heading", details: "details",
        },
        {
            position: { lat: -31.397, lng: 110.644 }, heading: "heading", details: "details"
        }

    ]

    return (
        <>
            <APIProvider apiKey={API_KEY}>
                <Map
                    style={{ width: '100vw', height: '100vh' }}
                    defaultCenter={{ lat: -34.397, lng: 150.644 }}
                    defaultZoom={3}
                    gestureHandling='greedy'
                    disableDefaultUI
                >
                    <Circle center={{ lat: -34.397, lng: 110.644 }} radius={100000} fillColor="#FF0000" />

                </Map>
                {/* <Marker position={{ lat: -34.397, lng: 150.644 }} title="Hello World!" /> */}
                {infoWindow.map((info, i) => (
                    <div key={i} ><InfoWindow position={info.position}> <h3>{info.heading}</h3> <p>{info.details}</p> </InfoWindow></div>
                ))}


            </APIProvider>
        </>
    );




}
