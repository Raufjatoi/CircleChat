
import { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CharacterTheme } from "@/lib/themes";
import { Message, ResponseLength, createNewAssistantMessage, createNewUserMessage, createSystemMessage, generateChatResponse } from "@/lib/chatApi";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import CharacterSelect from "@/components/CharacterSelect";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { CharacterContext } from "@/contexts/CharacterContext";
import VoiceSettings from "@/components/VoiceSettings";

// Number of previous messages to include when memory is enabled
const MEMORY_MESSAGE_COUNT = 5;

const Index = () => {
  const { character, setCharacter } = useContext(CharacterContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Get API key from Vite environment variable
  const [groqApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || "");
  const [isApiKeySet] = useState(!!import.meta.env.VITE_GROQ_API_KEY);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  useEffect(() => {
    if (!isApiKeySet) {
      toast({
        title: "API Key Missing",
        description: "Please set your VITE_GROQ_API_KEY in the .env file",
        variant: "destructive",
      });
    }
  }, [isApiKeySet, toast]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (content: string, responseLength: ResponseLength, useMemory: boolean) => {
    if (!content.trim() || isLoading) return;
    
    if (!isApiKeySet) {
      toast({
        title: "API Key Missing",
        description: "Please set your VITE_GROQ_API_KEY in the .env file",
        variant: "destructive",
      });
      return;
    }

    const newUserMessage = createNewUserMessage(content);
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Filter messages to include in the API request
      let messagesToInclude = messages.filter(msg => msg.role !== 'system');
      
      // If memory is disabled, only include the most recent message pair (if any)
      if (!useMemory && messagesToInclude.length > 0) {
        // Find the last assistant message, if any
        const lastAssistantIndex = [...messagesToInclude].reverse().findIndex(msg => msg.role === 'assistant');
        
        if (lastAssistantIndex !== -1) {
          // If there's a previous assistant message, include it and the user message before it
          const startIndex = messagesToInclude.length - lastAssistantIndex - 1;
          // Include the last user-assistant pair (2 messages)
          messagesToInclude = messagesToInclude.slice(
            startIndex >= 1 ? startIndex - 1 : startIndex, 
            messagesToInclude.length
          );
        } else {
          // If no assistant message, don't include any history
          messagesToInclude = [];
        }
      } else if (useMemory) {
        // With memory enabled, include the last MEMORY_MESSAGE_COUNT messages
        messagesToInclude = messagesToInclude.slice(-MEMORY_MESSAGE_COUNT);
      }
      
      // Create the messages array for the API
      const apiMessages = [
        createSystemMessage(character),
        ...messagesToInclude.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user' as const, content }
      ];

      // Generate response from Groq API with specified response length
      const response = await generateChatResponse(apiMessages, groqApiKey, responseLength);
      
      // Create new assistant message
      const newAssistantMessage = createNewAssistantMessage(response);
      setMessages((prev) => [...prev, newAssistantMessage]);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleChangeCharacter = (newCharacter: CharacterTheme) => {
    setCharacter(newCharacter);
    // Clear messages when changing character
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-500"
         style={{ backgroundColor: character.backgroundColor }}>
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative flex justify-between items-center p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full bg-gray-500" 
              // Removed the dynamic style that was using character.primaryColor
            ></div>
            <h1 className="text-xl font-medium">Circle Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <CharacterSelect 
              onSelect={handleChangeCharacter}
              selectedCharacter={character}
            />
          </div>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div 
                className="w-16 h-16 rounded-full mb-6 animate-pulse-slow transition-colors duration-300"
                style={{ 
                  backgroundColor: character.primaryColor,
                  animationDuration: "4s"
                }}
              ></div>
              <h2 className="text-2xl font-bold mb-2">Chat with {character.name}</h2>
              <p className="text-white/70 max-w-md mb-8">
                I'll respond to you as {character.personality}. Ask me anything!
              </p>
              <div className="flex flex-col items-center gap-2 text-white/70">
                <span>Choose response length: Short (20 words), Medium (100 words), or Long (1000+ words)</span>
                <span>Toggle memory to make the AI remember previous messages</span>
              </div>
            </div>
          )}
          
          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  isVoiceEnabled={isVoiceEnabled}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Chat Input */}
          <div className="flex items-center justify-between mb-2">
            <VoiceSettings 
              characterId={character.id}
              isVoiceEnabled={isVoiceEnabled}
              onToggleVoice={setIsVoiceEnabled}
            />
            {/* Other settings components can go here */}
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;














