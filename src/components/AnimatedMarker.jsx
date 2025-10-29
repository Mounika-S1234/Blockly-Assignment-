// src/components/AnimatedMarker.jsx (FINAL CORRECTED CODE)
import React, { useEffect, useRef } from 'react';
import { Marker, useMap, Popup } from 'react-leaflet'; 
import L from 'leaflet';

/**
 * Custom React-Leaflet Marker that animates its position change and includes a Popup.
 */
function AnimatedMarker({ position, icon, duration = 2000, vehicleData }) {
    const markerRef = useRef(null);
    const map = useMap(); 
    
    // Function to render the detailed popup content (using Tailwind CSS for layout)
    const renderPopupContent = () => (
        // Set fixed width and apply shadow/padding to match the screenshot look
        <div className="w-80 p-4 pt-1 font-sans text-xs bg-white shadow-2xl rounded-xl">
            {/* Header: WIRELESS and Timestamp (100% Match) */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">🚌</span> {/* Vehicle icon beside WIRELESS */}
                    <span className="font-extrabold text-gray-800">WIRELESS</span>
                </div>
                {/* Timestamp (Matching green background and date/time format) */}
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                    <span role="img" aria-label="Clock">🕒</span> Jul 20, {new Date(vehicleData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Location Line - UPDATED FOR HORIZONTAL SCROLLING */}
            <div className="flex items-center text-gray-700 border-b pb-2 mb-3">
                <span className="text-green-500 mr-1 flex-shrink-0">📍</span>
                <div className="flex-grow overflow-x-auto whitespace-nowrap">
                    {/* Fallback for location, as it's mocked */}
                    {vehicleData.locationName || 'Location details not available'} 
                </div>
            </div>

            {/* --- Main Status Grid (3x3 Layout with Icons) --- */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-center border-b pb-3 mb-3">
                
                {/* Speed (Icon + Value) */}
                <div className="flex flex-col items-center">
                    {/* Placeholder for Speedometer icon to match the image */}
                    <span className="text-purple-600 text-lg"> 
                        <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 12V3"></path><path d="M15 17L12 14L9 17"></path></svg> 
                    </span>
                    <span className="font-bold text-gray-900 text-sm">{vehicleData.speed.split(' ')[0]}</span>
                    <span className="text-gray-500 text-xs">Speed</span>
                </div>
                
                {/* Distance (Icon + Value) */}
                <div className="flex flex-col items-center">
                    <span className="text-purple-600 text-lg">🔺</span>
                    <span className="font-bold text-gray-900 text-sm">{vehicleData.distanceFromLastStop}</span>
                    <span className="text-gray-500 text-xs">Distance</span>
                </div>
                
                {/* Battery (Icon + Value) */}
                <div className="flex flex-col items-center">
                    <span className="text-green-500 text-lg">🔋</span>
                    <span className="font-bold text-green-600 text-sm">{vehicleData.battery}</span>
                    <span className="text-gray-500 text-xs">Battery</span>
                </div>

                {/* Total Distance & Distance from Last Stop (Second Row Labels) */}
                <div className="col-span-1 pt-2">
                    <span className="font-semibold text-gray-700 text-sm">{vehicleData.totalDistance}</span>
                    <div className="text-gray-500 pt-1 text-xs">Total Distance</div>
                </div>
                <div className="col-span-2 pt-2 text-left">
                    <span className="font-semibold text-gray-700 text-sm">{vehicleData.distanceFromLastStop}</span>
                    <div className="text-gray-500 pt-1 text-xs">Distance from Last Stop</div>
                </div>
            </div>

            {/* --- Time Status Section (Running, Stopped, Idle) --- */}
            <div className="grid grid-cols-3 gap-y-2 text-center border-b pb-3 mb-3">
                <div>
                    <div className="font-semibold text-gray-700">{vehicleData.todayRunning}</div>
                    <div className="text-gray-500 pt-1">Today Running</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">{vehicleData.todayStopped}</div>
                    <div className="text-gray-500 pt-1">Today Stopped</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-700">{vehicleData.todayIdle}</div>
                    <div className="text-gray-500 pt-1">Today Idle</div>
                </div>
            </div>

            {/* --- Detailed Status and Ignition/AC Times --- */}
            <div className="grid grid-cols-3 gap-y-3 text-center">
                {/* Current Status & Max Speed */}
                <div className="col-span-1">
                    <div className="font-extrabold text-red-600">{vehicleData.currentStatus}</div>
                    <div className="text-gray-500 pt-1">Current Status</div>
                </div>
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.maxSpeed}</div>
                    <div className="text-gray-500 pt-1">Today Max Speed</div>
                </div>
                <div className="col-span-1"></div> {/* Empty slot for alignment */}

                {/* Ignition Times */}
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.ignitionOn}</div>
                    <div className="text-gray-500 pt-1">Today Ignition On</div>
                </div>
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.ignitionOff}</div>
                    <div className="text-gray-500 pt-1">Today Ignition Off</div>
                </div>
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.ignitionOffSince}</div>
                    <div className="text-gray-500 pt-1">Ignition Off Since</div>
                </div>

                {/* AC Times & Custom Value */}
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.acOn}</div>
                    <div className="text-gray-500 pt-1">Today Ac On</div>
                </div>
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.acOff}</div>
                    <div className="text-gray-500 pt-1">Today Ac Off</div>
                </div>
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.acOffSince}</div>
                    <div className="text-gray-500 pt-1">Ac Off Since</div>
                </div>
                
                {/* Custom Value 1 */}
                <div className="col-span-1">
                    <div className="font-semibold text-gray-700">{vehicleData.customValue}</div>
                    <div className="text-gray-500 pt-1">Custom Value 1</div>
                </div>
                <div className="col-span-2"></div> {/* Fill remaining space */}
            </div>


            {/* Footer Buttons (100% Match: orange background, rounded) */}
            <div className="flex justify-center space-x-3 mt-4 pt-4 border-t">
                <button className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-md transition hover:bg-orange-200" title="Ignition On/Off">
                    🔑
                </button>
                <button className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-md transition hover:bg-orange-200" title="Fuel">
                    ⛽
                </button>
                <button className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-md transition hover:bg-orange-200" title="AC On/Off">
                    ❄
                </button>
                <button className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-md transition hover:bg-orange-200" title="Immobilizer">
                    🚨
                </button>
                <button className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-md transition hover:bg-orange-200" title="Lock/Unlock">
                    🔒
                </button>
            </div>
        </div>
    );

    // ... useEffect, initialPosition, and return statements remain the same
    useEffect(() => {
        if (markerRef.current && position) {
            const marker = markerRef.current;
            const endLatLng = L.latLng(position);

            // Pan map to follow the vehicle
            map.panTo(endLatLng, { 
                animate: true, 
                duration: duration / 1000, 
                easeLinearity: 0.1 
            });

            const startLatLng = marker.getLatLng();
            if (startLatLng.lat === 0 && startLatLng.lng === 0) {
                marker.setLatLng(endLatLng);
                return;
            }

            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(1, elapsedTime / duration);
                const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
                const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;
                marker.setLatLng([lat, lng]);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    marker.setLatLng(endLatLng);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [position, duration, map]);
    
    const initialPosition = position || [0, 0]; 

    return (
        <Marker 
            ref={markerRef} 
            position={initialPosition} 
            icon={icon}
        >
            {/* The Leaflet Popup will render exactly at the marker's position */}
            <Popup 
                // Adjust position slightly above the anchor point
                offset={[0, -35]}
            >
                {renderPopupContent()}
            </Popup>
        </Marker>
    );
}

export default AnimatedMarker;