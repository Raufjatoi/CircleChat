import { Voice } from 'elevenlabs-node';

// Define voice IDs for different characters
export interface VoiceMapping {
  characterId: string;
  voiceId: string;
  voiceName: string;
}

// Map character IDs to ElevenLabs voice IDs
export const characterVoices: VoiceMapping[] = [
  {
    characterId: "default",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Adam
    voiceName: "Adam"
  },
  {
    characterId: "batman",
    voiceId: "VR6AewLTigWG4xSOukaG", // Batman
    voiceName: "Deep Male Voice"
  },
  {
    characterId: "superman",
    voiceId: "pNInz6obpgDQGcFmaJgB", // Superman
    voiceName: "Heroic Male Voice"
  },
  {
    characterId: "godfather",
    voiceId: "N2lVS1w4EtoT3dr4eOWO", // Godfather
    voiceName: "Raspy Italian Accent"
  },
  {
    characterId: "eren-yeager",
    voiceId: "yoZ06aMxZJJ28mfd3POQ", // Eren
    voiceName: "Young Male Voice"
  },
  {
    characterId: "jinx",
    voiceId: "jBpfuIE2acCO8z3wKNLl", // Jinx
    voiceName: "Energetic Female Voice"
  }
];

// Get voice ID for a character
export function getVoiceForCharacter(characterId: string): VoiceMapping | undefined {
  return characterVoices.find(voice => voice.characterId === characterId);
}

// Generate speech using ElevenLabs API
export async function generateSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  const apiKey = import.meta.env.VITE_ELEVEN_LAB_KEY;
  
  if (!apiKey) {
    throw new Error("ElevenLabs API key is not set");
  }

  // Limit text length to save credits (max 300 characters)
  const limitedText = text.length > 300 ? text.substring(0, 297) + "..." : text;
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: limitedText,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API request failed with status ${response.status}`);
  }

  return await response.arrayBuffer();
}

// Play audio from ArrayBuffer
export function playAudio(audioData: ArrayBuffer): HTMLAudioElement {
  const blob = new Blob([audioData], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  audio.onended = () => {
    URL.revokeObjectURL(url);
  };
  
  audio.play();
  return audio;
}