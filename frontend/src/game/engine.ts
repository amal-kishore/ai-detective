import type { GameAction, GameState, CaseData, ActionResult, Clue } from './types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function norm(s: string) { return s.toLowerCase().trim() }
function kw(input: string, keywords: string[]) { const n = norm(input); return keywords.some(k => n.includes(norm(k))) }

function calcScore(state: GameState, caseData: CaseData): number {
  const ratio = caseData.clues.length > 0 ? state.foundClueIds.length / caseData.clues.length : 0
  const penalty = Math.max(0, state.actionCount - 10) * 2 + state.wrongAccusations * 15
  return Math.max(10, Math.round(ratio * 100) - penalty)
}

function addClue(state: GameState, clue: Clue): { state: GameState; isNew: boolean } {
  if (state.foundClueIds.includes(clue.id)) return { state, isNew: false }
  return { state: { ...state, foundClueIds: [...state.foundClueIds, clue.id] }, isNew: true }
}

function checkUnlocks(state: GameState, caseData: CaseData): GameState {
  const unlocked = [...state.unlockedRoomIds]
  let changed = false
  for (const room of caseData.rooms) {
    if (!unlocked.includes(room.id) && room.unlocksAfterClueId != null) {
      if (state.foundClueIds.includes(room.unlocksAfterClueId)) {
        unlocked.push(room.id)
        changed = true
      }
    }
  }
  return changed ? { ...state, unlockedRoomIds: unlocked } : state
}

function checkInsights(state: GameState, caseData: CaseData): { state: GameState; newInsights: string[] } {
  const newInsights: string[] = []
  const existing = new Set(state.notebookEntries)
  for (const insight of caseData.insights) {
    if (!existing.has(insight.text) && insight.requiresClueIds.every(id => state.foundClueIds.includes(id))) {
      newInsights.push(insight.text)
    }
  }
  if (newInsights.length === 0) return { state, newInsights }
  return { state: { ...state, notebookEntries: [...state.notebookEntries, ...newInsights] }, newInsights }
}

function finalize(text: string, state: GameState, newClues: Clue[], caseData: CaseData, status: GameState['status'], score: number | null): { result: ActionResult; nextState: GameState } {
  const s1 = checkUnlocks(state, caseData)
  const { state: s2, newInsights } = checkInsights(s1, caseData)
  return { result: { text, newClues, status, score, newInsights }, nextState: { ...s2, status, score } }
}

// ── Structured action handlers ────────────────────────────────────────────────

function handleNavigate(roomId: number, state: GameState, caseData: CaseData) {
  const room = caseData.rooms.find(r => r.id === roomId)
  if (!room) return finalize('That room is not accessible.', state, [], caseData, 'active', null)
  const visited = state.visitedRoomIds.includes(roomId) ? state.visitedRoomIds : [...state.visitedRoomIds, roomId]
  const next = { ...state, currentRoomId: roomId, visitedRoomIds: visited }
  return finalize(room.arrivalText, next, [], caseData, 'active', null)
}

function handleInspect(roomId: number, idx: number, state: GameState, caseData: CaseData) {
  const room = caseData.rooms.find(r => r.id === roomId)
  if (!room || !room.inspectables[idx]) return finalize('Nothing to inspect there.', state, [], caseData, 'active', null)
  const obj = room.inspectables[idx]
  const key = `${roomId}-${idx}`
  const inspected = state.inspectedObjects.includes(key) ? state.inspectedObjects : [...state.inspectedObjects, key]
  let current = { ...state, inspectedObjects: inspected }
  const newClues: Clue[] = []
  if (obj.revealsClueId != null) {
    const clue = caseData.clues.find(c => c.id === obj.revealsClueId)
    if (clue) {
      const { state: updated, isNew } = addClue(current, clue)
      current = updated
      if (isNew) newClues.push(clue)
    }
  }
  const suffix = newClues.length > 0 ? `\n\n✓ New evidence: ${newClues.map(c => c.name).join(', ')}` : ''
  return finalize(obj.response + suffix, current, newClues, caseData, 'active', null)
}

function handleSearch(roomId: number, state: GameState, caseData: CaseData) {
  const room = caseData.rooms.find(r => r.id === roomId)
  if (!room) return finalize('You are not in a room.', state, [], caseData, 'active', null)
  return finalize(room.searchText, state, [], caseData, 'active', null)
}

function handleTalk(suspectId: number, state: GameState, caseData: CaseData) {
  const suspect = caseData.suspects.find(s => s.id === suspectId)
  if (!suspect) return finalize('That person is not here.', state, [], caseData, 'active', null)
  if (!state.suspectTopicsDiscussed[suspectId]) {
    const next = { ...state, suspectTopicsDiscussed: { ...state.suspectTopicsDiscussed, [suspectId]: [] } }
    return finalize(suspect.defaultResponse, next, [], caseData, 'active', null)
  }
  return finalize(suspect.defaultResponse, state, [], caseData, 'active', null)
}

function handleTopic(suspectId: number, topicIdx: number, state: GameState, caseData: CaseData) {
  const suspect = caseData.suspects.find(s => s.id === suspectId)
  if (!suspect || !suspect.topics[topicIdx]) return finalize('That topic is not available.', state, [], caseData, 'active', null)
  const topic = suspect.topics[topicIdx]
  const discussed = state.suspectTopicsDiscussed[suspectId] ?? []
  const alreadyDiscussed = discussed.includes(topicIdx)
  const next = { ...state, suspectTopicsDiscussed: { ...state.suspectTopicsDiscussed, [suspectId]: alreadyDiscussed ? discussed : [...discussed, topicIdx] } }
  const newClues: Clue[] = []
  let current = next
  if (topic.revealsClueId != null) {
    const clue = caseData.clues.find(c => c.id === topic.revealsClueId)
    if (clue) {
      const { state: updated, isNew } = addClue(current, clue)
      current = updated
      if (isNew) newClues.push(clue)
    }
  }
  const suffix = newClues.length > 0 ? `\n\n✓ New evidence: ${newClues.map(c => c.name).join(', ')}` : ''
  return finalize(topic.response + suffix, current, newClues, caseData, 'active', null)
}

