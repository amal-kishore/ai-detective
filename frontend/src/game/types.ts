export interface CaseData {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
  setting: string;
  openingScene: string;
  victim: Victim;
  murdererIndex: number;
  suspects: Suspect[];
  rooms: Room[];
  clues: Clue[];
  timeline: TimelineEvent[];
}

export interface Victim {
  name: string;
  age: number;
  occupation: string;
  causeOfDeath: string;
}

export interface Suspect {
  id: number;
  name: string;
  role: string;
  keywords: string[];
  defaultResponse: string;
  topics: SuspectTopic[];
}

export interface SuspectTopic {
  keywords: string[];
  response: string;
  revealsClueId?: number;
}

export interface Room {
  id: number;
  name: string;
  keywords: string[];
  arrivalText: string;
  searchText: string;
  inspectables: Inspectable[];
}

export interface Inspectable {
  keywords: string[];
  response: string;
  revealsClueId?: number;
}

export interface Clue {
  id: number;
  name: string;
  description: string;
  roomId: number;
}

export interface TimelineEvent {
  time: string;
  event: string;
}

export interface GameState {
  id: string;
  caseId: string;
  status: 'active' | 'won' | 'lost';
  currentRoomId: number | null;
  foundClueIds: number[];
  visitedRoomIds: number[];
  actionCount: number;
  wrongAccusations: number;
  score: number | null;
  messages: ChatMessage[];
}

export interface ChatMessage {
  role: 'player' | 'narrator';
  content: string;
}

export interface ActionResult {
  text: string;
  newClues: Clue[];
  status: 'active' | 'won' | 'lost';
  score: number | null;
}
