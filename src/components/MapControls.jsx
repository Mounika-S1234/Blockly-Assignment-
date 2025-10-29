// src/components/MapControls.jsx
import React from 'react';
import { calculateSpeedKmH } from "../utils.js";

// UPDATED PROPS: Pass the state values and handlers from the parent
function MapControls({ 
    routeData, 
    currentIndex, 
    isPlaying, 
    togglePlay, 
    resetSimulation, 
    sliderValue, 
    onSliderChange,
    selectedVehicleType, // New Prop
    setSelectedVehicleType, // New Prop
    selectedTimeRange, // New Prop
    setSelectedTimeRange, // New Prop
    handleShowRoute // New Prop
}) {
    const currentPosition = routeData[currentIndex] || routeData[0] || { latitude: 0, longitude: 0, timestamp: '' };
    const speedKmh = calculateSpeedKmH(currentIndex, routeData);
    
    // ... UI look comments ...

    return (
        <>
            {/* Top-Left Metadata Card (No changes) */}
            <div className="absolute top-4 left-4 z-[1000] p-4 bg-white shadow-xl rounded-lg w-full max-w-xs md:max-w-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">WIRELESS</h2>
                <div className="bg-gray-100 p-3 rounded-lg space-y-1">
                    <p className="text-xs">Location: <span className="font-mono text-blue-600">{currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}</span></p>
                    <p className="text-xs">Timestamp: <span className="font-medium text-gray-700">{currentPosition.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}</span></p>
                    <p className="text-xs">Speed: <span className="font-bold text-gray-800">{speedKmh} km/h</span></p>
                    <p className="text-xs">Index: <span className="font-bold text-gray-800">{currentIndex + 1} / {routeData.length}</span></p>
                </div>
            </div>

            {/* Main Center Control Bar (No changes) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-28 z-[1000] p-2 pointer-events-auto">
                <div className="bg-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-4 w-[90vw] max-w-4xl">
                    
                    {/* Time Dot (Decorative) */}
                    <div className="h-4 w-4 rounded-full border-2 border-indigo-700 flex-shrink-0" />
                    
                    {/* Slider */}
                    <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={sliderValue} 
                        onChange={onSliderChange}
                        className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:bg-blue-600"
                        style={{'--range-thumb-width': '20px'}}
                    />
                    
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5zm7 0h3v12h-3z" /></svg> // Pause icon
                        ) : (
                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6 4l12 6-12 6z" /></svg> // Play icon
                        )}
                    </button>
                    
                    {/* Reset Button (Loop icon) */}
                    <button
                        onClick={resetSimulation}
                        className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                        title="Reset"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 4m0 5h5m7.568 13v-5h-.582m15.356-2a8.001 8.001 0 01-15.356 2m0-5h5"/></svg>
                    </button>
                    
                    {/* Small Bar (Decorative) */}
                    <div className="w-20 h-1 bg-gray-200 rounded-lg" />
                </div>
            </div>

            {/* Bottom Configure Bar (UPDATED with State and Handlers) */}
            <div className="absolute left-0 right-0 bottom-0 z-[900] pointer-events-auto">
                <div className="bg-white shadow-lg px-6 py-4 flex items-center justify-between">
                    <div className="text-base font-semibold text-gray-800">Configure</div>
                    <div className="flex items-center gap-3">
                        {/* Vehicle Type Select */}
                        <select 
                            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            value={selectedVehicleType}
                            onChange={(e) => setSelectedVehicleType(e.target.value)}
                        >
                            <option>WIRELESS</option>
                            <option>GPS</option>
                        </select>
                        
                        {/* Time Range Select */}
                        <select 
                            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                        >
                            <option>Today</option>
                            <option>Yesterday</option>
                            <option>This Week</option>
                            <option>Previous Week</option>
                            <option>This Month</option>
                            <option>Previous Month</option>
                            <option>Custom</option>
                        </select>

                        {/* SHOW Button */}
                        <button 
                            onClick={handleShowRoute} // <-- ATTACHED HANDLER
                            className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                            SHOW
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MapControls;