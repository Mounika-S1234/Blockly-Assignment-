import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Need L to create an invisible icon for the anchor

// Define an invisible icon to anchor the popup without showing a marker head
const invisibleIcon = L.divIcon({
    className: 'hidden', // Tailwind class to hide the div icon element
    html: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
});

/**
 * Renders the detailed vehicle information card as a Leaflet Popup,
 * anchored to the current vehicle position. Matches the provided screenshot visually.
 */
function VehicleInfoCard({ position, speed, onClose }) {
    if (!position) return null;

    // Static data pulled directly from the screenshot for accurate replication
    const screenshotData = {
        totalDistance: "834.89 km",
        battery: "16%",
        todayRunning: "00h:00m",
        todayStopped: "07h:10m",
        todayIdle: "00h:00m",
        maxSpeed: "0.00 km/h",
        ignitionOn: "00h:00m",
        ignitionOff: "00h:00m",
        ignitionOffSince: "00h:00m",
        acOn: "00h:00m",
        acOff: "00h:00m",
        acOffSince: "00h:00m",
        customValue: "16%",
        address: "nagar Rd, Vijay Nagar, Deolali, Nashik, Deolali, Mah", // Truncated sample address
    };

    // Determine current status based on simulation speed (0.00 km/h in screenshot, so we default to 'STOPPED')
    const currentStatusText = Number(speed) > 0 ? 'RUNNING' : 'STOPPED';
    const currentSpeedText = Number(speed).toFixed(2);
    
    // Format timestamp to match the screenshot's style (e.g., Jul 20, 07:09 AM)
    const formattedTimestamp = position.timestamp 
        ? new Date(position.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ", " + 
          new Date(position.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        : 'Jul 20, 07:09 AM'; // Fallback matching screenshot

    // Helper component for a single detail item in the grid
    const DetailItem = ({ label, value, icon, colorClass = 'text-gray-500' }) => (
        <div className="flex flex-col items-center text-center">
            <div className={`text-2xl ${colorClass}`}>{icon}</div>
            <div className="text-sm font-semibold mt-1">
                <span className="text-gray-800">{value}</span>
            </div>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );
    
    // Helper component for time-based status items
    const TimeStatusItem = ({ label, value, isPrimary = false }) => (
        <div className="flex flex-col text-xs space-y-0.5 p-1">
            <span className={`font-semibold ${isPrimary ? 'text-gray-900' : 'text-gray-700'}`}>{value}</span>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );

    return (
        // Use an invisible Marker to anchor the fully custom Popup
        <Marker position={[position.latitude, position.longitude]} icon={invisibleIcon}>
            <Popup 
                onClose={onClose} 
                closeButton={true}
                // Custom CSS classes and options to make it look like the floating card
                className="custom-vehicle-popup !p-0"
                options={{ minWidth: 280, closeOnClick: true, autoPan: true }}
            >
                {/* Full Card Structure (matches screenshot dimensions and styling) */}
                <div className="bg-white rounded-xl w-72 shadow-2xl p-4 font-sans">
                    
                    {/* Header: Vehicle Name, Time, and Close Button */}
                    <div className="flex justify-between items-center mb-2 pb-2">
                        <div className="flex items-center space-x-1">
                            <span className="text-xl">🚌</span>
                            <h2 className="text-gray-800 font-bold text-base">WIRELESS</h2>
                        </div>
                        <span className="text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded-full shadow">
                            {formattedTimestamp}
                        </span>
                        {/* Leaflet handles the 'X' button */}
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-start text-xs mb-3 border-b pb-2">
                        <span className="text-lg text-green-500 mr-1 mt-[-2px]">📍</span>
                        <p className="text-gray-600">{screenshotData.address}</p>
                    </div>

                    {/* Main Metrics Row (Speed, Distance, Battery) */}
                    <div className="grid grid-cols-3 text-center mb-4">
                        <DetailItem 
                            label="Speed" 
                            value={`${currentSpeedText} km/h`} 
                            icon=" speedometer" // Speed icon
                            colorClass="text-blue-500" 
                        />
                        <DetailItem 
                            label="Distance" 
                            value="0.00 km" 
                            icon="▲" // Distance icon (simple triangle for arrow)
                            colorClass="text-purple-500" 
                        />
                        <DetailItem 
                            label="Battery" 
                            value={screenshotData.battery} 
                            icon="🔋" // Battery icon
                            colorClass="text-green-500" 
                        />
                    </div>
                    
                    <hr className="my-2"/>
                    
                    {/* Distance Metrics */}
                    <div className="grid grid-cols-2 text-xs text-center my-3">
                        <div className="flex flex-col">
                            <span className="text-base font-semibold text-gray-800">{screenshotData.totalDistance}</span>
                            <span className="text-xs text-gray-500">Total Distance</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-semibold text-gray-800">0.00 km</span>
                            <span className="text-xs text-gray-500">Distance From Last Stop</span>
                        </div>
                    </div>

                    <hr className="my-2"/>
                    
                    {/* Today Status Row (Running, Stopped, Idle) */}
                    <div className="grid grid-cols-3 gap-y-2 text-xs text-center my-3">
                        <TimeStatusItem label="Today Running" value={screenshotData.todayRunning} />
                        <TimeStatusItem label="Today Stopped" value={screenshotData.todayStopped} />
                        <TimeStatusItem label="Today Idle" value={screenshotData.todayIdle} />
                        
                        <div className="col-span-2 flex flex-col items-center">
                            <span className={`text-lg font-bold ${currentStatusText === 'STOPPED' ? 'text-red-500' : 'text-green-500'}`}>
                                {currentStatusText}
                            </span>
                            <span className="text-xs text-gray-500">Current Status</span>
                        </div>
                        <TimeStatusItem label="Today Max Speed" value={screenshotData.maxSpeed} />
                    </div>
                    
                    <hr className="my-2"/>
                    
                    {/* Ignition and AC Rows */}
                    <div className="grid grid-cols-3 gap-y-2 text-xs text-center my-3">
                        <TimeStatusItem label="Today Ignition On" value={screenshotData.ignitionOn} />
                        <TimeStatusItem label="Today Ignition Off" value={screenshotData.ignitionOff} />
                        <TimeStatusItem label="Ignition Off Since" value={screenshotData.ignitionOffSince} />

                        <TimeStatusItem label="Today Ac On" value={screenshotData.acOn} />
                        <TimeStatusItem label="Today Ac Off" value={screenshotData.acOff} />
                        <TimeStatusItem label="Ac Off Since" value={screenshotData.acOffSince} />
                    </div>

                    {/* Custom Value */}
                    <div className="flex flex-col text-xs text-center mt-3 pt-2 border-t">
                        <span className="text-base font-semibold text-gray-800">{screenshotData.customValue}</span>
                        <span className="text-xs text-gray-500">Custom Value 1</span>
                    </div>

                    {/* Footer Icons (Matching screenshot's icon style) */}
                    <div className="flex space-x-3 justify-center items-center mt-4 pt-3 border-t">
                        <button className="p-3 rounded-full bg-orange-100 text-orange-600 text-xl shadow-sm hover:bg-orange-200" title="Ignition On/Off">🔑</button>
                        <button className="p-3 rounded-full bg-orange-100 text-orange-600 text-xl shadow-sm hover:bg-orange-200" title="Fuel Status">⛽</button>
                        <button className="p-3 rounded-full bg-orange-100 text-orange-600 text-xl shadow-sm hover:bg-orange-200" title="AC Control">❄️</button>
                        <button className="p-3 rounded-full bg-orange-100 text-orange-600 text-xl shadow-sm hover:bg-orange-200" title="Battery/Power">💡</button>
                        <button className="p-3 rounded-full bg-orange-100 text-orange-600 text-xl shadow-sm hover:bg-orange-200" title="Lock/Unlock">🔒</button>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default VehicleInfoCard;