import type { GameState } from './types'

const PREFIX = 'aidetective_game_'

export function saveGame(state: GameState): void {
  localStorage.setItem(PREFIX + state.caseId, JSON.stringify(state))
}

export function loadGame(caseId: string): GameState | null {
  const raw = localStorage.getItem(PREFIX + caseId)
  return raw ? (JSON.parse(raw) as GameState) : null
}

export function deleteGame(caseId: string): void {
  localStorage.removeItem(PREFIX + caseId)
}

export function newGameState(caseId: string, defaultRoomIds: number[]): GameState {
  return {
    id: `${caseId}-${Date.now()}`,
    caseId,
    status: 'active',
    currentRoomId: null,
    foundClueIds: [],
    visitedRoomIds: [],
    unlockedRoomIds: defaultRoomIds,
    inspectedObjects: [],
    suspectTopicsDiscussed: {},
    actionCount: 0,
    wrongAccusations: 0,
    score: null,
    notebookEntries: [],
    messages: [],
  }
}
