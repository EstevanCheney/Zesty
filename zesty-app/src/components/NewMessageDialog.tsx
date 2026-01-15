import { useState } from "react";
import { X, Send, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface Colleague {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
}

const mockColleagues: Colleague[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Senior Maintenance Supervisor",
    department: "Maintenance",
  },
  {
    id: "2",
    name: "Mike Chen",
    initials: "MC",
    role: "Operations Manager",
    department: "Operations",
  },
  {
    id: "3",
    name: "Emma Davis",
    initials: "ED",
    role: "Facilities Coordinator",
    department: "Facilities",
  },
  {
    id: "4",
    name: "James Wilson",
    initials: "JW",
    role: "Team Lead",
    department: "Maintenance",
  },
  {
    id: "5",
    name: "Lisa Martinez",
    initials: "LM",
    role: "Safety Inspector",
    department: "Safety & Compliance",
  },
  {
    id: "6",
    name: "David Brown",
    initials: "DB",
    role: "Maintenance Technician",
    department: "Maintenance",
  },
  {
    id: "7",
    name: "Rachel Green",
    initials: "RG",
    role: "Cleaning Supervisor",
    department: "Facilities",
  },
  {
    id: "8",
    name: "Tom Anderson",
    initials: "TA",
    role: "Equipment Manager",
    department: "Operations",
  },
];

interface NewMessageDialogProps {
  onClose: () => void;
}

export function NewMessageDialog({ onClose }: NewMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredColleagues = mockColleagues.filter(
    (colleague) =>
      colleague.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleColleagueSelect = (colleague: Colleague) => {
    setSelectedColleague(colleague);
    setSearchQuery(colleague.name);
    setShowResults(false);
  };

  const handleSendMessage = () => {
    if (selectedColleague && messageText.trim()) {
      // In a real app, this would send the message
      console.log("Sending message to:", selectedColleague.name, "Message:", messageText);
      // Close the dialog after sending
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl text-slate-900">New Message</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* To Field */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700">To:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                  if (!e.target.value) {
                    setSelectedColleague(null);
                  }
                }}
                onFocus={() => setShowResults(true)}
                className="pl-10"
              />

              {/* Search Results Dropdown */}
              {showResults && searchQuery && filteredColleagues.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-hidden">
                  <ScrollArea className="max-h-64">
                    {filteredColleagues.map((colleague) => (
                      <button
                        key={colleague.id}
                        onClick={() => handleColleagueSelect(colleague)}
                        className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-100 last:border-b-0"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#2D5A27] text-white">
                            {colleague.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-900">{colleague.name}</div>
                          <div className="text-xs text-slate-600">{colleague.role}</div>
                          <div className="text-xs text-slate-500">{colleague.department}</div>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Selected Colleague Display */}
            {selectedColleague && !showResults && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#2D5A27] text-white">
                    {selectedColleague.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm text-slate-900">{selectedColleague.name}</div>
                  <div className="text-xs text-slate-600">{selectedColleague.role}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedColleague(null);
                    setSearchQuery("");
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700">Message:</label>
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!selectedColleague || !messageText.trim()}
            className="bg-[#2D5A27] hover:bg-[#234520] text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
