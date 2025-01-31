export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: number;
  lastUpdated: number;
}