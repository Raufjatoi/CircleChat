import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { CharacterTheme, addCustomCharacter } from "@/lib/themes";
import { X } from "lucide-react";

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterAdded: () => void;
}

const AddCharacterModal = ({ isOpen, onClose, onCharacterAdded }: AddCharacterModalProps) => {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6D28D9");
  const [secondaryColor, setSecondaryColor] = useState("#4C1D95");
  const [backgroundColor, setBackgroundColor] = useState("#1E1B4B");
  const [accentColor, setAccentColor] = useState("#C4B5FD");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !personality || !systemPrompt) return;
    
    const newCharacter: CharacterTheme = {
      id: `custom-${Date.now()}`,
      name,
      personality,
      systemPrompt,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor: "#FFFFFF", // Default white text
      accentColor,
      isCustom: true
    };
    
    addCustomCharacter(newCharacter);
    onCharacterAdded();
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName("");
    setPersonality("");
    setSystemPrompt("");
    setPrimaryColor("#6D28D9");
    setSecondaryColor("#4C1D95");
    setBackgroundColor("#1E1B4B");
    setAccentColor("#C4B5FD");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Custom Character</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Character Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sherlock Holmes"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Personality Description</label>
            <Input
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g., the brilliant detective with exceptional deductive reasoning"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Detailed instructions for how the AI should behave as this character..."
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 p-1 bg-transparent"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 p-1 bg-transparent"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 p-1 bg-transparent"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Accent Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 p-1 bg-transparent"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="bg-gray-800 text-white border-gray-700">
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Character
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCharacterModal;
