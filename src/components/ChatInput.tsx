
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUp, MessageSquare, MessageCircle, FileText, MemoryStick } from "lucide-react";
import { ResponseLength } from "@/lib/chatApi";

interface ChatInputProps {
  onSendMessage: (message: string, responseLength: ResponseLength, useMemory: boolean) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [responseLength, setResponseLength] = useState<ResponseLength>("medium");
  const [useMemory, setUseMemory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message, responseLength, useMemory);
      setMessage("");
    }
  };

  return (
    <div className="mt-4">
      {/* Response Length Toggle */}
      <div className="flex justify-center mb-2">
        <div className="flex bg-black/20 rounded-lg p-1">
          <Button
            type="button"
            variant={responseLength === "short" ? "default" : "ghost"}
            className={`flex items-center gap-1 text-xs px-3 py-1 h-auto ${
              responseLength === "short" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setResponseLength("short")}
            title="Short response (20 words or less)"
          >
            <MessageSquare size={14} />
            <span>Short</span>
          </Button>
          <Button
            type="button"
            variant={responseLength === "medium" ? "default" : "ghost"}
            className={`flex items-center gap-1 text-xs px-3 py-1 h-auto ${
              responseLength === "medium" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setResponseLength("medium")}
            title="Medium response (around 100 words)"
          >
            <MessageCircle size={14} />
            <span>Medium</span>
          </Button>
          <Button
            type="button"
            variant={responseLength === "long" ? "default" : "ghost"}
            className={`flex items-center gap-1 text-xs px-3 py-1 h-auto ${
              responseLength === "long" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setResponseLength("long")}
            title="Long, detailed response (1000+ words)"
          >
            <FileText size={14} />
            <span>Long</span>
          </Button>
        </div>
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full p-3 pr-10 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-accent placeholder:text-white/50"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="button"
          onClick={() => setUseMemory(!useMemory)}
          className={`p-3 ${
            useMemory 
              ? "bg-theme-accent text-white" 
              : "bg-black/20 text-white/70 hover:bg-black/30"
          } rounded-lg transition-colors`}
          title={useMemory ? "Memory enabled (remembers past 5 messages)" : "Memory disabled"}
        >
          <MemoryStick size={18} />
        </Button>
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          className="bg-theme-primary hover:bg-theme-secondary text-theme-text transition-colors p-3"
        >
          <ArrowUp size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;


