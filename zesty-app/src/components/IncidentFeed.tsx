import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Incident {
  id: string;
  image: string;
  location: string;
  category: "Safety" | "Cleaning" | "Repair";
  priority: "High" | "Med" | "Low";
  description: string;
  timestamp: string;
  status?: string;
  reportedBy?: string;
  detailedDescription?: string;
}

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-300",
  Med: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300"
};

const categoryColors: Record<string, string> = {
  Safety: "bg-red-50 text-red-700",
  Cleaning: "bg-blue-50 text-blue-700",
  Repair: "bg-orange-50 text-orange-700"
};

export function IncidentFeed({
  onIncidentClick,
  onViewAll,
}: {
  onIncidentClick: (incident: Incident) => void;
  onViewAll: () => void;
}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIncidents() {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .neq('status', 'Resolved')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Erreur:', error);
      } else {
        const formattedData = data.map((item: any) => ({
          id: item.id,
          location: item.location,
          category: item.category,
          priority: item.priority,
          description: item.description,
          status: item.status,
          timestamp: new Date(item.created_at).toLocaleDateString(),
          image: item.image_url || "https://placehold.co/600x400?text=No+Image",
          reportedBy: item.reported_by || "Staff",
          detailedDescription: item.detailed_description || item.description
        }));
        setIncidents(formattedData);
      }
      setLoading(false);
    }

    fetchIncidents();
  }, []);

  if (loading) return <div className="p-6 text-center text-slate-500">Chargement...</div>;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800">Incidents en cours</h3>
        <Button
          onClick={onViewAll}
          variant="ghost"
          size="sm"
          className="text-[#2D5A27] hover:text-[#1f3f1c] hover:bg-green-50"
        >
          Historique
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[600px]">
        {incidents.length === 0 && (
          <div className="text-center py-8">
             <p className="text-slate-500 mb-2">Tout est calme ! 🌿</p>
             <p className="text-xs text-slate-400">Aucun incident en attente.</p>
          </div>
        )}
        
        {incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onIncidentClick(incident)}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={incident.image} 
                  alt={incident.location}
                  className="w-20 h-20 rounded-md object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-slate-900 font-medium truncate">
                    {incident.location}
                  </h4>
                  <Badge className={`${priorityColors[incident.priority] || 'bg-slate-100'} border flex-shrink-0`}>
                    {incident.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={categoryColors[incident.category]}>
                    {incident.category}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {incident.timestamp}
                  </span>
                </div>

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