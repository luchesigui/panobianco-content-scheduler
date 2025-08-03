import { ContentPiece } from '@/types/content';

const STORAGE_KEY = 'content-scheduler-data';

export function saveContentToStorage(content: ContentPiece[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }
}

export function loadContentFromStorage(): ContentPiece[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored content:', error);
      }
    }
  }
  return [];
}

export function updateContentInStorage(updatedContent: ContentPiece): void {
  const allContent = loadContentFromStorage();
  const index = allContent.findIndex(item => item.id === updatedContent.id);
  
  if (index !== -1) {
    allContent[index] = updatedContent;
    saveContentToStorage(allContent);
  }
}