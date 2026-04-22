import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface WorkerLocationMapProps {
  workerLocation: {
    lat: number;
    lng: number;
    name: string;
    address: string;
  };
}

export function WorkerLocationMap({ workerLocation }: WorkerLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [eta, setEta] = useState('15 min');
  const [distance, setDistance] = useState('3.2 km');

  useEffect(() => {
    // Simulate map loading
    setIsMapLoaded(true);

    // Simulate ETA updates
    const interval = setInterval(() => {
      const etaMinutes = Math.max(1, Math.floor(Math.random() * 20));
      setEta(`${etaMinutes} min`);
      setDistance(`${(Math.random() * 5 + 0.5).toFixed(1)} km`);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {/* Map Container */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full relative">
            {/* Grid pattern to simulate map */}
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Animated roads */}
            <div className="absolute top-1/3 left-0 w-full h-1 bg-blue-300 opacity-50" />
            <div className="absolute top-2/3 left-0 w-full h-1 bg-blue-300 opacity-50" />
            <div className="absolute top-0 left-1/3 w-1 h-full bg-blue-300 opacity-50" />
            <div className="absolute top-0 left-2/3 w-1 h-full bg-blue-300 opacity-50" />

            {/* Worker marker with pulse animation */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: '45%', left: '60%' }}
            >
              <div className="relative">
                {/* Pulse effect */}
                <div className="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping" />
                <div className="absolute -inset-1 bg-blue-400 rounded-full opacity-50 animate-pulse" />
                
                {/* Worker icon */}
                <div className="relative w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                
                {/* Worker label */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-md">
                  <p className="text-xs font-bold text-blue-600">{workerLocation.name}</p>
                </div>
              </div>
            </div>

            {/* Destination marker */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{ top: '70%', left: '40%' }}
            >
              <MapPin className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-lg" />
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-md">
                <p className="text-xs font-bold text-gray-700">Your Location</p>
              </div>
            </div>

            {/* Route path */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <path
                d="M 60% 45% Q 55% 55%, 40% 70%"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-medium">{workerLocation.address}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-xs opacity-90">ETA</p>
                <p className="text-lg font-bold">{eta}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-90">Distance</p>
                <p className="text-lg font-bold">{distance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="text-xl font-bold text-gray-700">+</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="text-xl font-bold text-gray-700">−</span>
          </button>
        </div>
      </div>

      {/* Location details */}
      <div className="p-4 border-t border-gray-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Worker is on the way</h4>
            <p className="text-sm text-gray-600">
              {workerLocation.name} is currently at {workerLocation.address} and heading to your location.
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-700">Live tracking</span>
              </div>
              <span className="text-blue-600 font-medium">Arriving in {eta}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
