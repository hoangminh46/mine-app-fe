const STORAGE_KEY = "mine-kb-sidebar-state";

// In-memory state + listener pattern for useSyncExternalStore
let state: Record<string, boolean> = {};
let initialized = false;
const listeners = new Set<() => void>();

function initialize(): void {
  if (initialized) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch {
    // localStorage unavailable
  }
  initialized = true;
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

function notify(): void {
  listeners.forEach((cb) => cb());
}

// useSyncExternalStore subscribe callback
export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Client snapshot: read from in-memory state (synced with localStorage)
export function isFolderExpanded(folderId: string): boolean {
  initialize();
  return state[folderId] ?? true;
}

// Write: update in-memory + localStorage + notify subscribers
export function setFolderExpanded(folderId: string, expanded: boolean): void {
  initialize();
  state[folderId] = expanded;
  persist();
  notify();
}
