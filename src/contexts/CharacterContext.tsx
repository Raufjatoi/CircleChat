import React, { createContext, useState, ReactNode } from 'react';
import { CharacterTheme, getAllCharacters } from '@/lib/themes';

interface CharacterContextType {
  character: CharacterTheme;
  setCharacter: (character: CharacterTheme) => void;
}

export const CharacterContext = createContext<CharacterContextType>({
  character: getAllCharacters()[0],
  setCharacter: () => {},
});

interface CharacterProviderProps {
  children: ReactNode;
}

export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const [character, setCharacter] = useState<CharacterTheme>(getAllCharacters()[0]);

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};