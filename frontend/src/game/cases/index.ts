import type { CaseData } from '../types';
import { midnightMurder } from './midnightMurder';

export const ALL_CASES: CaseData[] = [midnightMurder];

export function getCaseById(id: string): CaseData | undefined {
  return ALL_CASES.find((c) => c.id === id);
}
