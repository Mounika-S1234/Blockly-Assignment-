// src/VehicleMap.jsx (UPDATED CODE)
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AnimatedMarker from "./components/AnimatedMarker.jsx";
import MapControls from "./components/MapControls.jsx";
import { calculateSpeedKmH } from "./utils.js"; 

// The route data provided in the prompt
const MOCK_ROUTE_DATA = [
    { "latitude": 19.958000, "longitude": 73.834000, "timestamp": "2024-07-20T10:00:00Z" },
    { "latitude": 19.957800, "longitude": 73.834500, "timestamp": "2024-07-20T10:00:10Z" },
    { "latitude": 19.957500, "longitude": 73.835000, "timestamp": "2024-07-20T10:00:20Z" },
    // ... rest of your route data
    { "latitude": 19.949000, "longitude": 73.843500, "timestamp": "2024-07-20T10:03:10Z" }
];

// Define a suitable initial map center (e.g., the first point)
const INITIAL_CENTER = [MOCK_ROUTE_DATA[0].latitude, MOCK_ROUTE_DATA[0].longitude];
// Time interval for moving to the next point in the simulation
const SIMULATION_INTERVAL_MS = 2000; 

// Custom icon for the vehicle
const vehicleIcon = L.divIcon({
    className: 'text-2xl',
    html: '<span class="text-red-600 text-3xl drop-shadow-lg">🚗</span>', // Car emoji as the marker
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Anchor at the bottom center of the car
});

function VehicleMap() {
    // --- State Management ---
    const [routeData] = useState(MOCK_ROUTE_DATA); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    // REMOVED: const [showPopup, setShowPopup] = useState(false);
    const intervalRef = useRef(null);

    // --- Simulation Loop (Unchanged) ---
    useEffect(() => {
        const totalPoints = routeData.length;
        const reachedEnd = currentIndex >= totalPoints - 1;

        if (isPlaying && totalPoints > 0 && !reachedEnd) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => prev + 1);
            }, SIMULATION_INTERVAL_MS);
        } else if (reachedEnd) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, currentIndex, routeData.length]);

    // --- Derived Data ---
    const currentPosition = routeData[currentIndex];

    const fullRouteCoords = useMemo(() => routeData.map(p => [p.latitude, p.longitude]), [routeData]);
    const traveledRouteCoords = useMemo(() => fullRouteCoords.slice(0, currentIndex + 1), [fullRouteCoords, currentIndex]);
    const currentSpeed = calculateSpeedKmH(currentIndex, routeData);

    // Prepare data object for the AnimatedMarker popup
    const vehicleData = {
        ...currentPosition,
        speed: currentSpeed,
        totalDistance: '834.89 km', // Mocked data from the prompt
        status: 'Stopped',           // Mocked data from the prompt
        battery: '16%',
        ignition: 'OFF'
    };

    // --- Handlers ---
    const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);
    const resetSimulation = useCallback(() => {
        setIsPlaying(false);
        setCurrentIndex(0);
        // REMOVED: setShowPopup(false);
    }, []);

    // Calculate slider value (0-100)
    const sliderValue = routeData.length > 1
        ? Math.round((currentIndex / (routeData.length - 1)) * 100)
        : 0;

    const onSliderChange = (event) => {
        setIsPlaying(false);
        const percentage = event.target.value;
        const newIndex = Math.round((percentage / 100) * (routeData.length - 1));
        setCurrentIndex(newIndex);
    };

    if (routeData.length === 0 || !currentPosition) {
        return <div className="flex justify-center items-center h-screen text-lg text-gray-700 bg-gray-100">Initializing Map...</div>;
    }

    const mapCenter = [currentPosition.latitude, currentPosition.longitude];

    return (
        <div className="relative h-screen w-full font-sans">
            {/* Top Bar (Decorative) */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-indigo-700 flex items-center justify-between px-4 z-[2000] shadow-md">
                <span className="text-white text-sm font-medium">Assignment FullStack Developer / Satellite Tracking</span>
                <span className="text-white text-xs opacity-80">Live Simulation Interface</span>
            </div>

            {/* --- Map --- */}
            <MapContainer
                center={mapCenter}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                key={`${mapCenter[0]}-${mapCenter[1]}`} 
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Planned Route (Dashed Green) */}
                <Polyline
                    pathOptions={{ color: 'rgba(50,200,50,0.5)', weight: 5, dashArray: '10, 10' }}
                    positions={fullRouteCoords}
                />

                {/* Traveled Route (Solid Blue) */}
                <Polyline
                    pathOptions={{ color: '#2563eb', weight: 6, opacity: 1 }}
                    positions={traveledRouteCoords}
                />

                {/* Vehicle Marker with Animation and Popup Data */}
                <AnimatedMarker
                    position={[currentPosition.latitude, currentPosition.longitude]}
                    icon={vehicleIcon}
                    duration={SIMULATION_INTERVAL_MS * 0.9} 
                    vehicleData={vehicleData} // NEW PROP
                />
            </MapContainer>

            {/* Controls */}
            <MapControls
                routeData={routeData}
                currentIndex={currentIndex}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                resetSimulation={resetSimulation}
                sliderValue={sliderValue}
                onSliderChange={onSliderChange}
            />
            {/* REMOVED: Vehicle Info Popup div */}
        </div>
    );
}

export default VehicleMap;