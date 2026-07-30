export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Case {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: number;
  estimated_minutes: number;
  setting: string;
}

export interface Game {
  id: number;
  case_id: number;
  status: 'active' | 'won' | 'lost';
  found_clue_ids: number[];
  visited_room_ids: number[];
  inventory: unknown[];
  action_count: number;
  wrong_accusations: number;
  score: number | null;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface NarratorResponse {
  narrative: string;
  new_clues: { id: number; name: string; description: string }[];
  game_status: 'active' | 'won' | 'lost';
  score: number | null;
}