function handleAccuse(suspectId: number, state: GameState, caseData: CaseData) {
  const suspect = caseData.suspects.find(s => s.id === suspectId)
  if (!suspect) return finalize('Unknown suspect.', state, [], caseData, 'active', null)
  const correct = suspectId === caseData.murdererIndex
  if (correct) {
    const score = calcScore(state, caseData)
    const next = { ...state, status: 'won' as const, score }
    const found = state.foundClueIds.length
    const total = caseData.clues.length
    const text = `The room goes quiet.\n\nMargaret Hale does not flinch. For three seconds she simply looks at you.\n\nThen, very slowly, she sits down.\n\n"You are correct."\n\nShe poisoned the brandy before she served it. She had the combination to the safe. She burned the Vienna photographs in the library fireplace while Lord Ashworth was dying in his chair.\n\nHe had discovered she had been selling forged provenances for twelve years.\n\n━━━━━━━━━━━━━━━\n\nCase Closed.\n\nScore: ${score}\nEvidence: ${found}/${total}\nActions: ${state.actionCount}`
    return finalize(text, next, [], caseData, 'won', score)
  }
  const wrong = state.wrongAccusations + 1
  const next = { ...state, wrongAccusations: wrong }
  if (wrong >= 3) {
    return finalize(`Wrong again.\n\nThe constable removes you from the premises. Three false accusations. ${suspect.name} is innocent. The real killer walks free.`, { ...next, status: 'lost', score: 0 }, [], caseData, 'lost', 0)
  }
  return finalize(`${suspect.name} looks at you with shock and contempt.\n\nYou are wrong. The real killer is still in this house.\n\n${3 - wrong} wrong accusation${3 - wrong !== 1 ? 's' : ''} remaining.`, next, [], caseData, 'active', null)
}

// ── Free text fallback ────────────────────────────────────────────────────────

function handleFreeText(input: string, state: GameState, caseData: CaseData) {
  const n = norm(input)

  if (kw(n, ['help', 'what can i do', 'commands'])) return finalize(
    'Tap rooms to move between them.\nTap inspect buttons to examine objects.\nTap suspects to interrogate them.\nUse the evidence board to review clues.\nPress ACCUSE when you know the killer.',
    state, [], caseData, 'active', null)

  if (kw(n, ['clues', 'my notes', 'evidence', 'show clues'])) {
    const found = caseData.clues.filter(c => state.foundClueIds.includes(c.id))
    if (found.length === 0) return finalize('No evidence collected yet.', state, [], caseData, 'active', null)
    return finalize(found.map(c => `✓ ${c.name}\n  ${c.description}`).join('\n\n'), state, [], caseData, 'active', null)
  }

  const accuseMatch = /(?:i accuse|it was|the killer is)\s+(.+)/i.exec(input)
  if (accuseMatch) {
    const name = norm(accuseMatch[1])
    const suspect = caseData.suspects.find(s => s.keywords.some(k => name.includes(norm(k))))
    if (suspect) return handleAccuse(suspect.id, state, caseData)
  }

  for (const room of caseData.rooms) {
    if (kw(n, room.keywords)) return handleNavigate(room.id, state, caseData)
  }

  for (const suspect of caseData.suspects) {
    if (kw(n, suspect.keywords)) return handleTalk(suspect.id, state, caseData)
  }

  if (kw(n, ['search', 'look around'])) {
    const room = caseData.rooms.find(r => r.id === state.currentRoomId)
    if (room) return handleSearch(room.id, state, caseData)
  }

  const inspectKw = ['inspect', 'examine', 'look at', 'check', 'read', 'open', 'search']
  if (inspectKw.some(k => n.includes(k))) {
    const room = caseData.rooms.find(r => r.id === state.currentRoomId)
    if (room) {
      for (let i = 0; i < room.inspectables.length; i++) {
        if (kw(n, room.inspectables[i].keywords)) return handleInspect(room.id, i, state, caseData)
      }
    }
  }

  return finalize(
    'Tap a room, an object, or a suspect — or type more specifically what you want to do.',
    state, [], caseData, 'active', null)
}

// ── Main entry point ──────────────────────────────────────────────────────────

export function processAction(action: GameAction, state: GameState, caseData: CaseData): { result: ActionResult; nextState: GameState } {
  const current = { ...state, actionCount: state.actionCount + 1 }
  switch (action.type) {
    case 'navigate': return handleNavigate(action.roomId, current, caseData)
    case 'inspect':  return handleInspect(action.roomId, action.inspectIndex, current, caseData)
    case 'search':   return handleSearch(action.roomId, current, caseData)
    case 'talk':     return handleTalk(action.suspectId, current, caseData)
    case 'topic':    return handleTopic(action.suspectId, action.topicIndex, current, caseData)
    case 'accuse':   return handleAccuse(action.suspectId, current, caseData)
    case 'freeText': return handleFreeText(action.text, current, caseData)
  }
}

export function getSuspicionScore(suspectId: number, foundClueIds: number[], caseData: CaseData): number {
  const linked = caseData.clues.filter(c => c.linkedSuspectIds.includes(suspectId))
  if (linked.length === 0) return 0
  const found = linked.filter(c => foundClueIds.includes(c.id)).length
  return Math.round((found / linked.length) * 100)
}
