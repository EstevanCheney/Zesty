import { MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import mapZoo from "../assets/map_zoo.png"; 
import { supabase } from "../lib/supabase";

interface MapLocation {
  id: string;
  name: string;    // Nom affiché à l'écran (Français)
  dbValue: string; // Valeur exacte stockée en base de données (Anglais)
  x: number;
  y: number;
}

// Configuration des points : on fait correspondre l'affichage et la base de données
const locations: MapLocation[] = [
  { 
    id: "1", 
    name: "Entrée Principale - Billetterie", 
    dbValue: "Main Entrance - Ticketing", // Doit matcher le 'value' du formulaire
    x: 7.5, y: 69 
  },
  { 
    id: "2", 
    name: "Petite Ferme", 
    dbValue: "Small Farm", 
    x: 87, y: 30 
  },
  { 
    id: "3", 
    name: "Enclos des Girafes", 
    dbValue: "Giraffe Habitat", 
    x: 68, y: 45 
  },
  { 
    id: "4", 
    name: "Enclos des Ours", // J'ai repris le nom que tu avais mis dans le formulaire
    dbValue: "Food Kiosk - Crepes", // Attention : C'est la valeur technique actuelle dans ton formulaire
    x: 40, y: 75 
  },
  { 
    id: "5", 
    name: "Savane Africaine", 
    dbValue: "African Savanna", 
    x: 71, y: 55 
  },
  { 
    id: "6", 
    name: "Volière", 
    dbValue: "Big Aviary", 
    x: 55, y: 20 
  },
  { 
    id: "7", 
    name: "Toilettes", 
    dbValue: "Restrooms", 
    x: 23, y: 55 
  },
];

export function InteractiveMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [problemLocations, setProblemLocations] = useState<Set<string>>(new Set());

  const fetchActiveIncidents = async () => {
    // On récupère les incidents non résolus
    const { data, error } = await supabase
      .from('incidents')
      .select('location')
      .neq('status', 'Resolved');

    if (data) {
      // On stocke les lieux à problème dans un Set pour une recherche rapide
      const issues = new Set(data.map((incident) => incident.location));
      setProblemLocations(issues);
    }
  };

  useEffect(() => {
    fetchActiveIncidents();

    // Abonnement temps réel pour mise à jour automatique
    const channel = supabase
      .channel('map-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => {
          fetchActiveIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <h3 className="text-slate-800 mb-4">Carte du Zoo (État en direct)</h3>
      
      <div className="relative w-full h-[500px] bg-slate-100 rounded-lg border-2 border-slate-200 overflow-hidden">
        
        <img 
          src={mapZoo} 
          alt="Carte du Zoo" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {locations.map((location) => {
          // CORRECTION ICI : On vérifie si la VALEUR DB est dans la liste des problèmes
          const hasIssue = problemLocations.has(location.dbValue);

          return (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-10"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {hasIssue ? (
                // ROUGE : Problème détecté
                <div className="relative">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <AlertTriangle className="w-8 h-8 text-red-600 drop-shadow-lg bg-white rounded-full p-0.5" fill="#ef4444" />
                </div>
              ) : (
                // VERT : Tout va bien
                <CheckCircle className="w-8 h-8 text-[#2D5A27] drop-shadow-lg bg-white rounded-full p-0.5" fill="#22c55e" />
              )}
              
              {/* Tooltip au survol */}
              {hoveredLocation === location.id && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap z-20 shadow-xl">
                  {location.name}
                  <div className="text-xs text-slate-300">
                    {hasIssue ? "Incident signalé" : "Aucun problème"}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#2D5A27]" fill="#22c55e" />
          <span className="text-sm text-slate-600">Opérationnel</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" fill="#ef4444" />
          <span className="text-sm text-slate-600">Incident en cours</span>
        </div>
      </div>
    </div>
  );
}