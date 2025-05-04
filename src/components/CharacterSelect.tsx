
import { useState } from "react";
import { CharacterTheme, getAllCharacters, removeCustomCharacter } from "@/lib/themes";
import { Check, Plus, Trash2 } from "lucide-react";
import AddCharacterModal from "./AddCharacterModal";

interface CharacterSelectProps {
  onSelect: (character: CharacterTheme) => void;
  selectedCharacter: CharacterTheme;
}

const CharacterSelect = ({ onSelect, selectedCharacter }: CharacterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allCharacters, setAllCharacters] = useState(getAllCharacters());
  
  const handleAddCharacter = () => {
    setIsOpen(false);
    setIsAddModalOpen(true);
  };
  
  const handleCharacterAdded = () => {
    // Refresh the character list
    setAllCharacters(getAllCharacters());
  };
  
  const handleRemoveCharacter = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeCustomCharacter(id);
    setAllCharacters(getAllCharacters());
    
    // If the currently selected character was removed, select the default
    if (selectedCharacter.id === id) {
      onSelect(allCharacters[0]);
    }
  };
  
  return (
    <div className="relative z-10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-theme-primary/20 border border-white/10 rounded-lg hover:bg-theme-primary/30 transition-colors"
      >
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: selectedCharacter.primaryColor }}
        ></div>
        {selectedCharacter.name}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-lg bg-black border border-white/10 shadow-lg p-1 animate-fade-in">
          {allCharacters.map((character) => (
            <div
              key={character.id}
              className={`w-full text-left px-4 py-2 flex items-center justify-between rounded-md hover:bg-white/10 transition-colors ${
                selectedCharacter.id === character.id ? "bg-white/5" : ""
              }`}
              onClick={() => {
                onSelect(character);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: character.primaryColor }}
                ></div>
                <span>{character.name}</span>
              </div>
              
              <div className="flex items-center">
                {selectedCharacter.id === character.id && (
                  <Check size={16} className="text-green-400" />
                )}
                
                {character.isCustom && (
                  <button
                    onClick={(e) => handleRemoveCharacter(e, character.id)}
                    className="ml-2 text-white/50 hover:text-white/90 transition-colors"
                    aria-label="Remove character"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Custom Character Button */}
          <div
            className="w-full text-left px-4 py-2 flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-md mt-1 border-t border-white/10 cursor-pointer"
            onClick={handleAddCharacter}
          >
            <Plus size={16} />
            <span>Create Custom Character</span>
          </div>
        </div>
      )}
      
      <AddCharacterModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCharacterAdded={handleCharacterAdded}
      />
    </div>
  );
};

export default CharacterSelect;


