import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { InteractiveMap } from "./InteractiveMap";
import { IncidentFeed } from "./IncidentFeed";
import { DashboardNav } from "./DashboardNav";
import { supabase } from "../lib/supabase";

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

interface MainDashboardProps {
  onReportNewIssue: () => void;
  onIncidentClick: (incident: Incident) => void;
  onViewAllIncidents: () => void;
  onMessagesClick: () => void;
  onWorkScheduleClick?: () => void;
  onColleagueDirectoryClick?: () => void;
  onAccountSettingsClick?: () => void;
}

export function MainDashboard({ 
  onReportNewIssue, 
  onIncidentClick, 
  onViewAllIncidents, 
  onMessagesClick,
  onWorkScheduleClick,
  onColleagueDirectoryClick,
  onAccountSettingsClick 
}: MainDashboardProps) {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    async function getName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        const fullName = data?.full_name || "";
        setFirstName(fullName.split(' ')[0]);
      }
    }
    getName();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav 
        onMessagesClick={onMessagesClick} 
        onWorkScheduleClick={onWorkScheduleClick}
        onColleagueDirectoryClick={onColleagueDirectoryClick}
        onAccountSettingsClick={onAccountSettingsClick}
      />
      
      <div className="p-6">
        {/* Header Personnalisé */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl text-slate-900 font-bold">
              {firstName ? `Bonjour, ${firstName} 👋` : "Tableau de Bord"}
            </h1>
            <p className="text-slate-600 mt-1">Voici l'état actuel des installations du parc.</p>
          </div>
          <Button 
            onClick={onReportNewIssue}
            className="bg-[#2D5A27] hover:bg-[#1f3f1c] text-white shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Signaler un incident
          </Button>
        </div>

        {/* Contenu Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carte Interactive */}
          <div className="lg:col-span-1">
            <InteractiveMap />
          </div>

          {/* Flux d'incidents */}
          <div className="lg:col-span-1">
            <IncidentFeed onIncidentClick={onIncidentClick} onViewAll={onViewAllIncidents} />
          </div>
        </div>
      </div>
    </div>
  );
}