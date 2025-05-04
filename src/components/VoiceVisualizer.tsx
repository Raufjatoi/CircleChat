
import { useEffect, useState } from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
}

const VoiceVisualizer = ({ isActive }: VoiceVisualizerProps) => {
  const [bars] = useState(5);

  if (!isActive) {
    return null;
  }

  return (
    <div className="visualizer-container ml-2 inline-flex h-4">
      {Array.from({ length: bars }).map((_, i) => (
        <div 
          key={i} 
          className="visualizer-bar animate-voice-bar"
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: '100%',
            width: '2px',
            margin: '0 1px'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;


