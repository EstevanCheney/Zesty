import { MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
// Import de votre nouvelle carte (assurez-vous que le fichier est bien dans src/assets/)
import mapZoo from "../assets/map_zoo.png"; 

interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  status: "good" | "issue";
}

const locations: MapLocation[] = [
  { id: "2", name: "Small Farm", x: 25, y: 50, status: "issue" },
  { id: "3", name: "Giraffe Habitat", x: 70, y: 50, status: "issue" },
  { id: "4", name: "Food Kiosk - Crepes", x: 50, y: 35, status: "issue" },
  { id: "5", name: "African Savanna", x: 65, y: 65, status: "good" },
  { id: "9", name: "Toilets & Picnic Area", x: 80, y: 30, status: "good" },
  { id: "10", name: "Little Amazonia", x: 40, y: 55, status: "good" },
];

export function InteractiveMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <h3 className="text-slate-800 mb-4">Zoo Facility Map</h3>
      
      <div className="relative w-full h-[500px] bg-slate-100 rounded-lg border-2 border-slate-200 overflow-hidden">
        
        {/* Intégration de l'image map_zoo.png */}
        <img 
          src={mapZoo} 
          alt="Carte du Zoo" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Location pins */}
        {locations.map((location) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-10"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onMouseEnter={() => setHoveredLocation(location.id)}
            onMouseLeave={() => setHoveredLocation(null)}
          >
            {location.status === "good" ? (
              <CheckCircle className="w-8 h-8 text-[#2D5A27] drop-shadow-lg bg-white rounded-full p-0.5" fill="#22c55e" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-600 drop-shadow-lg bg-white rounded-full p-0.5" fill="#ef4444" />
            )}
            
            {/* Tooltip */}
            {hoveredLocation === location.id && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap z-20 shadow-xl">
                {location.name}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#2D5A27]" fill="#22c55e" />
          <span className="text-sm text-slate-600">No Issues</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" fill="#ef4444" />
          <span className="text-sm text-slate-600">Requires Attention</span>
        </div>
      </div>
    </div>
  );
}

