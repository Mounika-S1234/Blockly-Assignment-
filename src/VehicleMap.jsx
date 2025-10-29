import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AnimatedMarker from "./components/AnimatedMarker.jsx";
import MapControls from "./components/MapControls.jsx";
import VehicleInfoCard from "./components/VehicleInfoCard.jsx"; // Used for the popup
import { calculateSpeedKmH } from "./utils.js";

// Define the initial map center
const INITIAL_CENTER = [19.957000, 73.835000];
const SIMULATION_INTERVAL_MS = 2000;

// Custom icon for the vehicle
const vehicleIcon = L.divIcon({
    className: 'text-2xl',
    html: '<span class="text-red-600 text-3xl drop-shadow-lg">🚗</span>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

function VehicleMap() {
    // --- State Management ---
    const [routeData, setRouteData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // Controls the visibility of the info card
    const intervalRef = useRef(null);

    // --- Load Route Data ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/dummy-route.json');
                if (!response.ok) throw new Error('Failed to fetch dummy-route.json');

                const data = await response.json();
                setRouteData(data);
                if (data.length > 0) setCurrentIndex(0);
            } catch (error) {
                console.error("Error loading route data. Using fallback mock data.", error);
                setRouteData([
                    { latitude: 19.957000, longitude: 73.835000, timestamp: "2024-07-20T10:00:00Z" },
                    { latitude: 19.958500, longitude: 73.836000, timestamp: "2024-07-20T10:00:10Z" },
                    { latitude: 19.960000, longitude: 73.837500, timestamp: "2024-07-20T10:00:20Z" },
                    { latitude: 19.961500, longitude: 73.838500, timestamp: "2024-07-20T10:00:30Z" },
                ]);
                setCurrentIndex(0);
            }
        };
        loadData();
    }, []);

    // --- Simulation ---
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
    const currentSpeed = currentPosition ? calculateSpeedKmH(currentIndex, routeData) : '0.00';

    // --- Handlers ---
    const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);
    const resetSimulation = useCallback(() => {
        setIsPlaying(false);
        setCurrentIndex(0);
    }, []);

    const sliderValue = routeData.length > 1
        ? Math.round((currentIndex / (routeData.length - 1)) * 100)
        : 0;

    const onSliderChange = (event) => {
        setIsPlaying(false);
        const percentage = event.target.value;
        const newIndex = Math.round((percentage / 100) * (routeData.length - 1));
        setCurrentIndex(newIndex);
        setShowPopup(false); // Hide popup on user navigation
    };

    if (routeData.length === 0 || !currentPosition) {
        return <div className="flex justify-center items-center h-screen text-lg text-gray-700 bg-gray-100">Loading Route Data...</div>;
    }

    return (
        <div className="relative h-screen w-full font-inter">
            {/* --- Map Container --- */}
            <MapContainer
                center={[currentPosition.latitude, currentPosition.longitude]}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='© <a href="">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Planned Route (Green) */}
                <Polyline
                    pathOptions={{ color: 'rgba(50,200,50,1)', weight: 5, opacity: 0.8 }}
                    positions={fullRouteCoords}
                />

                {/* Traveled Route (Blue) */}
                <Polyline
                    pathOptions={{ color: '#2563eb', weight: 6, opacity: 1 }}
                    positions={traveledRouteCoords}
                />

                {/* Vehicle Marker */}
                <AnimatedMarker
                    position={[currentPosition.latitude, currentPosition.longitude]}
                    icon={vehicleIcon}
                    duration={SIMULATION_INTERVAL_MS * 0.9}
                    // Attach click handler to the marker to show the info card
                    eventHandlers={{ click: () => setShowPopup(true) }} 
                />

                {/* --- Vehicle Info Popup (As a separate component for proper Leaflet rendering) --- */}
                {showPopup && (
                    <VehicleInfoCard
                        position={currentPosition}
                        speed={currentSpeed}
                        onClose={() => setShowPopup(false)}
                    />
                )}
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

           
           
        </div>
    );
}

export default VehicleMap;