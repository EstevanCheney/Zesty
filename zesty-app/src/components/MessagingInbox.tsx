import { useState } from "react";
import { X, Search, Plus, ArrowLeft, Send, Paperclip, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  sender: string;
  senderInitials: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  avatar?: string;
}

interface ConversationMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    senderInitials: "SJ",
    preview: "Hey, can you check the tiger enclosure report? I think there's an issue with...",
    timestamp: "10:23 AM",
    unread: true,
  },
  {
    id: "2",
    sender: "Mike Chen",
    senderInitials: "MC",
    preview: "Thanks for updating the maintenance schedule. Looks good!",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    sender: "Emma Davis",
    senderInitials: "ED",
    preview: "The new cleaning supplies arrived. Should I store them in the usual place?",
    timestamp: "Yesterday",
    unread: true,
  },
  {
    id: "4",
    sender: "James Wilson",
    senderInitials: "JW",
    preview: "Meeting rescheduled to 3 PM tomorrow",
    timestamp: "Tuesday",
    unread: false,
  },
  {
    id: "5",
    sender: "Lisa Martinez",
    senderInitials: "LM",
    preview: "I've completed the safety inspection for the bird sanctuary.",
    timestamp: "Monday",
    unread: false,
  },
];

const mockConversations: Record<string, ConversationMessage[]> = {
  "1": [
    {
      id: "c1-1",
      sender: "Sarah Johnson",
      content: "Hey John! Can you check the tiger enclosure report?",
      timestamp: "10:20 AM",
      isCurrentUser: false,
    },
    {
      id: "c1-2",
      sender: "Sarah Johnson",
      content: "I think there's an issue with the water filtration system mentioned in the report.",
      timestamp: "10:21 AM",
      isCurrentUser: false,
    },
    {
      id: "c1-3",
      sender: "John Smith",
      content: "Sure, let me take a look at it right now.",
      timestamp: "10:22 AM",
      isCurrentUser: true,
    },
    {
      id: "c1-4",
      sender: "Sarah Johnson",
      content: "Thanks! Let me know if you need any additional information.",
      timestamp: "10:23 AM",
      isCurrentUser: false,
    },
  ],
  "2": [
    {
      id: "c2-1",
      sender: "John Smith",
      content: "Hi Mike, I've updated the maintenance schedule for next week.",
      timestamp: "Yesterday, 2:15 PM",
      isCurrentUser: true,
    },
    {
      id: "c2-2",
      sender: "Mike Chen",
      content: "Thanks for updating the maintenance schedule. Looks good!",
      timestamp: "Yesterday, 2:45 PM",
      isCurrentUser: false,
    },
    {
      id: "c2-3",
      sender: "Mike Chen",
      content: "I noticed you scheduled the elephant exhibit maintenance for Wednesday. That works perfectly with our timeline.",
      timestamp: "Yesterday, 2:46 PM",
      isCurrentUser: false,
    },
  ],
  "3": [
    {
      id: "c3-1",
      sender: "Emma Davis",
      content: "Hey! The new cleaning supplies arrived.",
      timestamp: "Yesterday, 11:30 AM",
      isCurrentUser: false,
    },
    {
      id: "c3-2",
      sender: "Emma Davis",
      content: "Should I store them in the usual place?",
      timestamp: "Yesterday, 11:31 AM",
      isCurrentUser: false,
    },
  ],
  "4": [
    {
      id: "c4-1",
      sender: "James Wilson",
      content: "Hi everyone, I need to reschedule our team meeting.",
      timestamp: "Tuesday, 4:20 PM",
      isCurrentUser: false,
    },
    {
      id: "c4-2",
      sender: "James Wilson",
      content: "Meeting rescheduled to 3 PM tomorrow. Hope that works for everyone!",
      timestamp: "Tuesday, 4:22 PM",
      isCurrentUser: false,
    },
    {
      id: "c4-3",
      sender: "John Smith",
      content: "Works for me, thanks for the heads up!",
      timestamp: "Tuesday, 4:25 PM",
      isCurrentUser: true,
    },
  ],
  "5": [
    {
      id: "c5-1",
      sender: "Lisa Martinez",
      content: "Good afternoon! I've completed the safety inspection for the bird sanctuary.",
      timestamp: "Monday, 3:45 PM",
      isCurrentUser: false,
    },
    {
      id: "c5-2",
      sender: "Lisa Martinez",
      content: "Everything looks good, no major issues found. Report will be ready by end of day.",
      timestamp: "Monday, 3:46 PM",
      isCurrentUser: false,
    },
    {
      id: "c5-3",
      sender: "John Smith",
      content: "Great work Lisa! Thanks for the quick turnaround.",
      timestamp: "Monday, 4:10 PM",
      isCurrentUser: true,
    },
  ],
};

interface MessagingInboxProps {
  onClose: () => void;
  onNewMessage: () => void;
}

export function MessagingInbox({ onClose, onNewMessage }: MessagingInboxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessageText, setNewMessageText] = useState("");

  const filteredMessages = mockMessages.filter((msg) =>
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const handleSendMessage = () => {
    if (newMessageText.trim()) {
      // In a real app, this would send the message
      console.log("Sending message:", newMessageText);
      setNewMessageText("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl text-slate-900">Messages</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages List */}
          <div className={`${selectedMessage ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-slate-200`}>
            {/* Search and New Message Button */}
            <div className="p-4 space-y-3 border-b border-slate-200">
              <Button
                onClick={onNewMessage}
                className="w-full bg-[#2D5A27] hover:bg-[#234520] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Message List */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-slate-100">
                {filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                      message.unread ? "bg-blue-50/50" : ""
                    } ${selectedMessage?.id === message.id ? "bg-slate-100" : ""}`}
                  >
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className={`${message.unread ? 'bg-[#2D5A27] text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {message.senderInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${message.unread ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                            {message.sender}
                          </span>
                          <span className="text-xs text-slate-500">{message.timestamp}</span>
                        </div>
                        <p className={`text-sm text-slate-600 truncate ${message.unread ? 'font-medium' : ''}`}>
                          {message.preview}
                        </p>
                      </div>
                      {message.unread && (
                        <div className="w-2 h-2 bg-[#2D5A27] rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Conversation View */}
          <div className={`${selectedMessage ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {selectedMessage ? (
              <>
                {/* Conversation Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#2D5A27] text-white">
                        {selectedMessage.senderInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm text-slate-900">{selectedMessage.sender}</div>
                      <div className="text-xs text-slate-500">Active now</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {mockConversations[selectedMessage.id]?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] ${msg.isCurrentUser ? "order-2" : "order-1"}`}>
                          {!msg.isCurrentUser && (
                            <div className="text-xs text-slate-600 mb-1">{msg.sender}</div>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.isCurrentUser
                                ? "bg-[#2D5A27] text-white"
                                : "bg-slate-100 text-slate-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{msg.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200">
                  <div className="flex items-end gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <Textarea
                      placeholder="Type a message..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 min-h-[44px] max-h-32 resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessageText.trim()}
                      className="bg-[#2D5A27] hover:bg-[#234520] text-white h-11"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm">Select a message to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
