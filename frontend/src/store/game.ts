import { create } from 'zustand';
import type { GameState, ActionResult, ChatMessage } from '../game/types';
import { processAction } from '../game/engine';
import { saveGame, loadGame, newGameState, deleteGame } from '../game/storage';
import { getCaseById, ALL_CASES } from '../game/cases';
import type { CaseData } from '../game/types';

interface GameStore {
  game: GameState | null;
  activeCase: CaseData | null;
  loading: boolean;
  startGame: (caseId: string) => void;
  resumeGame: (caseId: string) => boolean;
  sendAction: (input: string) => ActionResult;
  reset: () => void;
  allCases: CaseData[];
}

export const useGame = create<GameStore>((set, get) => ({
  game: null,
  activeCase: null,
  loading: false,
  allCases: ALL_CASES,

  startGame: (caseId) => {
    const caseData = getCaseById(caseId);
    if (!caseData) return;
    deleteGame(caseId);
    const initialState = newGameState(caseId);
    const openingMessage: ChatMessage = { role: 'narrator', content: caseData.openingScene };
    const withOpening: GameState = { ...initialState, messages: [openingMessage] };
    saveGame(withOpening);
    set({ game: withOpening, activeCase: caseData });
  },

  resumeGame: (caseId) => {
    const saved = loadGame(caseId);
    const caseData = getCaseById(caseId);
    if (!saved || !caseData) return false;
    set({ game: saved, activeCase: caseData });
    return true;
  },

  sendAction: (input) => {
    const { game, activeCase } = get();
    if (!game || !activeCase || game.status !== 'active') {
      return { text: '', newClues: [], status: game?.status ?? 'active', score: null };
    }

    const playerMsg: ChatMessage = { role: 'player', content: input };
    const stateWithPlayer: GameState = {
      ...game,
      messages: [...game.messages, playerMsg],
    };

    const { result, nextState } = processAction(input, stateWithPlayer, activeCase);

    const narratorMsg: ChatMessage = { role: 'narrator', content: result.text };
    const finalState: GameState = {
      ...nextState,
      messages: [...nextState.messages, narratorMsg],
    };

    saveGame(finalState);
    set({ game: finalState });
    return result;
  },

  reset: () => {
    set({ game: null, activeCase: null });
  },
}));
