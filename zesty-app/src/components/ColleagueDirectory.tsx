import { useState } from "react";
import { Search, Mail, Phone, MapPin, Briefcase, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Colleague {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: "available" | "busy" | "away";
}

const mockColleagues: Colleague[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Senior Zookeeper",
    department: "Animal Care",
    email: "sarah.johnson@zoo.com",
    phone: "(555) 123-4567",
    location: "Primate Section",
    status: "available",
  },
  {
    id: "2",
    name: "Michael Chen",
    initials: "MC",
    role: "Veterinarian",
    department: "Medical",
    email: "michael.chen@zoo.com",
    phone: "(555) 234-5678",
    location: "Veterinary Clinic",
    status: "busy",
  },
  {
    id: "3",
    name: "Emma Davis",
    initials: "ED",
    role: "Maintenance Lead",
    department: "Operations",
    email: "emma.davis@zoo.com",
    phone: "(555) 345-6789",
    location: "Maintenance Office",
    status: "available",
  },
  {
    id: "4",
    name: "James Wilson",
    initials: "JW",
    role: "Curator",
    department: "Animal Care",
    email: "james.wilson@zoo.com",
    phone: "(555) 456-7890",
    location: "Reptile House",
    status: "away",
  },
  {
    id: "5",
    name: "Lisa Martinez",
    initials: "LM",
    role: "Education Coordinator",
    department: "Education",
    email: "lisa.martinez@zoo.com",
    phone: "(555) 567-8901",
    location: "Education Center",
    status: "available",
  },
  {
    id: "6",
    name: "Robert Taylor",
    initials: "RT",
    role: "Security Chief",
    department: "Security",
    email: "robert.taylor@zoo.com",
    phone: "(555) 678-9012",
    location: "Security Office",
    status: "available",
  },
  {
    id: "7",
    name: "Amanda Brown",
    initials: "AB",
    role: "Zookeeper",
    department: "Animal Care",
    email: "amanda.brown@zoo.com",
    phone: "(555) 789-0123",
    location: "African Savanna",
    status: "busy",
  },
  {
    id: "8",
    name: "David Kim",
    initials: "DK",
    role: "Groundskeeper",
    department: "Operations",
    email: "david.kim@zoo.com",
    phone: "(555) 890-1234",
    location: "Gardens",
    status: "available",
  },
  {
    id: "9",
    name: "Jennifer Lee",
    initials: "JL",
    role: "Nutritionist",
    department: "Animal Care",
    email: "jennifer.lee@zoo.com",
    phone: "(555) 901-2345",
    location: "Feed Prep Kitchen",
    status: "available",
  },
  {
    id: "10",
    name: "Christopher White",
    initials: "CW",
    role: "Operations Manager",
    department: "Operations",
    email: "chris.white@zoo.com",
    phone: "(555) 012-3456",
    location: "Administration",
    status: "away",
  },
];

const statusColors = {
  available: "bg-green-500",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

interface ColleagueDirectoryProps {
  onBack?: () => void;
}

export function ColleagueDirectory({ onBack }: ColleagueDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredColleagues = mockColleagues.filter((colleague) => {
    const query = searchQuery.toLowerCase();
    return (
      colleague.name.toLowerCase().includes(query) ||
      colleague.role.toLowerCase().includes(query) ||
      colleague.department.toLowerCase().includes(query) ||
      colleague.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6">
        {/* Back Button */}
        {onBack && (
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-slate-900 mb-1">Colleague Directory</h1>
          <p className="text-sm text-slate-500">
            Find and contact your colleagues across all departments
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, role, department, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500 mb-1">Total Staff</div>
              <div className="text-2xl text-slate-900 font-semibold">{mockColleagues.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500 mb-1">Available</div>
              <div className="text-2xl text-green-600 font-semibold">
                {mockColleagues.filter((c) => c.status === "available").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500 mb-1">Busy</div>
              <div className="text-2xl text-red-600 font-semibold">
                {mockColleagues.filter((c) => c.status === "busy").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500 mb-1">Away</div>
              <div className="text-2xl text-yellow-600 font-semibold">
                {mockColleagues.filter((c) => c.status === "away").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colleagues List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredColleagues.map((colleague) => (
            <Card key={colleague.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar with Status */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-[#2D5A27]">
                      <AvatarFallback className="bg-[#2D5A27] text-white">
                        {colleague.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        statusColors[colleague.status]
                      }`}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm text-slate-900 font-semibold">
                          {colleague.name}
                        </h3>
                        <p className="text-xs text-slate-600">{colleague.role}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {colleague.department}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <a
                          href={`mailto:${colleague.email}`}
                          className="hover:text-[#2D5A27] truncate"
                        >
                          {colleague.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <a href={`tel:${colleague.phone}`} className="hover:text-[#2D5A27]">
                          {colleague.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{colleague.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredColleagues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No colleagues found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}