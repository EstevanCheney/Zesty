import { useState, useEffect } from "react";
import { X, Search, Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  department: string;
}

export function NewMessageDialog({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedColleague, setSelectedColleague] = useState<Profile | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '');
      
      if (data) setProfiles(data);
      setLoadingProfiles(false);
    }
    fetchData();
  }, []);

  const filteredColleagues = profiles.filter((p) =>
    (p.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!selectedColleague || !messageText.trim() || !currentUserId) return;
    setSending(true);

    try {
      const { error } = await supabase.from('messages').insert({
        content: messageText,
        sender_id: currentUserId,
        receiver_id: selectedColleague.id,
        is_read: false
      });

      if (error) throw error;
      
      toast.success("Message envoyé !");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur : " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Nouveau Message</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {!selectedColleague ? (
            <div className="flex flex-col h-full">
              <Label className="mb-2 text-slate-700">À qui voulez-vous écrire ?</Label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un membre du staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              
              <ScrollArea className="flex-1 border rounded-md">
                <div className="p-2">
                  {loadingProfiles ? (
                    <div className="p-4 text-center text-slate-500">Chargement...</div>
                  ) : filteredColleagues.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">Aucun collègue trouvé.</div>
                  ) : (
                    filteredColleagues.map((colleague) => (
                      <button
                        key={colleague.id}
                        onClick={() => setSelectedColleague(colleague)}
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarFallback className="bg-[#2D5A27] text-white font-medium">
                            {colleague.full_name?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{colleague.full_name}</div>
                          <div className="text-xs text-slate-500">{colleague.role || "Staff"} • {colleague.department || "General"}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#2D5A27] text-white text-xs">
                      {selectedColleague.full_name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-slate-900">Pour : {selectedColleague.full_name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedColleague(null)}>
                  Changer
                </Button>
              </div>

              <Textarea
                placeholder={`Écrivez votre message à ${selectedColleague.full_name}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 resize-none p-4 text-base"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-lg">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button
            onClick={handleSendMessage}
            disabled={!selectedColleague || !messageText.trim() || sending}
            className="bg-[#2D5A27] hover:bg-[#1f3f1c] text-white min-w-[100px]"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Envoyer</>}
          </Button>
        </div>
      </div>
    </div>
  );
}