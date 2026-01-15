import { useEffect, useState } from "react";
import { Trees, Calendar, Mail, Settings, MessageSquare, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { supabase } from "../lib/supabase";

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
  const [name, setName] = useState("Chargement...");
  const [initials, setInitials] = useState("..");

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const displayName = profile?.full_name || user.email || "Staff";
      setName(displayName);

      const calculatedInitials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      
      setInitials(calculatedInitials);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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

        {/* Droite : Messages et Profil */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMessagesClick}
            className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-2 transition-colors outline-none">
                <Avatar className="w-9 h-9 border-2 border-[#2D5A27]">
                  <AvatarFallback className="bg-[#2D5A27] text-white text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <span className="block text-sm text-slate-700 font-medium">{name}</span>
                  <span className="block text-xs text-slate-500">Staff</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={onWorkScheduleClick}>
                <Calendar className="w-4 h-4 mr-2" />
                Planning
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onColleagueDirectoryClick}>
                <Mail className="w-4 h-4 mr-2" />
                Annuaire
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onAccountSettingsClick}>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}