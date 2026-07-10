import type { RecordEntry, ResultPayload } from '../types/game';

const RECORDS_KEY = 'neon-gap.records.v1';
const AUDIO_KEY = 'neon-gap.audio-enabled.v1';
const MAX_RECORDS = 10;

export class StorageSystem {
  public static loadAudioEnabled(): boolean {
    if (!hasLocalStorage()) {
      return true;
    }
    return window.localStorage.getItem(AUDIO_KEY) !== 'false';
  }

  public static saveAudioEnabled(enabled: boolean): void {
    if (hasLocalStorage()) {
      window.localStorage.setItem(AUDIO_KEY, String(enabled));
    }
  }

  public static loadRecords(): RecordEntry[] {
    if (!hasLocalStorage()) {
      return [];
    }

    const raw = window.localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as RecordEntry[];
      return sortRecords(parsed).slice(0, MAX_RECORDS);
    } catch {
      return [];
    }
  }

  public static saveResult(result: ResultPayload): RecordEntry[] {
    const entry: RecordEntry = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      playedAt: new Date().toISOString(),
      accuracy: calculateAccuracy(result),
    };
    const records = sortRecords([...StorageSystem.loadRecords(), entry]).slice(0, MAX_RECORDS);
    if (hasLocalStorage()) {
      window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    }
    return records;
  }

  public static clearRecords(): void {
    if (hasLocalStorage()) {
      window.localStorage.removeItem(RECORDS_KEY);
    }
  }
}

export function calculateAccuracy(result: Pick<ResultPayload, 'reachedStage' | 'shotCount'>): number {
  return result.shotCount > 0 ? Math.min(100, Math.round((result.reachedStage / result.shotCount) * 100)) : 0;
}

export function sortRecords(records: RecordEntry[]): RecordEntry[] {
  return [...records].sort((a, b) => {
    if (a.cleared !== b.cleared) {
      return a.cleared ? -1 : 1;
    }
    if (a.cleared) {
      return b.remainingTime - a.remainingTime;
    }
    if (a.reachedStage !== b.reachedStage) {
      return b.reachedStage - a.reachedStage;
    }
    if (a.accuracy !== b.accuracy) {
      return b.accuracy - a.accuracy;
    }
    return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
  });
}

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && 'localStorage' in window;
}
