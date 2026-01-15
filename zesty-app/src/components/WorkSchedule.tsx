import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Shift {
  id: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  role: string;
  status: "upcoming" | "completed" | "today";
}

const mockShifts: Shift[] = [
  {
    id: "1",
    date: "Jan 15",
    day: "Today",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    duration: "8 hours",
    location: "Primate Section",
    role: "Maintenance Supervisor",
    status: "today",
  },
  {
    id: "2",
    date: "Jan 16",
    day: "Thu",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    duration: "8 hours",
    location: "African Savanna",
    role: "Maintenance Supervisor",
    status: "upcoming",
  },
  {
    id: "3",
    date: "Jan 17",
    day: "Fri",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    duration: "8 hours",
    location: "Reptile House",
    role: "Maintenance Supervisor",
    status: "upcoming",
  },
  {
    id: "4",
    date: "Jan 18",
    day: "Sat",
    startTime: "07:00 AM",
    endTime: "03:00 PM",
    duration: "8 hours",
    location: "Aquarium",
    role: "Weekend Supervisor",
    status: "upcoming",
  },
  {
    id: "5",
    date: "Jan 19",
    day: "Sun",
    startTime: "OFF",
    endTime: "",
    duration: "Day Off",
    location: "-",
    role: "-",
    status: "upcoming",
  },
  {
    id: "6",
    date: "Jan 20",
    day: "Mon",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    duration: "8 hours",
    location: "Bird Sanctuary",
    role: "Maintenance Supervisor",
    status: "upcoming",
  },
  {
    id: "7",
    date: "Jan 21",
    day: "Tue",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    duration: "8 hours",
    location: "Main Entrance",
    role: "Maintenance Supervisor",
    status: "upcoming",
  },
];

interface WorkScheduleProps {
  onBack?: () => void;
}

export function WorkSchedule({ onBack }: WorkScheduleProps) {
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
          <h1 className="text-slate-900 mb-1">My Work Schedule</h1>
          <p className="text-sm text-slate-500">View your upcoming shifts and work assignments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-500 font-normal">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-slate-900 font-semibold">40 hours</div>
              <p className="text-xs text-slate-500 mt-1">5 shifts scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-500 font-normal">Next Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-slate-900 font-semibold">Today</div>
              <p className="text-xs text-slate-500 mt-1">8:00 AM - 4:00 PM</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-500 font-normal">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-slate-900 font-semibold">160 hours</div>
              <p className="text-xs text-slate-500 mt-1">20 shifts total</p>
            </CardContent>
          </Card>
        </div>

        {/* Shifts List */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {mockShifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`p-4 hover:bg-slate-50 transition-colors ${
                    shift.status === "today" ? "bg-[#2D5A27]/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* Date */}
                      <div className="text-center min-w-[60px]">
                        <div className="text-xs text-slate-500 uppercase">{shift.day}</div>
                        <div className="text-sm text-slate-900 font-semibold mt-1">
                          {shift.date}
                        </div>
                      </div>

                      {/* Shift Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-slate-900 font-medium">{shift.role}</span>
                          {shift.status === "today" && (
                            <Badge className="bg-[#2D5A27] text-white">Today</Badge>
                          )}
                          {shift.startTime === "OFF" && (
                            <Badge variant="outline" className="bg-slate-50">Day Off</Badge>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          {shift.startTime !== "OFF" && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Clock className="w-3 h-3" />
                              <span>
                                {shift.startTime} - {shift.endTime} ({shift.duration})
                              </span>
                            </div>
                          )}
                          {shift.location !== "-" && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <MapPin className="w-3 h-3" />
                              <span>{shift.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}