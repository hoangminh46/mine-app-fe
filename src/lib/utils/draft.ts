const DRAFT_PREFIX = "mine-kb-draft-";

export interface DraftData {
  title: string;
  content: string;
  folderId: string;
  status: string;
  difficulty: string;
  tagsInput: string;
  savedAt: number;
}

function getDraftKey(articleId?: string): string {
  return articleId ? `${DRAFT_PREFIX}${articleId}` : `${DRAFT_PREFIX}new`;
}

export function saveDraft(data: DraftData, articleId?: string): boolean {
  try {
    const key = getDraftKey(articleId);
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadDraft(articleId?: string): DraftData | null {
  try {
    const key = getDraftKey(articleId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

export function clearDraft(articleId?: string): void {
  try {
    const key = getDraftKey(articleId);
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function hasDraft(articleId?: string): boolean {
  return loadDraft(articleId) !== null;
}
