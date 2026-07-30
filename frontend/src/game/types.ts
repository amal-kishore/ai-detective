// ── Structured actions from the UI (tapping) ─────────────────────────────────
export type GameAction =
  | { type: 'navigate'; roomId: number }
  | { type: 'inspect'; roomId: number; inspectIndex: number }
  | { type: 'search'; roomId: number }
  | { type: 'talk'; suspectId: number }
  | { type: 'topic'; suspectId: number; topicIndex: number }
  | { type: 'accuse'; suspectId: number }
  | { type: 'freeText'; text: string }

// ── Case data ─────────────────────────────────────────────────────────────────
export interface CaseData {
  id: string
  title: string
  description: string
  difficulty: number
  estimatedMinutes: number
  setting: string
  openingScene: string
  victim: Victim
  murdererIndex: number
  suspects: Suspect[]
  rooms: Room[]
  clues: Clue[]
  timeline: TimelineEvent[]
  insights: CaseInsight[]
  solution: CaseSolution
}

export interface CaseSolution {
  reveal: string   // short dramatic text shown in narrative on correct accusation
  method: string   // how the murder was committed
  motive: string   // why
}

export interface Victim {
  name: string
  age: number
  occupation: string
  causeOfDeath: string
}

export interface Suspect {
  id: number
  name: string
  role: string
  emoji: string
  keywords: string[]
  defaultResponse: string
  topics: SuspectTopic[]
}

export interface SuspectTopic {
  label: string
  keywords: string[]
  response: string
  revealsClueId?: number
  requiresClueId?: number
}

export interface Room {
  id: number
  name: string
  emoji: string
  tagline: string
  keywords: string[]
  unlockedByDefault: boolean
  unlocksAfterClueId?: number
  arrivalText: string
  searchText: string
  inspectables: Inspectable[]
}

export interface Inspectable {
  label: string
  emoji: string
  keywords: string[]
  response: string
  revealsClueId?: number
}

export interface Clue {
  id: number
  name: string
  description: string
  roomId: number
  linkedSuspectIds: number[]
}

export interface TimelineEvent {
  time: string
  event: string
}

export interface CaseInsight {
  id: string
  requiresClueIds: number[]
  text: string
}

// ── Live game state ────────────────────────────────────────────────────────────
export interface GameState {
  id: string
  caseId: string
  status: 'active' | 'won' | 'lost'
  currentRoomId: number | null
  foundClueIds: number[]
  visitedRoomIds: number[]
  unlockedRoomIds: number[]
  inspectedObjects: string[]            // `${roomId}-${inspectIndex}`
  suspectTopicsDiscussed: Record<number, number[]>
  actionCount: number
  wrongAccusations: number
  score: number | null
  notebookEntries: string[]
  messages: ChatMessage[]
}

export interface ChatMessage {
  role: 'player' | 'narrator'
  content: string
}

export interface ActionResult {
  text: string
  newClues: Clue[]
  status: 'active' | 'won' | 'lost'
  score: number | null
  newInsights: string[]
}
