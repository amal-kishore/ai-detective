import type { CaseData, GameState, ActionResult, Clue } from './types';

function norm(s: string): string {
  return s.toLowerCase().trim();
}

function matches(input: string, keywords: string[]): boolean {
  const n = norm(input);
  return keywords.some((k) => n.includes(norm(k)));
}

function calcScore(state: GameState, caseData: CaseData): number {
  const total = caseData.clues.length;
  const found = state.foundClueIds.length;
  const ratio = total > 0 ? found / total : 0;
  const actionPenalty = Math.max(0, state.actionCount - 10) * 2;
  const accusationPenalty = state.wrongAccusations * 15;
  return Math.max(10, Math.round(ratio * 100) - actionPenalty - accusationPenalty);
}

function revealClue(state: GameState, clue: Clue): { state: GameState; isNew: boolean } {
  if (state.foundClueIds.includes(clue.id)) return { state, isNew: false };
  return {
    state: { ...state, foundClueIds: [...state.foundClueIds, clue.id] },
    isNew: true,
  };
}

export function processAction(
  input: string,
  state: GameState,
  caseData: CaseData,
): { result: ActionResult; nextState: GameState } {
  let current = { ...state, actionCount: state.actionCount + 1 };
  const n = norm(input);

  // ── Special commands ──────────────────────────────────────────────
  if (matches(n, ['help', 'what can i do', 'commands', 'how to play'])) {
    return respond(
      `Available actions:\n\n• Go to [room name] — move between rooms\n• Inspect / examine [object] — investigate something specific\n• Search [room] — get an overview of what's in a room\n• Talk to / question [suspect name] — interrogate a suspect\n• Ask [suspect] about [topic] — dig into specific subjects\n• Show clues / my notes — list evidence you've collected\n• I accuse [name] — make your final accusation\n\nRooms: Library, Kitchen, Garden, East Wing, Sitting Room, Margaret's Room`,
      current, [], 'active', null,
    );
  }

  if (matches(n, ['clues', 'my notes', 'evidence', 'show clues', 'what have i found', 'notes'])) {
    const found = caseData.clues.filter((c) => current.foundClueIds.includes(c.id));
    if (found.length === 0) {
      return respond('You have not yet collected any evidence.', current, [], 'active', null);
    }
    const list = found.map((c) => `✓ ${c.name}\n  ${c.description}`).join('\n\n');
    return respond(`Your evidence so far:\n\n${list}`, current, [], 'active', null);
  }

  if (matches(n, ['timeline', 'events', 'what happened', 'sequence'])) {
    const list = caseData.timeline.map((e) => `${e.time} — ${e.event}`).join('\n');
    return respond(`Known timeline:\n\n${list}`, current, [], 'active', null);
  }

  if (matches(n, ['suspects', 'who is here', 'list suspects', 'everyone'])) {
    const list = caseData.suspects.map((s) => `• ${s.name} — ${s.role}`).join('\n');
    return respond(`Persons of interest:\n\n${list}`, current, [], 'active', null);
  }

  // ── Accusation ────────────────────────────────────────────────────
  const accuseMatch = /(?:i accuse|it was|the killer is|the murderer is|arrest)\s+(.+)/i.exec(input);
  if (accuseMatch) {
    const accused = norm(accuseMatch[1]);
    const murderer = caseData.suspects[caseData.murdererIndex];
    const correct = murderer.keywords.some((k) => accused.includes(norm(k)));

    if (correct) {
      const score = calcScore(current, caseData);
      const cluesFound = current.foundClueIds.length;
      const total = caseData.clues.length;
      const next: GameState = { ...current, status: 'won', score };
      return respond(
        `The room goes quiet.\n\nMargaret Hale does not move. Does not flinch. For three seconds she simply looks at you.\n\nThen, very slowly, she sits down.\n\n"You are correct."\n\nThe answer is delivered without drama, without tears — with the same precision she applies to everything.\n\nShe poisoned the brandy before she served it. She had the combination to the safe. She burned the Vienna photographs in the library fireplace while Lord Ashworth was already dying in his chair.\n\nHe had discovered that she had been selling forged provenances through a Paris dealer for twelve years. The paintings in the east wing were her forgeries. The safe held the originals of her contracts. The note — the note she had hoped would never be found.\n\n━━━━━━━━━━━━━━━━━━━━━\n\nCase Closed\n\nScore: ${score}\nEvidence collected: ${cluesFound} / ${total}\nActions taken: ${state.actionCount + 1}\nWrong accusations: ${state.wrongAccusations}`,
        next, [], 'won', score,
      );
    } else {
      const wrong = current.wrongAccusations + 1;
      const nextState: GameState = { ...current, wrongAccusations: wrong };
      if (wrong >= 3) {
        return respond(
          `Wrong again.\n\nThe constable removes you from the premises. Three false accusations. Lord Ashworth's killer walks free.\n\nYou failed.`,
          { ...nextState, status: 'lost', score: 0 }, [], 'lost', 0,
        );
      }
      return respond(
        `You are wrong.\n\nThe accused looks at you with a mixture of shock and contempt.\n\nThe real killer is still in this house.\n\n${3 - wrong} wrong accusation${3 - wrong !== 1 ? 's' : ''} remaining.`,
        nextState, [], 'active', null,
      );
    }
  }

  // ── Room navigation ───────────────────────────────────────────────
  const navKeywords = ['go to', 'enter', 'visit', 'head to', 'walk to', 'move to', 'explore', 'check the', 'to the'];
  const isNav = navKeywords.some((k) => n.startsWith(k) || n.includes(k));
  if (isNav || n.startsWith('go ') || n.startsWith('enter ')) {
    for (const room of caseData.rooms) {
      if (matches(n, room.keywords)) {
        const visited = current.visitedRoomIds.includes(room.id)
          ? current.visitedRoomIds
          : [...current.visitedRoomIds, room.id];
        current = { ...current, currentRoomId: room.id, visitedRoomIds: visited };
        return respond(room.arrivalText, current, [], 'active', null);
      }
    }
  }

  // ── Search room ───────────────────────────────────────────────────
  if (matches(n, ['search', 'look around', 'scan the room', 'investigate the room', 'examine the room'])) {
    const room = caseData.rooms.find((r) => r.id === current.currentRoomId);
    if (room) return respond(room.searchText, current, [], 'active', null);
    return respond('You are not in any particular room. Go somewhere first.', current, [], 'active', null);
  }

  // ── Object inspection in current room ────────────────────────────
  const inspectKeywords = ['inspect', 'examine', 'look at', 'check', 'study', 'pick up', 'open', 'read', 'smell', 'touch', 'search'];
  const isInspect = inspectKeywords.some((k) => n.includes(k));
  if (isInspect) {
    const room = caseData.rooms.find((r) => r.id === current.currentRoomId);
    if (room) {
      for (const obj of room.inspectables) {
        if (matches(n, obj.keywords)) {
          const newClues: Clue[] = [];
          if (obj.revealsClueId != null) {
            const clue = caseData.clues.find((c) => c.id === obj.revealsClueId);
            if (clue) {
              const { state: updated, isNew } = revealClue(current, clue);
              current = updated;
              if (isNew) newClues.push(clue);
            }
          }
          const suffix = newClues.length > 0
            ? `\n\n✓ New evidence: ${newClues.map((c) => c.name).join(', ')}`
            : '';
          return respond(obj.response + suffix, current, newClues, 'active', null);
        }
      }
    }
    // Try all rooms if object not found in current room
    for (const room2 of caseData.rooms) {
      for (const obj of room2.inspectables) {
        if (matches(n, obj.keywords)) {
          const targetRoom = room2;
          return respond(
            `That is in the ${targetRoom.name}. Make your way there first.`,
            current, [], 'active', null,
          );
        }
      }
    }
    return respond(
      `You don't see anything matching that here.\n\nTry "search" to get an overview of the room, or "help" for a list of commands.`,
      current, [], 'active', null,
    );
  }

  // ── Suspect interaction ───────────────────────────────────────────
  const talkKeywords = ['talk', 'speak', 'question', 'interrogate', 'ask', 'interview', 'confront'];
  const isTalk = talkKeywords.some((k) => n.includes(k));
  if (isTalk) {
    for (const suspect of caseData.suspects) {
      if (matches(n, suspect.keywords)) {
        // Check if a topic keyword is also present
        for (const topic of suspect.topics) {
          if (matches(n, topic.keywords)) {
            const newClues: Clue[] = [];
            if (topic.revealsClueId != null) {
              const clue = caseData.clues.find((c) => c.id === topic.revealsClueId);
              if (clue) {
                const { state: updated, isNew } = revealClue(current, clue);
                current = updated;
                if (isNew) newClues.push(clue);
              }
            }
            const suffix = newClues.length > 0
              ? `\n\n✓ New evidence: ${newClues.map((c) => c.name).join(', ')}`
              : '';
            return respond(topic.response + suffix, current, newClues, 'active', null);
          }
        }
        // Default response for this suspect
        return respond(suspect.defaultResponse, current, [], 'active', null);
      }
    }
  }

  // ── Direct room name (no verb) ────────────────────────────────────
  for (const room of caseData.rooms) {
    if (matches(n, room.keywords)) {
      const visited = current.visitedRoomIds.includes(room.id)
        ? current.visitedRoomIds
        : [...current.visitedRoomIds, room.id];
      current = { ...current, currentRoomId: room.id, visitedRoomIds: visited };
      return respond(room.arrivalText, current, [], 'active', null);
    }
  }

  // ── Direct suspect name (no verb) ────────────────────────────────
  for (const suspect of caseData.suspects) {
    if (matches(n, suspect.keywords)) {
      return respond(suspect.defaultResponse, current, [], 'active', null);
    }
  }

  // ── Fallback ──────────────────────────────────────────────────────
  const fallbacks = [
    "You're not sure how to proceed with that.\n\nType \"help\" for a list of available actions, or \"show clues\" to review your evidence.",
    "That action is unclear.\n\nTry inspecting specific objects, talking to suspects by name, or navigating to a room.",
    "Nothing comes of that.\n\nPerhaps there is something more specific to investigate.",
  ];
  return respond(
    fallbacks[current.actionCount % fallbacks.length],
    current, [], 'active', null,
  );
}

function respond(
  text: string,
  state: GameState,
  newClues: Clue[],
  status: GameState['status'],
  score: number | null,
): { result: ActionResult; nextState: GameState } {
  return {
    result: { text, newClues, status, score },
    nextState: { ...state, status, score },
  };
}
