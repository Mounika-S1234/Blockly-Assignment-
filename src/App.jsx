// src/App.jsx
import VehicleMap from './VehicleMap';

function App() {
  return (
    // Set a consistent height/width for the map to fill the screen
    <div className="h-screen w-full overflow-hidden">
      <VehicleMap />
    </div>
  );
}

export default App;