import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Incident {
  id: string;
  image_url: string;
  location: string;
  category: "Safety" | "Cleaning" | "Repair";
  priority: "High" | "Med" | "Low";
  description: string;
  timestamp: string;
  status?: string;
}

export function IncidentFeed({
  onIncidentClick,
  onViewAll,
}: {
  onIncidentClick: (incident: any) => void;
  onViewAll: () => void;
}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIncidents() {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur:', error);
      } else {
        const formattedData = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.created_at).toLocaleDateString(), 
          image_url: item.image_url || "https://placehold.co/600x400?text=No+Image"
        }));
        setIncidents(formattedData);
      }
      setLoading(false);
    }

    fetchIncidents();
  }, []);

  if (loading) return <div className="p-6">Chargement des incidents...</div>;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800">Recent Incident Feed (Live DB)</h3>
        {/* ... Le reste du bouton View All ... */}
         <Button
          onClick={onViewAll}
          variant="ghost"
          size="sm"
          className="text-[#2D5A27] hover:text-[#1f3f1c] hover:bg-green-50"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[600px]">
        {incidents.length === 0 && <p className="text-slate-500 text-center">Aucun incident signalé.</p>}
        
        {incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onIncidentClick(incident)}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
           {/* ... Contenu de la carte, ATTENTION change incident.image par incident.image_url ... */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={incident.image_url} 
                  alt={incident.location}
                  className="w-20 h-20 rounded-md object-cover"
                />
              </div>
              
              {/* Le reste reste identique, juste vérifie les noms de champs */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-slate-900 font-medium truncate">
                    {incident.location}
                  </h4>
                  {/* ... Reste du code ... */}
                  <Badge className="border flex-shrink-0">
                    {incident.priority}
                  </Badge>
                </div>
                {/* ... */}
                <p className="text-sm text-slate-600 line-clamp-2">
                  {incident.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}