
import { Message } from "@/lib/chatApi";
import { useContext } from "react";
import { CharacterContext } from "@/contexts/CharacterContext";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { character } = useContext(CharacterContext);
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full mb-4 animate-fade-in`}>
      <div 
        className="rounded-lg p-4 max-w-[80%] shadow-md"
        style={{ 
          backgroundColor: isUser ? 'rgba(59, 130, 246, 0.3)' : `${character.primaryColor}30`,
          color: character.textColor
        }}
      >
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;




