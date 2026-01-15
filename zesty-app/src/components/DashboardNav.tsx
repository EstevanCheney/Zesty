import { Trees, Calendar, Mail, Settings, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface DashboardNavProps {
  onMessagesClick: () => void;
  onWorkScheduleClick?: () => void;
  onColleagueDirectoryClick?: () => void;
  onAccountSettingsClick?: () => void;
}

export function DashboardNav({ 
  onMessagesClick,
  onWorkScheduleClick,
  onColleagueDirectoryClick,
  onAccountSettingsClick 
}: DashboardNavProps) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D5A27] rounded-lg flex items-center justify-center">
            <Trees className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg text-[#2D5A27] font-semibold">Zoo Management</div>
            <div className="text-xs text-slate-500">Maintenance & Operations</div>
          </div>
        </div>

        {/* Right side: Messages Icon and Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Messages Icon */}
          <button
            onClick={onMessagesClick}
            className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-slate-600" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-2 transition-colors">
                <Avatar className="w-9 h-9 border-2 border-[#2D5A27]">
                  <AvatarFallback className="bg-[#2D5A27] text-white">
                    JS
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-slate-700">John Smith</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={onWorkScheduleClick}>
                <Calendar className="w-4 h-4 mr-2" />
                My Work Schedule
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onColleagueDirectoryClick}>
                <Mail className="w-4 h-4 mr-2" />
                Colleague Directory (Mails)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onAccountSettingsClick}>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}