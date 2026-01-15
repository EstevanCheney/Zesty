import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft } from "lucide-react";
import { DashboardNav } from "./DashboardNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allIncidents } from "./IncidentFeed";

interface Incident {
  id: string;
  image: string;
  location: string;
  category: "Safety" | "Cleaning" | "Repair";
  priority: "High" | "Med" | "Low";
  description: string;
  timestamp: string;
  reportedBy?: string;
  detailedDescription?: string;
  status?: string;
}

interface AllIncidentsPageProps {
  onBack: () => void;
  onIncidentClick: (incident: Incident) => void;
  onMessagesClick: () => void;
}

const priorityColors = {
  High: "bg-red-100 text-red-700 border-red-300",
  Med: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300"
};

const categoryColors = {
  Safety: "bg-red-50 text-red-700",
  Cleaning: "bg-blue-50 text-blue-700",
  Repair: "bg-orange-50 text-orange-700"
};

export function AllIncidentsPage({ onBack, onIncidentClick, onMessagesClick }: AllIncidentsPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav onMessagesClick={onMessagesClick} />
      
      <div className="p-6">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">All Incidents</h1>
          <p className="text-slate-600">
            Complete history of all maintenance reports and issues
          </p>
        </div>

        {/* Incidents Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allIncidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => onIncidentClick(incident)}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-slate-100">
                  <ImageWithFallback
                    src={incident.image}
                    alt={incident.location}
                    className="w-full h-full object-cover"
                  />
                  {incident.status === "Resolved" && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-100 text-green-700 border-green-300 border">
                        Resolved
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-slate-900 font-medium line-clamp-1">{incident.location}</h4>
                    <Badge className={`${priorityColors[incident.priority]} border flex-shrink-0`}>
                      {incident.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className={categoryColors[incident.category]}>
                      {incident.category}
                    </Badge>
                    <span className="text-xs text-slate-500">{incident.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2">{incident.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}