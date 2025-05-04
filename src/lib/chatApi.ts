import { CharacterTheme } from "./themes";

interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ResponseLength = 'short' | 'medium' | 'long';

export const generateChatResponse = async (
  messages: ChatCompletionMessage[],
  apiKey: string,
  responseLength: ResponseLength = 'medium'
): Promise<string> => {
  try {
    // Set max tokens based on response length
    let maxTokens = 1024; // Default medium
    let systemPromptPrefix = '';
    
    if (responseLength === 'short') {
      maxTokens = 150;
      systemPromptPrefix = 'Keep your responses very brief, using 20 words or less. ';
    } else if (responseLength === 'long') {
      maxTokens = 2048;
      systemPromptPrefix = 'Provide detailed, comprehensive responses. ';
    } else {
      // Medium
      systemPromptPrefix = 'Provide moderately detailed responses of around 100 words. ';
    }
    
    // Check if memory is enabled (more than just the system message and current user message)
    const hasMemory = messages.length > 2;
    if (hasMemory) {
      systemPromptPrefix += 'Reference our previous conversation when relevant. ';
    }
    
    // Add response length instruction to system message
    const modifiedMessages = [...messages];
    if (modifiedMessages[0].role === 'system') {
      modifiedMessages[0] = {
        ...modifiedMessages[0],
        content: systemPromptPrefix + modifiedMessages[0].content
      };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'compound-beta',
        messages: modifiedMessages,
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

export const createSystemMessage = (character: CharacterTheme): ChatCompletionMessage => {
  return {
    role: 'system',
    content: character.systemPrompt
  };
};

export const createNewUserMessage = (content: string): Message => {
  return {
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date()
  };
};

export const createNewAssistantMessage = (content: string): Message => {
  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date()
  };
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};





