// src/utils.js

// Simplified Haversine formula to calculate great-circle distance between two points
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
}

export function calculateSpeedKmH(currentIndex, routeData) {
    if (currentIndex === 0 || routeData.length <= 1) return '0.00';

    const currPoint = routeData[currentIndex];
    const prevPoint = routeData[currentIndex - 1];

    if (!prevPoint || !currPoint) return '0.00';

    const distanceKm = calculateDistanceKm(
        prevPoint.latitude, prevPoint.longitude,
        currPoint.latitude, currPoint.longitude
    );

    const timeDeltaMs = new Date(currPoint.timestamp).getTime() - new Date(prevPoint.timestamp).getTime();
    const timeDeltaHours = timeDeltaMs / (1000 * 60 * 60); // Convert ms to hours

    if (timeDeltaHours <= 0) return '0.00';

    const speed = distanceKm / timeDeltaHours; // Speed in km/h
    return speed.toFixed(2);
}