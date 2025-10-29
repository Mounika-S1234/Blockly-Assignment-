// src/components/AnimatedMarker.jsx
import React, { useEffect, useRef } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Custom Marker component that animates movement between positions.
 */
function AnimatedMarker({ position, icon, duration = 2000, eventHandlers }) {
    const markerRef = useRef(null);
    const map = useMap(); 

    useEffect(() => {
        let animationFrameId;
        const marker = markerRef.current;
        if (marker && position) {
            const startLatLng = marker.getLatLng();
            const endLatLng = L.latLng(position);

            // If it's the first render or position hasn't changed, just set
            if (startLatLng.lat === 0 && startLatLng.lng === 0 || startLatLng.equals(endLatLng)) {
                marker.setLatLng(endLatLng);
                return;
            }

            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(1, elapsedTime / duration);

                // Linear Interpolation (Lerp)
                const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
                const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;

                marker.setLatLng([lat, lng]);
                
                // Keep the map centered on the vehicle as it moves
                map.panTo([lat, lng], { animate: false }); 

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    marker.setLatLng(endLatLng);
                }
            };

            animationFrameId = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [position, duration, map]);

    // Use a safe placeholder position
    const safePosition = position || [0, 0];

    // Pass the eventHandlers prop to the base Marker component
    return <Marker ref={markerRef} position={safePosition} icon={icon} eventHandlers={eventHandlers} />;
}

export default AnimatedMarker;