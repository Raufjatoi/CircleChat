import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2 } from "lucide-react";
import { getVoiceForCharacter } from "@/lib/voiceService";

interface VoiceSettingsProps {
  characterId: string;
  isVoiceEnabled: boolean;
  onToggleVoice: (enabled: boolean) => void;
}

const VoiceSettings = ({ characterId, isVoiceEnabled, onToggleVoice }: VoiceSettingsProps) => {
  const voiceMapping = getVoiceForCharacter(characterId);
  
  return (
    <div className="flex items-center space-x-2">
      <Volume2 size={16} className="text-white/70" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <Switch 
            id="voice-mode" 
            checked={isVoiceEnabled}
            onCheckedChange={onToggleVoice}
          />
          <Label htmlFor="voice-mode">Voice</Label>
        </div>
        {isVoiceEnabled && voiceMapping && (
          <span className="text-xs text-white/50">Using {voiceMapping.voiceName}</span>
        )}
      </div>
    </div>
  );
};

export default VoiceSettings;