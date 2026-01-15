import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { InteractiveMap } from "./InteractiveMap";
import { IncidentFeed } from "./IncidentFeed";
import { DashboardNav } from "./DashboardNav";

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
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav 
        onMessagesClick={onMessagesClick} 
        onWorkScheduleClick={onWorkScheduleClick}
        onColleagueDirectoryClick={onColleagueDirectoryClick}
        onAccountSettingsClick={onAccountSettingsClick}
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-slate-900">Facility Maintenance Overview</h1>
            <p className="text-slate-600 mt-1">Monitor and manage zoo facility issues</p>
          </div>
          <Button 
            onClick={onReportNewIssue}
            className="bg-[#2D5A27] hover:bg-[#1f3f1c] text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report New Issue
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Interactive Map */}
          <div className="lg:col-span-1">
            <InteractiveMap />
          </div>

          {/* Right Column - Incident Feed */}
          <div className="lg:col-span-1">
            <IncidentFeed onIncidentClick={onIncidentClick} onViewAll={onViewAllIncidents} />
          </div>
        </div>
      </div>
    </div>
  );
}