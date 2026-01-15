import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

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

export const incidents: Incident[] = [
  {
    id: "1",
    image:
      "https://natureetzoo.fr/wp-content/uploads/2021/05/175921952_5400947293311124_4101066773334376918_n-1020x600.jpg",
    location: "Small Farm",
    category: "Safety",
    priority: "High",
    description:
      "Fence section compromised, needs immediate repair",
    timestamp: "2 hours ago",
    reportedBy: "Sarah Johnson",
    detailedDescription:
      "A section of the perimeter fence at the Small Farm petting area has sustained damage. The fence shows signs of structural weakness that could allow small animals to escape or create safety concerns for children visiting the area. The damaged section is approximately 6 feet in length and requires immediate attention to maintain visitor and animal safety. Temporary barriers have been placed, but permanent repair is critical.",
    status: "Critical - In Progress",
  },
  {
    id: "2",
    image:
      "https://www.zoo-mulhouse.com/wp-content/uploads/2018/06/kioske-nordique.jpg",
    location: "Food Kiosk - Crepes",
    category: "Cleaning",
    priority: "Med",
    description:
      "Deep cleaning required after equipment malfunction",
    timestamp: "4 hours ago",
    reportedBy: "Mike Chen",
    detailedDescription:
      "The crepe kiosk experienced a batter spill during morning service when mixing equipment malfunctioned. The spill has affected the counter area, floor space, and lower cabinet surfaces. Initial cleanup has been performed, but thorough deep cleaning and sanitization is required before reopening to ensure health and safety compliance. Equipment inspection is also recommended.",
    status: "Scheduled",
  },
  {
    id: "3",
    image:
      "https://www.explore-grandest.com/app/uploads/2025/11/sortie-des-girafes-high-scaled-1920par1080.jpg",
    location: "Giraffe Habitat - Viewing Platform",
    category: "Repair",
    priority: "High",
    description:
      "Observation deck railing requires immediate attention",
    timestamp: "5 hours ago",
    reportedBy: "David Martinez",
    detailedDescription:
      "Safety inspection at the Giraffe Habitat viewing platform revealed loose mounting bolts on the observation deck railing. Three bolts require immediate tightening and one needs replacement. The platform provides popular close-up viewing of the giraffes and is a high-traffic area. The section has been temporarily cordoned off to visitors until repairs are completed to ensure safe observation access.",
    status: "Urgent - Awaiting Parts",
  },
  {
    id: "4",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Zoo_Mulhouse_000.JPG",
    location: "Main Entrance - Ticketing",
    category: "Repair",
    priority: "Low",
    description: "Entrance gate mechanism intermittent",
    timestamp: "Yesterday",
    reportedBy: "Emily Rodriguez",
    detailedDescription:
      "The automated entrance gate at the main ticketing area has been experiencing intermittent operation issues. The gate occasionally requires manual assistance to fully open or close. The issue does not prevent entry but may cause minor delays during peak visitor hours. Technical diagnostics suggest a worn drive belt that should be replaced during scheduled maintenance to prevent future failures.",
    status: "Under Review",
  },
];

// All incidents including resolved ones
export const allIncidents: Incident[] = [
  ...incidents,
  {
    id: "5",
    image:
      "https://www.zoo-mulhouse.com/wp-content/uploads/2018/04/Touraco-de-fisher-a-la-une.jpg",
    location: "Big Aviary - Bird Sanctuary",
    category: "Repair",
    priority: "Med",
    description: "Perch structure replaced successfully",
    timestamp: "3 days ago",
    reportedBy: "Sophie Laurent",
    detailedDescription:
      "The main perching structure in the Big Aviary showed signs of wear and potential instability. The structure has been fully replaced with reinforced materials to ensure the safety and comfort of our bird residents. Installation was completed without disrupting the birds, and the new structure meets all safety standards.",
    status: "Resolved",
  },
  {
    id: "6",
    image:
      "https://www.zoo-mulhouse.com/wp-content/uploads/2021/02/DSC2532_1920x1080.jpg",
    location: "Arctic Area - Polar Bears",
    category: "Cleaning",
    priority: "Med",
    description: "Pool filtration system maintenance completed",
    timestamp: "5 days ago",
    reportedBy: "Thomas Berger",
    detailedDescription:
      "Scheduled deep cleaning and maintenance of the polar bear pool filtration system. All filters were replaced, pipes cleaned, and water quality tested. The system is now operating at optimal efficiency, ensuring the best possible water conditions for the polar bears.",
    status: "Resolved",
  },
  {
    id: "7",
    image:
      "https://www.zoo-mulhouse.com/wp-content/uploads/2018/04/zebre-de-grevy-20-1.jpg",
    location: "African Savanna - Zebra Enclosure",
    category: "Safety",
    priority: "High",
    description: "Emergency fence repair completed",
    timestamp: "1 week ago",
    reportedBy: "Marcus Williams",
    detailedDescription:
      "A section of the zebra enclosure fence was damaged during severe weather. Emergency repairs were completed within 24 hours, with full fence integrity restored. Additional reinforcement was added to prevent similar issues in the future. All safety inspections passed.",
    status: "Resolved",
  },
  {
    id: "8",
    image:
      "https://www.zoo-mulhouse.com/wp-content/uploads/2019/05/auberge.gif",
    location: "Picnic Area",
    category: "Repair",
    priority: "Low",
    description: "Picnic tables refurbished",
    timestamp: "1 week ago",
    reportedBy: "Anna Schmidt",
    detailedDescription:
      "Six picnic tables in the main picnic area were showing signs of weathering and needed refurbishment. All tables have been sanded, treated, and re-sealed. They are now ready for visitor use and should remain in excellent condition through the season.",
    status: "Resolved",
  },
  {
    id: "9",
    image:
      "https://www.ote-ingenierie.com/wp-content/uploads/2019/04/img-0472-scaled.jpg",
    location: "Little Amazonia - Tropical House",
    category: "Repair",
    priority: "Med",
    description: "Climate control system repaired",
    timestamp: "2 weeks ago",
    reportedBy: "Carlos Rivera",
    detailedDescription:
      "The temperature and humidity control system in the Little Amazonia tropical house experienced a malfunction. The issue was traced to a faulty sensor which has been replaced. The system is now maintaining optimal tropical conditions for all plants and animals.",
    status: "Resolved",
  },
];

const priorityColors = {
  High: "bg-red-100 text-red-700 border-red-300",
  Med: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300",
};

const categoryColors = {
  Safety: "bg-red-50 text-red-700",
  Cleaning: "bg-blue-50 text-blue-700",
  Repair: "bg-orange-50 text-orange-700",
};

interface IncidentFeedProps {
  onIncidentClick: (incident: Incident) => void;
  onViewAll: () => void;
}

export function IncidentFeed({
  onIncidentClick,
  onViewAll,
}: IncidentFeedProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800">Recent Incident Feed</h3>
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
        {incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onIncidentClick(incident)}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={incident.image}
                  alt={incident.location}
                  className="w-20 h-20 rounded-md object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-slate-900 font-medium truncate">
                    {incident.location}
                  </h4>
                  <Badge
                    className={`${priorityColors[incident.priority]} border flex-shrink-0`}
                  >
                    {incident.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className={
                      categoryColors[incident.category]
                    }
                  >
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