import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, MapPin, Calendar, User, AlertTriangle } from "lucide-react";
import { DashboardNav } from "./DashboardNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

export function IncidentDetailPage({ incident, onBack, onMessagesClick }: IncidentDetailPageProps) {
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-slate-900 mb-2">{incident.location}</h1>
                  <div className="flex items-center gap-3">
                    <Badge className={`${priorityColors[incident.priority]} border`}>
                      {incident.priority} Priority
                    </Badge>
                    <Badge variant="secondary" className={categoryColors[incident.category]}>
                      {incident.category}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      {incident.status || "Under Review"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-96 bg-slate-100">
              <ImageWithFallback
                src={incident.image}
                alt={incident.location}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Location</div>
                    <div className="text-slate-900 font-medium">{incident.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Reported</div>
                    <div className="text-slate-900 font-medium">{incident.timestamp}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Reported By</div>
                    <div className="text-slate-900 font-medium">{incident.reportedBy || "Staff Member"}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-slate-900 mb-3">Issue Description</h3>
                <p className="text-slate-700 leading-relaxed">
                  {incident.detailedDescription || incident.description}
                </p>
              </div>

              {/* Additional Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-amber-900 font-medium mb-1">Priority Notice</div>
                    <p className="text-sm text-amber-700">
                      This issue has been marked as {incident.priority.toLowerCase()} priority and requires immediate attention from the maintenance team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="bg-[#2D5A27] hover:bg-[#1f3f1c] text-white">
                  Assign to Team
                </Button>
                <Button variant="outline">
                  Mark as Resolved
                </Button>
                <Button variant="outline">
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}