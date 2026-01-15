import { useState, useEffect, useRef } from "react";
import { X, Search, Send, Loader2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
}

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export function MessagingInbox({ onClose, onNewMessage }: { onClose: () => void; onNewMessage: () => void }) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversationId, conversations]);

  async function loadMessages() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    const { data: profilesData } = await supabase.from('profiles').select('id, full_name');
    
    if (!messagesData || !profilesData) {
        setLoading(false);
        return;
    }

    const groups: Record<string, Message[]> = {};
    
    messagesData.forEach((msg: Message) => {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!groups[otherId]) groups[otherId] = [];
      groups[otherId].push(msg);
    });

    const convos: Conversation[] = Object.keys(groups).map(otherId => {
      const msgs = groups[otherId];
      const otherProfile = profilesData.find(p => p.id === otherId);
      const lastMsg = msgs[msgs.length - 1];
      
      return {
        otherUserId: otherId,
        otherUserName: otherProfile?.full_name || "Utilisateur inconnu",
        lastMessage: lastMsg.content,
        timestamp: new Date(lastMsg.created_at),
        messages: msgs
      };
    });

    convos.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setConversations(convos);
    setLoading(false);
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversationId || !currentUserId) return;

    try {
      const { error } = await supabase.from('messages').insert({
        content: replyText,
        sender_id: currentUserId,
        receiver_id: selectedConversationId,
      });

      if (error) throw error;
      
      setReplyText("");
      loadMessages();
    } catch (err) {
      toast.error("Erreur d'envoi");
    }
  };

  const activeConversation = conversations.find(c => c.otherUserId === selectedConversationId);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex overflow-hidden">
        
        {/* SIDEBAR : LISTE DES CONVERSATIONS */}
        <div className={`w-full md:w-1/3 border-r border-slate-200 flex flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Messages</h2>
            <button onClick={onClose} className="md:hidden p-2"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="p-4 border-b border-slate-200">
             <Button onClick={onNewMessage} className="w-full bg-[#2D5A27] hover:bg-[#1f3f1c] text-white">
                Nouveau Message
             </Button>
          </div>

          <ScrollArea className="flex-1">
            {loading ? (
               <div className="p-4 text-center text-slate-500">Chargement...</div>
            ) : conversations.length === 0 ? (
               <div className="p-8 text-center text-slate-500">
                  <p>Aucune conversation.</p>
                  <p className="text-xs mt-2">Commencez par envoyer un nouveau message !</p>
               </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.otherUserId}
                  onClick={() => setSelectedConversationId(conv.otherUserId)}
                  className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex gap-3 ${selectedConversationId === conv.otherUserId ? 'bg-green-50' : ''}`}
                >
                  <Avatar>
                    <AvatarFallback className="bg-[#2D5A27] text-white">
                      {conv.otherUserName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-medium text-slate-900 truncate">{conv.otherUserName}</span>
                      <span className="text-xs text-slate-500">{conv.timestamp.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </div>

        {/* MAIN : CHAT */}
        <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversationId && activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedConversationId(null)} className="md:hidden mr-2">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <Avatar>
                    <AvatarFallback className="bg-[#2D5A27] text-white">
                      {activeConversation.otherUserName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">{activeConversation.otherUserName}</h3>
                    <p className="text-xs text-slate-500">En ligne</p>
                  </div>
                </div>
                <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-200 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMe 
                          ? 'bg-[#2D5A27] text-white rounded-br-none' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendReply(); }}
                  className="flex gap-2"
                >
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Écrivez un message..." 
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!replyText.trim()} className="bg-[#2D5A27] text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 relative">
               <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-200 rounded-full md:block hidden">
                  <X className="w-5 h-5" />
               </button>
               <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-slate-400" />
               </div>
               <p>Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}