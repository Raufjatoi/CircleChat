
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
    <div className="visualizer-container my-2">
      {Array.from({ length: bars }).map((_, i) => (
        <div 
          key={i} 
          className={`visualizer-bar animate-wave-${i+1}`}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;

