import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { DashboardNav } from "./DashboardNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../lib/supabase"; // Import Supabase
import { toast } from "sonner"; // Import Toast pour les notifs

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

interface IncidentDetailPageProps {
  incident: Incident;
  onBack: () => void;
  onMessagesClick: () => void;
}

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-300",
  Med: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300"
};

export function IncidentDetailPage({ incident, onBack, onMessagesClick }: IncidentDetailPageProps) {
  const [resolving, setResolving] = useState(false);

  const handleResolve = async () => {
    setResolving(true);
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: 'Resolved' })
        .eq('id', incident.id);

      if (error) throw error;

      toast.success("Incident marqué comme résolu !");
      
      setTimeout(() => {
        onBack();
      }, 500);

    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav onMessagesClick={onMessagesClick} />
      
      <div className="p-6">
        {/* Header */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-slate-200 overflow-hidden">
          {/* Hero Image */}
          <div className="h-64 w-full bg-slate-100 relative">
            <ImageWithFallback
              src={incident.image}
              alt={incident.location}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
               <Badge className={`${priorityColors[incident.priority] || 'bg-slate-100'} border px-3 py-1 text-sm`}>
                 Priority: {incident.priority}
               </Badge>
            </div>
          </div>

          <div className="p-8">
            {/* Title Section */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{incident.location}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Badge variant="secondary">{incident.category}</Badge>
                  <span>•</span>
                  <span>Reported on {incident.timestamp}</span>
                  <span>•</span>
                  <span>by {incident.reportedBy}</span>
                </div>
              </div>
              
              {/* STATUS INDICATOR OR ACTION BUTTON */}
              {incident.status === 'Resolved' ? (
                 <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Resolved</span>
                 </div>
              ) : (
                <Button 
                  onClick={handleResolve} 
                  disabled={resolving}
                  className="bg-[#2D5A27] hover:bg-[#1f3f1c] text-white px-6"
                >
                  {resolving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {incident.description}
                </p>
              </div>

              {incident.detailedDescription && incident.detailedDescription !== incident.description && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Additional Details</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {incident.detailedDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}