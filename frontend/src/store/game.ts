import { create } from 'zustand'
import type { GameState, ActionResult, ChatMessage, GameAction } from '../game/types'
import { processAction } from '../game/engine'
import { saveGame, loadGame, newGameState, deleteGame } from '../game/storage'
import { getCaseById, ALL_CASES } from '../game/cases'
import type { CaseData } from '../game/types'

interface GameStore {
  game: GameState | null
  activeCase: CaseData | null
  allCases: CaseData[]
  startGame: (caseId: string) => void
  resumeGame: (caseId: string) => boolean
  dispatch: (action: GameAction) => ActionResult
  reset: () => void
}

export const useGame = create<GameStore>((set, get) => ({
  game: null,
  activeCase: null,
  allCases: ALL_CASES,

  startGame: (caseId) => {
    const caseData = getCaseById(caseId)
    if (!caseData) return
    deleteGame(caseId)
    const defaultRooms = caseData.rooms.filter(r => r.unlockedByDefault).map(r => r.id)
    const initial = newGameState(caseId, defaultRooms)
    const opening: ChatMessage = { role: 'narrator', content: caseData.openingScene }
    const withOpening: GameState = { ...initial, messages: [opening] }
    saveGame(withOpening)
    set({ game: withOpening, activeCase: caseData })
  },

  resumeGame: (caseId) => {
    const saved = loadGame(caseId)
    const caseData = getCaseById(caseId)
    if (!saved || !caseData) return false
    // Migrate old saves that may lack new fields
    const defaultRoomIds = caseData.rooms.filter(r => r.unlockedByDefault).map(r => r.id)
    const migrated: GameState = {
      ...saved,
      unlockedRoomIds: saved.unlockedRoomIds ?? defaultRoomIds,
      inspectedObjects: saved.inspectedObjects ?? [],
      suspectTopicsDiscussed: saved.suspectTopicsDiscussed ?? {},
      notebookEntries: saved.notebookEntries ?? [],
    }
    set({ game: migrated, activeCase: caseData })
    return true
  },

  dispatch: (action) => {
    const { game, activeCase } = get()
    if (!game || !activeCase) return { text: '', newClues: [], status: 'active', score: null, newInsights: [] }

    let playerLabel: string | null = null
    if (action.type === 'freeText') playerLabel = action.text
    else if (action.type === 'navigate') playerLabel = `Go to ${activeCase.rooms.find(r => r.id === action.roomId)?.name ?? ''}`
    else if (action.type === 'inspect') playerLabel = activeCase.rooms.find(r => r.id === action.roomId)?.inspectables[action.inspectIndex]?.label ?? null
    else if (action.type === 'search') playerLabel = `Search the room`
    else if (action.type === 'talk') playerLabel = `Talk to ${activeCase.suspects.find(s => s.id === action.suspectId)?.name ?? ''}`
    else if (action.type === 'topic') playerLabel = activeCase.suspects.find(s => s.id === action.suspectId)?.topics[action.topicIndex]?.label ?? null
    else if (action.type === 'accuse') playerLabel = `I accuse ${activeCase.suspects.find(s => s.id === action.suspectId)?.name ?? ''}`

    const stateWithPlayer: GameState = playerLabel
      ? { ...game, messages: [...game.messages, { role: 'player', content: playerLabel }] }
      : game

    const { result, nextState } = processAction(action, stateWithPlayer, activeCase)

    const narratorMsg: ChatMessage = { role: 'narrator', content: result.text }
    const finalState: GameState = { ...nextState, messages: [...nextState.messages, narratorMsg] }

    saveGame(finalState)
    set({ game: finalState })
    return result
  },

  reset: () => set({ game: null, activeCase: null }),
}))
