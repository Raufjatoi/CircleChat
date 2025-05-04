
import { Message } from "@/lib/chatApi";
import { useContext, useState } from "react";
import { CharacterContext } from "@/contexts/CharacterContext";
import { Volume2, VolumeX } from "lucide-react";
import { generateSpeech, getVoiceForCharacter, playAudio } from "@/lib/voiceService";
import VoiceVisualizer from "./VoiceVisualizer";

interface ChatMessageProps {
  message: Message;
  isVoiceEnabled?: boolean;
}

const ChatMessage = ({ message, isVoiceEnabled = true }: ChatMessageProps) => {
  const { character } = useContext(CharacterContext);
  const isUser = message.role === "user";
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  const handleVoiceClick = async () => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }
    
    if (isUser) return;
    
    try {
      setIsPlaying(true);
      const voiceMapping = getVoiceForCharacter(character.id);
      
      if (!voiceMapping) {
        console.error("No voice mapping found for character:", character.id);
        setIsPlaying(false);
        return;
      }
      
      const audioData = await generateSpeech(message.content, voiceMapping.voiceId);
      const audio = playAudio(audioData);
      
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsPlaying(false);
    }
  };
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full mb-4 animate-fade-in`}>
      <div 
        className="rounded-lg p-4 max-w-[80%] shadow-md relative"
        style={{ 
          backgroundColor: isUser ? 'rgba(59, 130, 246, 0.3)' : `${character.primaryColor}30`,
          color: character.textColor
        }}
      >
        <p className="whitespace-pre-line">{message.content}</p>
        
        {!isUser && isVoiceEnabled && (
          <div className="mt-2 flex items-center">
            <button 
              onClick={handleVoiceClick}
              className="text-white/70 hover:text-white transition-colors"
              aria-label={isPlaying ? "Stop speaking" : "Speak message"}
            >
              {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <VoiceVisualizer isActive={isPlaying} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;






